"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminShell } from "@/components/admin/admin-shell";
import { useToast } from "@/components/ui/toast";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [loadingEmail, setLoadingEmail] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPasswords, setShowPasswords] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/credentials");
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setEmail(data.email ?? "");
        }
      } catch {
        // ignore
      } finally {
        setLoadingEmail(false);
      }
    }
    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: (formData.get("email") as string).trim(),
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    try {
      const res = await fetch("/api/auth/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Could not update credentials");
        return;
      }

      setEmail(data.email);
      formRef.current?.reset();
      toast({
        title: "Credentials updated",
        description: payload.newPassword
          ? "Use your new email and password next time you sign in."
          : "Your login email has been updated.",
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const passwordType = showPasswords ? "text" : "password";

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
          Account
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Settings
        </h1>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Update the email and password used to sign in to the admin panel.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="animate-fade-in-up">
          <CardHeader>
            <CardTitle>Login Credentials</CardTitle>
            <p className="text-sm text-stone-400 dark:text-stone-500">
              Enter your current password to confirm any change.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            {loadingEmail ? (
              <div className="space-y-5">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="animate-slide-down rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Login Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    defaultValue={email}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={passwordType}
                    autoComplete="current-password"
                    placeholder="Required to save changes"
                    required
                  />
                </div>

                <div className="border-t border-stone-100 pt-6 dark:border-stone-800">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                    Change Password
                    <span className="ml-2 font-normal normal-case tracking-normal text-stone-300 dark:text-stone-600">
                      (optional)
                    </span>
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={passwordType}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        minLength={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={passwordType}
                        autoComplete="new-password"
                        placeholder="Repeat new password"
                      />
                    </div>
                  </div>
                  <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <input
                      type="checkbox"
                      checked={showPasswords}
                      onChange={(e) => setShowPasswords(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-stone-300 accent-stone-800 dark:accent-stone-200"
                    />
                    Show passwords
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      formRef.current?.reset();
                      setError(null);
                    }}
                    disabled={saving}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-stone-900/30 dark:border-t-stone-900" />
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up stagger-2 h-fit opacity-0">
          <CardHeader>
            <CardTitle className="text-base">Good to know</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warm-accent" />
                Leave the new password fields empty to change only the email.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warm-accent" />
                Your current session stays signed in after saving.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warm-accent" />
                Keep the new password somewhere safe. There is no reset link.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
