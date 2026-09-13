"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Search" },
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-stone-950">
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-cream/80 backdrop-blur-xl transition-all duration-300 dark:bg-stone-950/80",
          scrolled
            ? "border-stone-200/60 shadow-sm dark:border-stone-800/60"
            : "border-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/dashboard"
              className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.15em] text-stone-800 transition-colors hover:text-stone-600 dark:text-stone-200 dark:hover:text-stone-400"
            >
              Premium Madeira Classic
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200",
                    isActive(item.href)
                      ? "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-50"
                      : "text-stone-500 hover:bg-stone-50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/50 dark:hover:text-stone-200"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 sm:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium tracking-wide transition-all duration-200",
                isActive(item.href)
                  ? "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-50"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800/50 dark:hover:text-stone-200"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 animate-fade-in sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
