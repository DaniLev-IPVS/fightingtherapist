"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/components/ui";

/** Horizontal snap row with previous/next buttons. Swipe works without them on touch. */
export function Scroller({
  children,
  label,
  tone = "light",
  className,
}: {
  children: ReactNode;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.8), behavior: "smooth" });
  };
  const btn = cn(
    "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
    tone === "dark"
      ? "border-white/25 text-white hover:border-blue hover:bg-blue"
      : "border-charcoal/20 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-white",
  );
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] md:-mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="hidden justify-end gap-2 md:flex">
        <button type="button" className={btn} onClick={() => move(-1)} aria-label={`Previous ${label}`}>
          <svg viewBox="0 0 20 20" className="h-4 w-4 rotate-180" fill="none" aria-hidden="true">
            <path d="M4 10h11m-4-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className={btn} onClick={() => move(1)} aria-label={`Next ${label}`}>
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
            <path d="M4 10h11m-4-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
