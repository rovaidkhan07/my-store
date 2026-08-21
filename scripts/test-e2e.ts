import "dotenv/config";
import { prisma } from "../lib/prisma";
import { getProducts, getProductBySlug } from "../src/lib/services/productService";
import { createOrderAtomic, getOrderByNumber, updateOrderStatus } from "../src/lib/services/orderService";
import { adjustStock, listInventory } from "../src/lib/services/inventoryService";
import { getDashboardMetrics } from "../src/lib/services/analyticsService";
import { comparePassword } from "../src/lib/auth/jwt";

async function runTests() {
  console.log("🚀 Starting MobileHub E2E Business Logic & API Tests...\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Catalog & Search Tests
    console.log("📦 1. Testing Catalog & Products Service...");
    const productsResult = await getProducts({ limit: 10 });
    assert(productsResult.products.length > 0, "Fetch active products list");
    assert(productsResult.totalCount >= 20, "Total seeded product count >= 20");

    const searchResult = await getProducts({ search: "Anker" });
    assert(
      searchResult.products.every((p) => p.name.includes("Anker") || p.brand.includes("Anker") || p.description.includes("Anker")),
      "Search filtering by keyword 'Anker'"
    );

    const chargerProd = await getProductBySlug("anker-312-20w-fast-charger");
    assert(chargerProd !== null, "Fetch product by SEO slug");
    assert(chargerProd?.variants.length === 2, "Product variants loaded correctly");

    // 2. Pricing & Atomic Order Creation Test
    console.log("\n🛒 2. Testing Atomic Order Placement & Stock Decrement...");
    if (!chargerProd) throw new Error("Charger product not found");

    const initialStock = chargerProd.stockQuantity;
    const testItemQty = 2;

    const testOrder = await createOrderAtomic({
      customerName: "Automated QA Test",
      customerPhone: "03009998877",
      customerEmail: "qa.test@mobilehub.pk",
      shippingAddress: "Street 5, Test Plaza, Karachi",
      city: "Karachi",
      postalCode: "75000",
      notes: "E2E Automated test order",
      paymentMethod: "cod",
      items: [
        {
          productId: chargerProd.id,
          variantId: chargerProd.variants[0]?.id || null,
          quantity: testItemQty,
        },
      ],
    });

    assert(testOrder.orderNumber.startsWith("ORD-"), `Order number format valid: ${testOrder.orderNumber}`);
    assert(testOrder.items.length === 1, "Order items snapshot created");

    // Verify stock decreased by 2
    const updatedProd = await prisma.product.findUnique({ where: { id: chargerProd.id } });
    assert(
      updatedProd?.stockQuantity === initialStock - testItemQty,
      `Stock accurately decremented: ${initialStock} -> ${updatedProd?.stockQuantity}`
    );

    // Verify inventory transaction audit row exists
    const invTx = await prisma.inventoryTransaction.findFirst({
      where: { referenceId: testOrder.orderNumber },
    });
    assert(invTx !== null && invTx.quantity === -testItemQty, "Inventory audit transaction logged");

    // 3. Order Status & Cancellation Stock Restoration Test
    console.log("\n🔄 3. Testing Order Status Updates & Stock Restoration...");
    const updatedOrder = await updateOrderStatus(testOrder.id, "shipped", "Dispatched with TCS #9988");
    assert(updatedOrder?.orderStatus === "shipped", "Order marked as Shipped");

    // Cancel order and verify stock restored
    await updateOrderStatus(testOrder.id, "cancelled", "Cancelled by test");
    const restoredProd = await prisma.product.findUnique({ where: { id: chargerProd.id } });
    assert(
      restoredProd?.stockQuantity === initialStock,
      `Stock accurately restored on cancellation: ${restoredProd?.stockQuantity} == ${initialStock}`
    );

    // 4. Admin Authentication Test
    console.log("\n🔐 4. Testing Admin Authentication...");
    const adminUser = await prisma.user.findUnique({ where: { email: "admin@mobilehub.pk" } });
    assert(adminUser !== null && adminUser.role === "admin", "Admin account seeded in database");

    const validPass = await comparePassword("admin123@MobileHub", adminUser!.passwordHash);
    assert(validPass === true, "Admin password hash verification succeeds");

    const invalidPass = await comparePassword("wrongpassword", adminUser!.passwordHash);
    assert(invalidPass === false, "Invalid password correctly rejected");

    // 5. Dashboard Metrics Test
    console.log("\n📊 5. Testing Dashboard Analytics Calculation...");
    const metrics = await getDashboardMetrics();
    assert(typeof metrics.totalRevenue === "number" && metrics.totalRevenue > 0, "Total revenue calculated from orders");
    assert(metrics.totalOrders > 0, "Total orders counted");

    // 6. Manual Inventory Adjustment Test
    console.log("\n📦 6. Testing Manual Inventory Adjustment...");
    await adjustStock({
      productId: chargerProd.id,
      quantityChange: 15,
      transactionType: "purchase",
      notes: "Received new supplier shipment batch #TEST",
    });

    const adjustedProd = await prisma.product.findUnique({ where: { id: chargerProd.id } });
    assert(
      adjustedProd?.stockQuantity === initialStock + 15,
      `Manual stock increment verified: ${adjustedProd?.stockQuantity}`
    );

    console.log(`\n========================================`);
    console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Test suite encountered error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
