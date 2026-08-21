import "dotenv/config";
import { prisma } from "../lib/prisma";

async function verify() {
  try {
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();

    console.log(`Connected to Prisma Postgres successfully!`);
    console.log(`Stats: ${userCount} users, ${categoryCount} categories, ${productCount} products.`);
    console.log("✅ Connected");
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
