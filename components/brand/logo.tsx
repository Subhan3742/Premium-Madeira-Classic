import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

interface MarkProps extends React.SVGProps<SVGSVGElement> {
  tone?: Tone;
}

/**
 * Monogram mark: a gold ring with a geometric "M" and a plank-like baseline.
 * Wood grain lines echo the craft; the ring reads as a maker's seal.
 */
export function LogoMark({ tone = "light", className, ...props }: MarkProps) {
  const id = React.useId();
  const gold = `url(#${id}-gold)`;
  const ink = tone === "light" ? "#FAFAF9" : "#1C1917";

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-gold`} x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E3C06B" />
          <stop offset="0.5" stopColor="#C9A24A" />
          <stop offset="1" stopColor="#9A7328" />
        </linearGradient>
      </defs>
      {/* Seal rings */}
      <circle cx="24" cy="24" r="22" stroke={gold} strokeWidth="1.25" />
      <circle cx="24" cy="24" r="18.5" stroke={gold} strokeWidth="0.6" opacity="0.7" />
      {/* Monogram M */}
      <path
        d="M14.5 32V16.5L24 26.5L33.5 16.5V32"
        stroke={ink}
        strokeWidth="2.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Plank baseline with grain */}
      <path d="M13 35.5H35" stroke={gold} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 38H32" stroke={gold} strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      {/* Crest dot */}
      <circle cx="24" cy="11.5" r="1.1" fill={gold} />
    </svg>
  );
}

interface LogoProps {
  variant?: "horizontal" | "stacked" | "mark";
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const inkClass: Record<Tone, string> = {
  light: "text-white",
  dark: "text-stone-900 dark:text-stone-50",
};

export function Logo({
  variant = "horizontal",
  tone = "light",
  size = "md",
  className,
}: LogoProps) {
  if (variant === "mark") {
    const px = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-14 w-14" : "h-9 w-9";
    return <LogoMark tone={tone} className={cn(px, className)} />;
  }

  if (variant === "stacked") {
    const markPx = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-16 w-16" : "h-14 w-14";
    const namePx =
      size === "sm" ? "text-xl" : size === "lg" ? "text-[2.1rem] sm:text-4xl" : "text-[1.75rem] sm:text-3xl";
    return (
      <div className={cn("flex flex-col items-center text-center", inkClass[tone], className)}>
        <LogoMark tone={tone} className={markPx} />
        <span className={cn("mt-3 font-serif font-medium leading-none tracking-wide", namePx)}>
          Premium Madeira
        </span>
        <span className="mt-2 flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.45em] text-warm-accent-light">
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-warm-accent-light/80" />
          Classic
          <span className="h-px w-6 bg-gradient-to-l from-transparent to-warm-accent-light/80" />
        </span>
      </div>
    );
  }

  // horizontal
  const markPx = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const namePx = size === "sm" ? "text-[15px]" : size === "lg" ? "text-2xl" : "text-lg";
  const subPx = size === "sm" ? "text-[7px] tracking-[0.42em]" : size === "lg" ? "text-[10px] tracking-[0.45em]" : "text-[8px] tracking-[0.45em]";
  const gap = size === "sm" ? "gap-2" : size === "lg" ? "gap-3.5" : "gap-2.5";

  return (
    <div className={cn("flex items-center", gap, inkClass[tone], className)}>
      <LogoMark tone={tone} className={markPx} />
      <div className="flex flex-col leading-none">
        <span className={cn("font-serif font-medium tracking-wide", namePx)}>
          Premium Madeira
        </span>
        <span className={cn("mt-1 font-semibold uppercase text-warm-accent-light", subPx)}>
          Classic
        </span>
      </div>
    </div>
  );
}
