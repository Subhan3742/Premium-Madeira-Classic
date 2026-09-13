"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/products/image-upload";
import { useToast } from "@/components/ui/toast";
import { CATEGORIES } from "@/lib/validations";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
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
    setPreviewUrl(URL.createObjectURL(file));
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
        category: formData.get("category") as string,
      };

      const url = isEditing ? `/api/products/${product.id}` : "/api/products";
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
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  name="productName"
                  placeholder="e.g. Classic Oak Dining Table"
                  defaultValue={product?.productName}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  placeholder="e.g. PMC-001"
                  defaultValue={product?.serialNumber}
                  required
                  className="font-mono"
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
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <ImageUpload
                currentImageUrl={removeImage ? null : product?.imageUrl}
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                previewUrl={previewUrl}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 dark:border-stone-800 sm:flex-row">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
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
              className="w-full sm:w-auto"
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
