import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-lg border border-stone-200 bg-white/80 px-4 py-2.5 text-sm text-stone-700 shadow-sm backdrop-blur-sm transition-all duration-300 focus:border-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-300 dark:focus:border-stone-500 dark:focus:ring-stone-700",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export { Select };
