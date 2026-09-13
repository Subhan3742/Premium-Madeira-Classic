import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    serialNumber: "SN-TV-001",
    productName: "Samsung QLED 4K Smart TV",
    model: "QN65Q80C",
    category: "Television",
    description: "65-inch QLED 4K Smart TV with Quantum Processor, Motion Xcelerator Turbo+, and Object Tracking Sound.",
    price: 999.99,
    status: "Active",
    manufacturingDate: new Date("2025-01-15"),
    warrantyStart: new Date("2025-02-01"),
    warrantyEnd: new Date("2027-02-01"),
  },
  {
    serialNumber: "SN-LP-002",
    productName: "Dell XPS 15 Laptop",
    model: "XPS-9530",
    category: "Laptop",
    description: "15.6-inch OLED display, Intel Core i9, 32GB RAM, 1TB SSD. Premium ultrabook for professionals.",
    price: 1899.99,
    status: "Active",
    manufacturingDate: new Date("2025-03-10"),
    warrantyStart: new Date("2025-04-01"),
    warrantyEnd: new Date("2028-04-01"),
  },
  {
    serialNumber: "SN-MB-003",
    productName: "iPhone 16 Pro Max",
    model: "A3090",
    category: "Mobile",
    description: "6.9-inch Super Retina XDR display, A18 Pro chip, 48MP camera system, titanium design.",
    price: 1199.00,
    status: "Active",
    manufacturingDate: new Date("2025-06-20"),
    warrantyStart: new Date("2025-07-01"),
    warrantyEnd: new Date("2026-07-01"),
  },
  {
    serialNumber: "SN-TB-004",
    productName: "iPad Air M2",
    model: "MUXL3LL/A",
    category: "Tablet",
    description: "11-inch Liquid Retina display, M2 chip, 256GB storage. Perfect for work and creativity.",
    price: 799.00,
    status: "Active",
    manufacturingDate: new Date("2025-02-05"),
    warrantyStart: new Date("2025-03-01"),
    warrantyEnd: new Date("2027-03-01"),
  },
  {
    serialNumber: "SN-AU-005",
    productName: "Sony WH-1000XM5 Headphones",
    model: "WH1000XM5",
    category: "Audio",
    description: "Industry-leading noise cancellation, 30-hour battery life, multipoint connection.",
    price: 349.99,
    status: "Active",
    manufacturingDate: new Date("2024-11-01"),
    warrantyStart: new Date("2024-12-01"),
    warrantyEnd: new Date("2025-12-01"),
  },
  {
    serialNumber: "SN-CM-006",
    productName: "Canon EOS R6 Mark II",
    model: "EOS-R6M2",
    category: "Camera",
    description: "24.2MP Full-Frame CMOS sensor, 4K 60p video, up to 40fps continuous shooting.",
    price: 2499.00,
    status: "Active",
    manufacturingDate: new Date("2024-08-15"),
    warrantyStart: new Date("2024-09-01"),
    warrantyEnd: new Date("2026-09-01"),
  },
  {
    serialNumber: "SN-AP-007",
    productName: "Dyson V15 Detect Vacuum",
    model: "V15-DETECT",
    category: "Appliances",
    description: "Laser-equipped cordless vacuum with piezo sensor for dust detection and HEPA filtration.",
    price: 749.99,
    status: "Inactive",
    manufacturingDate: new Date("2024-05-20"),
    warrantyStart: new Date("2024-06-01"),
    warrantyEnd: new Date("2026-06-01"),
  },
  {
    serialNumber: "SN-AC-008",
    productName: "Apple Watch Ultra 2",
    model: "MQDY3LL/A",
    category: "Accessories",
    description: "49mm titanium case, precision dual-frequency GPS, up to 36-hour battery life.",
    price: 799.00,
    status: "Active",
    manufacturingDate: new Date("2025-04-10"),
    warrantyStart: new Date("2025-05-01"),
    warrantyEnd: new Date("2027-05-01"),
  },
  {
    serialNumber: "SN-EL-009",
    productName: "Samsung Galaxy S24 Ultra",
    model: "SM-S928B",
    category: "Mobile",
    description: "6.8-inch QHD+ display, Snapdragon 8 Gen 3, 200MP camera, built-in S Pen.",
    price: 1299.99,
    status: "Expired",
    manufacturingDate: new Date("2023-01-10"),
    warrantyStart: new Date("2023-02-01"),
    warrantyEnd: new Date("2024-02-01"),
  },
  {
    serialNumber: "SN-LP-010",
    productName: "MacBook Pro 16-inch M3 Max",
    model: "MRW23LL/A",
    category: "Laptop",
    description: "16-inch Liquid Retina XDR display, M3 Max chip, 36GB memory, 1TB SSD.",
    price: 3499.00,
    status: "Blocked",
    manufacturingDate: new Date("2025-01-05"),
    warrantyStart: new Date("2025-02-01"),
    warrantyEnd: new Date("2028-02-01"),
  },
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
