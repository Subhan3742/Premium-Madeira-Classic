import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
        {
          "border-transparent bg-stone-800 text-stone-50 dark:bg-stone-200 dark:text-stone-900":
            variant === "default",
          "border-stone-200 bg-stone-50 text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300":
            variant === "secondary",
          "border-transparent bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300":
            variant === "destructive",
          "border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-400":
            variant === "outline",
          "border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300":
            variant === "success",
          "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300":
            variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
