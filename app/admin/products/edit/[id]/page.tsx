"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/products/product-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (res.status === 404) {
          setError("Product not found");
          setLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
        } else {
          setError("Failed to load product");
        }
      } catch {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id, router]);

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
          Products
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Edit Product
        </h1>
      </div>
      {loading ? (
        <Card>
          <CardContent className="pt-7 space-y-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-32 w-48 rounded-xl" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm text-red-500">{error}</p>
          </CardContent>
        </Card>
      ) : product ? (
        <ProductForm product={product} />
      ) : null}
    </AdminShell>
  );
}
