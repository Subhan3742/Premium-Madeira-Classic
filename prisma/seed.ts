import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  { serialNumber: "PMC-BD-001", productName: "Classic Walnut King Bed", category: "Bed" },
  { serialNumber: "PMC-SF-002", productName: "Madeira 3-Seater Teak Sofa", category: "Sofa" },
  { serialNumber: "PMC-DT-003", productName: "Solid Oak 6-Seater Dining Table", category: "Dining Table" },
  { serialNumber: "PMC-DC-004", productName: "Sheesham Upholstered Dining Chair", category: "Dining Chair" },
  { serialNumber: "PMC-CT-005", productName: "Live-Edge Acacia Coffee Table", category: "Coffee Table" },
  { serialNumber: "PMC-WR-006", productName: "Heritage 4-Door Mahogany Wardrobe", category: "Wardrobe" },
  { serialNumber: "PMC-DR-007", productName: "Rosewood 6-Drawer Dresser", category: "Dresser" },
  { serialNumber: "PMC-NS-008", productName: "Teak Bedside Nightstand", category: "Nightstand" },
  { serialNumber: "PMC-BS-009", productName: "Tall Oak Bookshelf", category: "Bookshelf" },
  { serialNumber: "PMC-TV-010", productName: "Walnut Floating TV Unit", category: "TV Unit" },
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
