import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-800 shadow-sm backdrop-blur-sm transition-all duration-300 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:bg-stone-900/80 dark:text-stone-200 dark:placeholder:text-stone-500 dark:focus:border-stone-500 dark:focus:ring-stone-700",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
