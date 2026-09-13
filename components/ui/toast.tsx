"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastContextType {
  toast: (options: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const counterRef = React.useRef(0);

  const toast = React.useCallback(
    (options: { title: string; description?: string; variant?: "default" | "destructive" }) => {
      const id = ++counterRef.current;
      setToasts((prev) => [...prev, { id, ...options }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-xl border px-5 py-4 shadow-xl backdrop-blur-sm animate-toast-in",
              t.variant === "destructive"
                ? "border-red-100 bg-red-50/95 text-red-800 dark:border-red-900 dark:bg-red-950/95 dark:text-red-200"
                : "border-stone-200/60 bg-white/95 text-stone-800 dark:border-stone-700/60 dark:bg-stone-900/95 dark:text-stone-100"
            )}
          >
            <p className="text-sm font-semibold tracking-tight">{t.title}</p>
            {t.description && (
              <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{t.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
