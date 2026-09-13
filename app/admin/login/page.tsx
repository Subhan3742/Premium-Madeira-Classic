"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-cream px-6 dark:bg-stone-950">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-stone-200/30 blur-3xl dark:bg-stone-800/20" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-stone-100/40 blur-3xl dark:bg-stone-900/20" />
      </div>

      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500">
            Admin Portal
          </p>
          <h1 className="text-3xl font-light tracking-tight text-stone-900 dark:text-stone-50">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-stone-400 dark:text-stone-500">
            Sign in to manage your products
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200/60 bg-white p-8 shadow-sm dark:border-stone-800/60 dark:bg-stone-900">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 animate-slide-down dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-stone-300 dark:text-stone-600">
          Serial Verify &mdash; Admin Only
        </p>
      </div>
    </div>
  );
}
