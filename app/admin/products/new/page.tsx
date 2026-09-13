"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/products/product-form";

export default function NewProductPage() {
  const router = useRouter();

  React.useEffect(() => {
    fetch("/api/auth/session").then((res) => {
      if (!res.ok) router.push("/admin/login");
    });
  }, [router]);

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
          Products
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Add New Product
        </h1>
      </div>
      <ProductForm />
    </AdminShell>
  );
}
