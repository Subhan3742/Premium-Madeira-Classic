import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [total, categoryGroups, withImage, addedLast30Days, recentProducts] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.groupBy({ by: ["category"] }),
        prisma.product.count({ where: { imageUrl: { not: null } } }),
        prisma.product.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.product.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return NextResponse.json({
      total,
      categories: categoryGroups.length,
      withImage,
      addedLast30Days,
      recentProducts,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
