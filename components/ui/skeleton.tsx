import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-stone-100 animate-shimmer dark:bg-stone-800",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
