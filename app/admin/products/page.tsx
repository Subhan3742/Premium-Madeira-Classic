"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminShell } from "@/components/admin/admin-shell";
import { DeleteDialog } from "@/components/products/delete-dialog";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatPrice, getWarrantyStatus } from "@/lib/utils";
import { CATEGORIES, STATUSES } from "@/lib/validations";
import type { Product, ProductsResponse } from "@/types";

export default function ProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = React.useState<ProductsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [deleteProduct, setDeleteProduct] = React.useState<Product | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "10" });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (status) params.set("status", status);

      const res = await fetch(`/api/products?${params}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status, router, toast]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleDelete() {
    if (!deleteProduct) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteProduct.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({ title: "Success", description: "Product deleted" });
        fetchProducts();
      } else {
        const result = await res.json();
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    } finally {
      setDeleting(false);
      setDeleteProduct(null);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  }

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
            Manage
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
            Products
          </h1>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-7">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Button type="submit" variant="secondary">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-7 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : !data || data.products.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-stone-50 dark:bg-stone-800">
                <svg className="h-7 w-7 text-stone-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-sm text-stone-400">No products found</p>
              <Link href="/admin/products/new">
                <Button variant="outline" className="mt-4">
                  Add your first product
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 dark:border-stone-800">
                      <th className="px-7 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Image
                      </th>
                      <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Product
                      </th>
                      <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Serial
                      </th>
                      <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400 hidden md:table-cell">
                        Model
                      </th>
                      <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400 hidden lg:table-cell">
                        Category
                      </th>
                      <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Status
                      </th>
                      <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400 hidden lg:table-cell">
                        Warranty
                      </th>
                      <th className="px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400 hidden xl:table-cell">
                        Created
                      </th>
                      <th className="px-7 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-stone-50 transition-colors hover:bg-stone-50/50 dark:border-stone-800/30 dark:hover:bg-stone-800/30"
                      >
                        <td className="px-7 py-3.5">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt=""
                              className="h-11 w-11 rounded-lg object-cover shadow-sm"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-50 dark:bg-stone-800">
                              <svg className="h-5 w-5 text-stone-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-stone-800 dark:text-stone-100">
                          {product.productName}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-stone-500 dark:text-stone-400">
                          {product.serialNumber}
                        </td>
                        <td className="px-4 py-3.5 text-stone-500 dark:text-stone-400 hidden md:table-cell">
                          {product.model}
                        </td>
                        <td className="px-4 py-3.5 text-stone-500 dark:text-stone-400 hidden lg:table-cell">
                          {product.category}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge
                            variant={
                              product.status === "Active"
                                ? "success"
                                : product.status === "Expired"
                                  ? "destructive"
                                  : product.status === "Blocked"
                                    ? "warning"
                                    : "secondary"
                            }
                          >
                            {product.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <Badge
                            variant={
                              getWarrantyStatus(product.warrantyEnd) === "Active"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {getWarrantyStatus(product.warrantyEnd)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-stone-400 dark:text-stone-500 hidden xl:table-cell">
                          {formatDate(product.createdAt)}
                        </td>
                        <td className="px-7 py-3.5">
                          <div className="flex justify-end gap-1">
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                              onClick={() => setDeleteProduct(product)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-stone-100 px-7 py-5 dark:border-stone-800">
                  <p className="text-xs text-stone-400">
                    Page {data.page} of {data.totalPages} &middot; {data.total} products
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= data.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {deleteProduct && (
        <DeleteDialog
          open={!!deleteProduct}
          onOpenChange={(open) => !open && setDeleteProduct(null)}
          onConfirm={handleDelete}
          loading={deleting}
          productName={deleteProduct.productName}
        />
      )}
    </AdminShell>
  );
}
