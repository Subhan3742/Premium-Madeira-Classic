"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { Product } from "@/types";

const headerLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
];

export default function HomePage() {
  const router = useRouter();
  const [serialNumber, setSerialNumber] = React.useState("");
  const [product, setProduct] = React.useState<Product | null>(null);
  const [notFound, setNotFound] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searched, setSearched] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = serialNumber.trim();
    if (!trimmed) return;

    setLoading(true);
    setProduct(null);
    setNotFound(false);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/products/search?serialNumber=${encodeURIComponent(trimmed)}`
      );

      if (res.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setProduct(data.product);
    } catch {
      setError("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-center px-4 sm:h-16 sm:justify-between sm:px-6">
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.15em] text-white drop-shadow-sm sm:text-sm sm:tracking-[0.2em]">
            Premium Madeira Classic
          </span>
          <div className="hidden items-center gap-5 sm:flex">
            {headerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium uppercase tracking-widest text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-md border border-white/20 px-2.5 py-1 text-xs font-medium uppercase tracking-widest text-white/80 transition-colors hover:border-white/40 hover:text-white disabled:opacity-50"
            >
              {loggingOut ? "..." : "Logout"}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 pb-2.5 sm:hidden">
          {headerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-wider text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-md border border-white/20 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/80 transition-colors hover:border-white/40 hover:text-white disabled:opacity-50"
          >
            {loggingOut ? "..." : "Logout"}
          </button>
        </div>
      </header>

      {/* Hero with video background */}
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover z-0"
        >
          <source src="/woodwork.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 z-[1]" />

        <div className="relative z-10 mx-auto max-w-2xl px-4 pt-24 text-center sm:px-6 sm:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Product Verification
            </p>
          </motion.div>

          <motion.h1
            className="text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Discover Your{" "}
            <span className="font-normal italic text-white/90">Product</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/70"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Enter a serial number to confirm the product is a genuine
            Premium Madeira Classic piece and view its registered details.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              onSubmit={handleSearch}
              className="relative mx-auto max-w-lg"
            >
              <div className="relative flex items-center rounded-2xl border border-stone-200/80 bg-white/90 shadow-lg shadow-stone-200/40 backdrop-blur-md transition-all duration-500 focus-within:border-stone-300 focus-within:shadow-xl focus-within:shadow-stone-200/50 dark:border-stone-700/60 dark:bg-stone-900/90 dark:shadow-stone-900/40 dark:focus-within:border-stone-600">
                <svg
                  className="ml-5 h-5 w-5 flex-shrink-0 text-stone-300 dark:text-stone-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  placeholder="Enter serial number..."
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="h-14 min-w-0 flex-1 bg-transparent px-3 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none sm:h-16 sm:px-4 sm:text-lg dark:text-stone-100 dark:placeholder:text-stone-500"
                />
                <button
                  type="submit"
                  disabled={loading || !serialNumber.trim()}
                  className="mr-2 flex h-10 shrink-0 items-center gap-2 rounded-xl bg-stone-900 px-4 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-stone-800 active:scale-95 disabled:opacity-30 sm:mr-3 sm:h-11 sm:px-6 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-stone-900/30 dark:border-t-stone-900" />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Scroll indicator */}
          {!searched && (
            <motion.div
              className="mt-16 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                Verify your product
              </p>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-3xl bg-cream px-4 pb-16 dark:bg-stone-950 sm:px-6 sm:pb-24">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-stone-200/60 bg-white p-8 shadow-sm dark:border-stone-800/60 dark:bg-stone-900"
            >
              <Skeleton className="h-72 w-full rounded-xl" />
              <div className="mt-6 space-y-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>
            </motion.div>
          )}

          {notFound && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-stone-200/60 bg-white py-20 text-center shadow-sm dark:border-stone-800/60 dark:bg-stone-900"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stone-50 dark:bg-stone-800"
              >
                <svg
                  className="h-9 w-9 text-stone-300 dark:text-stone-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold tracking-tight text-stone-800 dark:text-stone-100">
                Product Not Found
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-stone-400 dark:text-stone-500">
                No product was found with this serial number. Please check the
                number and try again.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setNotFound(false);
                  setSearched(false);
                  setSerialNumber("");
                }}
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-red-100 bg-red-50/50 py-12 text-center dark:border-red-900/30 dark:bg-red-950/30"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setError(null);
                  setSearched(false);
                }}
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {product && (
            <motion.div
              key="product"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-2xl border border-stone-200/60 bg-white shadow-sm dark:border-stone-800/60 dark:bg-stone-900"
            >
              {/* Product Image */}
              {product.imageUrl && (
                <motion.div
                  className="group relative overflow-hidden bg-stone-50 dark:bg-stone-800/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="h-56 w-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.03] sm:h-96 sm:p-6"
                  />
                </motion.div>
              )}

              {/* Product Header */}
              <div className="border-b border-stone-100 px-5 py-5 dark:border-stone-800 sm:px-8 sm:py-7">
                <motion.div
                  className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                >
                  <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                      Product
                    </p>
                    <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
                      {product.productName}
                    </h2>
                  </div>
                  <Badge variant="success">Verified Authentic</Badge>
                </motion.div>
              </div>

              {/* Product Details Grid */}
              <div className="px-5 py-5 sm:px-8 sm:py-7">
                <motion.div
                  className="grid gap-3 sm:grid-cols-2 sm:gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
                  }}
                >
                  <DetailItem label="Serial Number" value={product.serialNumber} mono />
                  <DetailItem label="Category" value={product.category} />
                  <DetailItem label="Registered On" value={formatDate(product.createdAt)} />
                  <DetailItem label="Status" value="Genuine Product" highlight="success" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!searched && !loading && (
          <motion.div
            className="pt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-stone-300 dark:text-stone-600">
              Enter a serial number to verify your product
            </p>
          </motion.div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200/40 bg-cream dark:border-stone-800/40 dark:bg-stone-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6 text-center sm:flex-row sm:justify-between sm:px-6 sm:py-8 sm:text-left">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400 dark:text-stone-500">
            Premium Madeira Classic
          </span>
          <span className="text-xs text-stone-300 dark:text-stone-600">
            &copy; {new Date().getFullYear()} Premium Madeira Classic. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

function DetailItem({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: "success" | "danger";
  mono?: boolean;
}) {
  return (
    <motion.div
      className="rounded-xl bg-stone-50/50 px-4 py-3 dark:bg-stone-800/30 sm:px-5 sm:py-4"
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
        {label}
      </p>
      <p
        className={`${
          highlight === "success"
            ? "text-sm font-semibold text-emerald-600 dark:text-emerald-400"
            : highlight === "danger"
              ? "text-sm font-semibold text-red-600 dark:text-red-400"
              : "text-sm font-medium text-stone-800 dark:text-stone-100"
        }${mono ? " font-mono" : ""}`}
      >
        {value}
      </p>
    </motion.div>
  );
}
