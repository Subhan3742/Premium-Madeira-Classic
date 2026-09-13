"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/products/image-upload";
import { useToast } from "@/components/ui/toast";
import { CATEGORIES, STATUSES } from "@/lib/validations";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
}

function toDateInputValue(date: string | Date | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [removeImage, setRemoveImage] = React.useState(false);

  const isEditing = !!product;

  function handleImageSelect(file: File) {
    setImageFile(file);
    setRemoveImage(false);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  function handleImageRemove() {
    setImageFile(null);
    setPreviewUrl(null);
    setRemoveImage(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        serialNumber: formData.get("serialNumber") as string,
        productName: formData.get("productName") as string,
        model: formData.get("model") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        status: formData.get("status") as string,
        manufacturingDate: formData.get("manufacturingDate") as string,
        warrantyStart: formData.get("warrantyStart") as string,
        warrantyEnd: formData.get("warrantyEnd") as string,
      };

      const url = isEditing
        ? `/api/products/${product.id}`
        : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
        setLoading(false);
        return;
      }

      const productId = result.product.id;

      if (imageFile) {
        const imgFormData = new FormData();
        imgFormData.append("image", imageFile);
        const imgRes = await fetch(`/api/products/${productId}/image`, {
          method: "POST",
          body: imgFormData,
        });
        if (!imgRes.ok) {
          const imgResult = await imgRes.json();
          toast({
            title: "Warning",
            description: `Product saved but image upload failed: ${imgResult.error}`,
            variant: "destructive",
          });
        }
      } else if (removeImage && isEditing && product.imageUrl) {
        await fetch(`/api/products/${productId}/image`, { method: "DELETE" });
      }

      toast({
        title: "Success",
        description: isEditing ? "Product updated" : "Product created",
      });
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {isEditing ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Information */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
              Product Information
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  name="productName"
                  placeholder="e.g. Samsung QLED TV"
                  defaultValue={product?.productName}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  placeholder="e.g. SN-TV-001"
                  defaultValue={product?.serialNumber}
                  required
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  placeholder="e.g. QN65Q80C"
                  defaultValue={product?.model}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  name="category"
                  defaultValue={product?.category || ""}
                  required
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  defaultValue={product ? Number(product.price) : ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  defaultValue={product?.status || "Active"}
                  required
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
              Dates &amp; Warranty
            </p>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                <Input
                  id="manufacturingDate"
                  name="manufacturingDate"
                  type="date"
                  defaultValue={toDateInputValue(product?.manufacturingDate)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyStart">Warranty Start</Label>
                <Input
                  id="warrantyStart"
                  name="warrantyStart"
                  type="date"
                  defaultValue={toDateInputValue(product?.warrantyStart)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyEnd">Warranty End</Label>
                <Input
                  id="warrantyEnd"
                  name="warrantyEnd"
                  type="date"
                  defaultValue={toDateInputValue(product?.warrantyEnd)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
              Description
            </p>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Product description (optional)"
              defaultValue={product?.description || ""}
            />
          </div>

          {/* Image */}
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
              Product Image
            </p>
            <ImageUpload
              currentImageUrl={removeImage ? null : product?.imageUrl}
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              previewUrl={previewUrl}
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-stone-100 pt-6 dark:border-stone-800">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {isEditing ? "Updating..." : "Creating..."}
                </span>
              ) : isEditing ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
