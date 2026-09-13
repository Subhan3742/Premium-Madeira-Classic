import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { getSupabaseAdmin, PRODUCT_IMAGES_BUCKET } from "@/lib/supabase";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/validations";
import sharp from "sharp";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image must be less than 5MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const processedImage = await sharp(buffer)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    if (product.imageUrl) {
      const oldPath = `${id}/image.webp`;
      await getSupabaseAdmin().storage
        .from(PRODUCT_IMAGES_BUCKET)
        .remove([oldPath]);
    }

    const filePath = `${id}/image.webp`;

    const { error: uploadError } = await getSupabaseAdmin().storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, processedImage, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const { data: urlData } = getSupabaseAdmin().storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { imageUrl: urlData.publicUrl },
    });

    return NextResponse.json({ product: updatedProduct });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.imageUrl) {
      return NextResponse.json(
        { error: "Product has no image" },
        { status: 400 }
      );
    }

    const filePath = `${id}/image.webp`;
    await getSupabaseAdmin().storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([filePath]);

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { imageUrl: null },
    });

    return NextResponse.json({ product: updatedProduct });
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
