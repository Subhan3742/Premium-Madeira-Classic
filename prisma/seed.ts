import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  { serialNumber: "SN-TV-001", productName: "Samsung QLED 4K Smart TV", category: "Television" },
  { serialNumber: "SN-LP-002", productName: "Dell XPS 15 Laptop", category: "Laptop" },
  { serialNumber: "SN-MB-003", productName: "iPhone 16 Pro Max", category: "Mobile" },
  { serialNumber: "SN-TB-004", productName: "iPad Air M2", category: "Tablet" },
  { serialNumber: "SN-AU-005", productName: "Sony WH-1000XM5 Headphones", category: "Audio" },
  { serialNumber: "SN-CM-006", productName: "Canon EOS R6 Mark II", category: "Camera" },
  { serialNumber: "SN-AP-007", productName: "Dyson V15 Detect Vacuum", category: "Appliances" },
  { serialNumber: "SN-AC-008", productName: "Apple Watch Ultra 2", category: "Accessories" },
  { serialNumber: "SN-EL-009", productName: "Samsung Galaxy S24 Ultra", category: "Mobile" },
  { serialNumber: "SN-LP-010", productName: "MacBook Pro 16-inch M3 Max", category: "Laptop" },
];

async function main() {
  console.log("Seeding database...");

  for (const product of products) {
    await prisma.product.upsert({
      where: { serialNumber: product.serialNumber },
      update: product,
      create: product,
    });
    console.log(`  Created: ${product.productName} (${product.serialNumber})`);
  }

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
