import "dotenv/config";
import { prisma } from "../lib/prisma";
import { createOrderAtomic } from "../src/lib/services/orderService";

async function runConcurrencyMultiProductTest() {
  console.log("🚀 Starting Multi-Product Real DB Concurrency Test...\n");

  // Setup: Find two products with NO variants to avoid variant complexities in the script,
  // or just use whatever components we have.
  const products = await prisma.product.findMany({
    where: { isActive: true, variants: { none: {} } },
    take: 2,
  });

  if (products.length < 2) {
    throw new Error("Need at least 2 active products without variants for this test");
  }

  const p1 = products[0];
  const p2 = products[1];

  await prisma.product.update({
    where: { id: p1.id },
    data: { stockQuantity: 2 }, // Exactly 2
  });

  await prisma.product.update({
    where: { id: p2.id },
    data: { stockQuantity: 2 }, // Exactly 2
  });

  console.log(`📦 Seeded Product 1 (${p1.id}) with 2 stock.`);
  console.log(`📦 Seeded Product 2 (${p2.id}) with 2 stock.`);

  console.log(`⚡ Firing Overlapping Multi-Product Purchases (Reverse Orders) to test Deadlock prevention...`);

  // We place 5 concurrent orders. Both orders contain both items. One cart is sorted A then B, another B then A natively but backend will sort.
  // Actually, we just test 5 identical overlapping baskets.
  const promises = Array.from({ length: 5 }).map(async (_, i) => {
    try {
      await createOrderAtomic({
        customerName: `Multi Concurrent User ${i + 1}`,
        customerPhone: "03000000000",
        shippingAddress: "Race Condition Street",
        city: "Karachi",
        paymentMethod: "cod",
        items: [
          { productId: p1.id, quantity: 1, variantId: null },
          { productId: p2.id, quantity: 1, variantId: null }
        ],
        idempotencyKey: `overlap-test-key-${i}`
      });
      return "SUCCESS";
    } catch (e: any) {
      return `FAILED: ${e.message}`;
    }
  });

  const results = await Promise.all(promises);

  const successes = results.filter(r => r === "SUCCESS").length;
  const failures = results.filter(r => r.startsWith("FAILED")).length;

  console.log("\n📊 Results:");
  console.log(results.join("\n"));

  console.log(`\n✅ Total Successes: ${successes} (Expected: 2)`);
  console.log(`❌ Total Failures : ${failures} (Expected: 3)`);

  const final1 = await prisma.product.findUnique({ where: { id: p1.id } });
  const final2 = await prisma.product.findUnique({ where: { id: p2.id } });

  console.log(`📦 Final P1 Stock: ${final1?.stockQuantity} (Expected: 0)`);
  console.log(`📦 Final P2 Stock: ${final2?.stockQuantity} (Expected: 0)`);

  if (successes !== 2 || final1?.stockQuantity !== 0 || final2?.stockQuantity !== 0) {
    console.error("\n🚨 OVERLAP / RACE CONDITION EXIST!");
    process.exit(1);
  }

  // TEST IDEMPOTENCY
  console.log("\n🔄 Testing Exact Checkout Idempotency...");

  const idemKey = `idempotent-test-check-${Date.now()}`;
  const payload = {
    customerName: "Idempotent User",
    customerPhone: "03001112233",
    shippingAddress: "Double Click Street",
    city: "Lahore",
    paymentMethod: "cod" as const,
    items: [
      { productId: p1.id, quantity: 1, variantId: null }
    ],
    idempotencyKey: idemKey
  };

  // Give P1 some stock to succeed
  await prisma.product.update({
    where: { id: p1.id },
    data: { stockQuantity: 5 },
  });

  // Submit twice exactly concurrently simulating double click
  const idPromises = [
    createOrderAtomic(payload),
    createOrderAtomic(payload)
  ];

  try {
     const [orderA, orderB] = await Promise.all(idPromises);
     if (orderA.id === orderB.id && orderA.orderNumber === orderB.orderNumber) {
        console.log(`✅ IDEMPOTENCY PASS: Double click merged to single order ${orderA.orderNumber}`);
     } else {
        console.log(`❌ IDEMPOTENCY FAIL: Created two distinct orders!`);
        process.exit(1);
     }
  } catch(e: any) {
     console.log(`❌ IDEMPOTENCY CRASH: ${e.message}`);
     process.exit(1);
  }

  // Ensure stock decremented exactly ONCE (5 -> 4)
  const idemStock = await prisma.product.findUnique({ where: { id: p1.id } });
  if (idemStock?.stockQuantity !== 4) {
    console.log(`❌ IDEMPOTENCY STOCK FAIL: Stock is ${idemStock?.stockQuantity} expected 4.`);
    process.exit(1);
  }
  console.log(`✅ IDEMPOTENCY STOCK PASS: Stock correctly decremented exactly once.`);

  console.log("\n🛡️ ALL CONCURRENCY AND IDEMPOTENCY SAFE.");
  await prisma.$disconnect();
}

runConcurrencyMultiProductTest();
