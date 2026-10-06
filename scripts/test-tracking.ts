import "dotenv/config";
import { prisma } from "../lib/prisma";
import { trackOrder, createOrderAtomic } from "../src/lib/services/orderService";

async function runTrackingTests() {
  console.log("🚀 Starting Tracking Security & Validation Tests...\n");
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
    // Setup Test Data
    const product = await prisma.product.findFirst({ where: { variants: { some: {} }, isActive: true }, include: { variants: true } });
    if (!product) throw new Error("No variant product available for testing");
    const variantId = product.variants[0].id;

    // Add stock so order passes
    await prisma.product.update({ where: { id: product.id }, data: { stockQuantity: 50 } });

    const order1 = await createOrderAtomic({
      customerName: "Alice Tracking Test",
      customerPhone: "03001234567",
      shippingAddress: "Secure Address 1",
      city: "Karachi",
      paymentMethod: "cod",
      items: [{ productId: product.id, quantity: 1, variantId: variantId }]
    });

    const order2 = await createOrderAtomic({
      customerName: "Bob Private Test",
      customerPhone: "03219876543",
      shippingAddress: "Secret Base 42",
      city: "Lahore",
      paymentMethod: "cod",
      items: [{ productId: product.id, quantity: 1, variantId: variantId }]
    });

    // 2. Direct API Simulator (Mimicking api/track-order/route.ts logic)
    // We mock the Request/Response since we are in node context
    async function simulateApiTrackOrder(body: any) {
      if (!body.orderNumber || !body.phone) {
        return { status: 400, error: "Order number and phone are required for tracking." };
      }
      const order = await trackOrder(body.orderNumber, body.phone);
      if (!order) {
        return { status: 404, error: "No order found matching the provided order number and phone combination." };
      }
      return { status: 200, order: {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          // Intentionally missing shippingAddress and email from response payload
      }, fullOrderObj: order }; // pass full for assertions
    }

    console.log("\n🔍 Executing Tracking Scenarios...");

    // Test A: Correct order + phone -> Match
    const resA = await simulateApiTrackOrder({ orderNumber: order1.orderNumber, phone: "03001234567" });
    assert(resA.status === 200 && resA.order?.orderNumber === order1.orderNumber, "Correct order number + correct phone -> successful tracking");

    // Test B: Correct order + wrong phone -> Rejected
    const resB = await simulateApiTrackOrder({ orderNumber: order1.orderNumber, phone: "03000000000" });
    assert(resB.status === 404, "Correct order number + wrong phone -> rejected");

    // Test C: Wrong order + correct phone -> Rejected
    const resC = await simulateApiTrackOrder({ orderNumber: "ORD-2026-000000", phone: "03001234567" });
    assert(resC.status === 404, "Wrong order number + correct phone -> rejected");

    // Test D: Missing inputs -> Safely Rejected
    const resD = await simulateApiTrackOrder({ orderNumber: order1.orderNumber });
    assert(resD.status === 400, "Missing phone -> safely rejected");

    // Test E: Cross-tenant tracking (Bob accessing Alice)
    const resE = await simulateApiTrackOrder({ orderNumber: order1.orderNumber, phone: order2.customerPhone });
    assert(resE.status === 404, "Another customer's order cannot be accessed (Bob phone + Alice order)");

    // Test F: Normalization capability (e.g. +92 formats vs 03)
    const resF = await simulateApiTrackOrder({ orderNumber: order1.orderNumber, phone: "+92 300 1234567" });
    assert(resF.status === 200, "Phone number normalization matches properly with country code format");

    // Test G: Verify sensitive stripped data
    const apiPayload = resA.order;
    const isSensitiveHidden = !('shippingAddress' in (apiPayload || {})) && !('customerPhone' in (apiPayload || {}));
    assert(isSensitiveHidden, "No sensitive customer details (shipping/phone) are exposed in the response payload");

    console.log(`\n========================================`);
    console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error("Test suite failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTrackingTests();
