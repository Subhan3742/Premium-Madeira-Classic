"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatDate, formatPrice } from "@/lib/utils";
import type { DashboardStats, Product } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/products/stats");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (res.ok) {
          setStats(await res.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [router]);

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
          Overview
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Dashboard
        </h1>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-7">
                <Skeleton className="h-3 w-20 mb-3" />
                <Skeleton className="h-9 w-14" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Products", value: stats.total, icon: "□" },
              { title: "Active", value: stats.active, color: "text-emerald-600 dark:text-emerald-400", icon: "●" },
              { title: "Expired", value: stats.expired, color: "text-red-500 dark:text-red-400", icon: "○" },
              { title: "Inactive", value: stats.inactive, color: "text-stone-400", icon: "◌" },
            ].map((stat, i) => (
              <Card key={stat.title} className={`animate-fade-in-up stagger-${i + 1} opacity-0 hover:shadow-md`}>
                <CardContent className="pt-7">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-400 dark:text-stone-500">
                      {stat.title}
                    </p>
                    <span className="text-stone-200 dark:text-stone-700">{stat.icon}</span>
                  </div>
                  <p className={`mt-2 text-3xl font-light tracking-tight ${stat.color || "text-stone-900 dark:text-stone-50"}`}>
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 animate-fade-in-up stagger-5 opacity-0">
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-tight">
                Recently Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentProducts.length === 0 ? (
                <p className="py-8 text-center text-sm text-stone-400">
                  No products yet
                </p>
              ) : (
                <div className="overflow-x-auto -mx-7 px-7">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-100 dark:border-stone-800">
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          Product
                        </th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          Serial
                        </th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400 hidden sm:table-cell">
                          Category
                        </th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                          Status
                        </th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400 hidden md:table-cell">
                          Price
                        </th>
                        <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-stone-400 hidden lg:table-cell">
                          Added
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentProducts.map((p: Product) => (
                        <tr
                          key={p.id}
                          className="border-b border-stone-50 transition-colors hover:bg-stone-50/50 dark:border-stone-800/30 dark:hover:bg-stone-800/30"
                        >
                          <td className="py-3.5 font-medium text-stone-800 dark:text-stone-100">
                            {p.productName}
                          </td>
                          <td className="py-3.5 font-mono text-xs text-stone-500 dark:text-stone-400">
                            {p.serialNumber}
                          </td>
                          <td className="py-3.5 text-stone-500 dark:text-stone-400 hidden sm:table-cell">
                            {p.category}
                          </td>
                          <td className="py-3.5">
                            <Badge
                              variant={
                                p.status === "Active" ? "success" : p.status === "Expired" ? "destructive" : "secondary"
                              }
                            >
                              {p.status}
                            </Badge>
                          </td>
                          <td className="py-3.5 text-stone-500 dark:text-stone-400 hidden md:table-cell">
                            {formatPrice(p.price)}
                          </td>
                          <td className="py-3.5 text-stone-400 dark:text-stone-500 hidden lg:table-cell">
                            {formatDate(p.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-stone-400">Failed to load dashboard data</p>
      )}
    </AdminShell>
  );
}
