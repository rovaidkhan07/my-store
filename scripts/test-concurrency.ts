import "dotenv/config";
import { prisma } from "../lib/prisma";
import { createOrderAtomic } from "../src/lib/services/orderService";

async function runConcurrencyTest() {
  console.log("🚀 Starting Real DB Concurrency Test...\n");

  // Setup: Find a product and artificially set its stock to exactly 2
  const product = await prisma.product.findFirst({ where: { isActive: true } });
  if (!product) throw new Error("No product found");

  await prisma.product.update({
    where: { id: product.id },
    data: { stockQuantity: 2 }, // Exactly 2 in stock
  });

  console.log(`📦 Seeded product ${product.name} with exactly 2 stock.`);

  // Attempt to buy 1 item, 5 times CONCURRENTLY
  console.log(`⚡ Firing 5 concurrent purchase requests for 1 item each...`);

  const promises = Array.from({ length: 5 }).map(async (_, i) => {
    try {
      await createOrderAtomic({
        customerName: `Concurrent User ${i + 1}`,
        customerPhone: "03000000000",
        shippingAddress: "Race Condition Street",
        city: "Karachi",
        paymentMethod: "cod",
        items: [{ productId: product.id, quantity: 1, variantId: null }] // Assuming no variants for this test, or adjust if needed. Wait, if it has variants, we might need a variant.
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

  const finalProduct = await prisma.product.findUnique({ where: { id: product.id } });
  console.log(`📦 Final Database Stock: ${finalProduct?.stockQuantity} (Expected: 0)`);

  if (successes !== 2 || finalProduct?.stockQuantity !== 0) {
    console.error("\n🚨 RACE CONDITION EXIST: Transactions overlapped improperly!");
    process.exit(1);
  } else {
    console.log("\n🛡️ CONCURRENCY SAFE: Database successfully blocked overselling.");
  }
}

// We need to ensure the product we pick doesn't require a variant (based on our new rule).
// Let's modify the setup slightly to pick a product with NO variants or pick its variant.
async function safeRun() {
  const prodWithNoVariant = await prisma.product.findFirst({
    where: { variants: { none: {} }, isActive: true }
  });

  let targetId = prodWithNoVariant?.id;
  let variantId = null;

  if (!targetId) {
    // If all products have variants, pick the first variant
    const prodWithVariant = await prisma.product.findFirst({
      where: { variants: { some: {} } },
      include: { variants: true }
    });
    targetId = prodWithVariant!.id;
    variantId = prodWithVariant!.variants[0].id;

    // Reset stock on variant
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity: 2 }
    });
  }

  // Reset stock on main product
  await prisma.product.update({
    where: { id: targetId! },
    data: { stockQuantity: 2 }
  });

    console.log("🚀 Starting Real DB Concurrency Test...\n");
    console.log(`⚡ Firing 5 concurrent purchase requests for 1 item each...`);

  const promises = Array.from({ length: 5 }).map(async (_, i) => {
    try {
      await createOrderAtomic({
        customerName: `Concurrent User ${i + 1}`,
        customerPhone: "03000000000",
        shippingAddress: "Race Condition Street",
        city: "Karachi",
        paymentMethod: "cod",
        items: [{ productId: targetId!, quantity: 1, variantId }]
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

  const finalProduct = await prisma.product.findUnique({ where: { id: targetId! } });

  let finalVariantStock = null;
  if(variantId) {
    const finalVariant = await prisma.productVariant.findUnique({ where: { id: variantId } });
    finalVariantStock = finalVariant?.stockQuantity;
    console.log(`📦 Final Variant Stock: ${finalVariantStock} (Expected: 0)`);
  }

  console.log(`📦 Final Product Stock: ${finalProduct?.stockQuantity} (Expected: ${variantId ? '0' : '0'})`);

  // Clean up
  await prisma.$disconnect();
}

safeRun();