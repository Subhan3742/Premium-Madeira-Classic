import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth();

    const [total, active, inactive, expired, blocked, recentProducts] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { status: "Active" } }),
        prisma.product.count({ where: { status: "Inactive" } }),
        prisma.product.count({ where: { status: "Expired" } }),
        prisma.product.count({ where: { status: "Blocked" } }),
        prisma.product.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    return NextResponse.json({
      total,
      active,
      inactive,
      expired,
      blocked,
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
