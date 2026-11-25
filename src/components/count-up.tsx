"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a stat like "100+" or "5.0" up from zero when it scrolls into view.
 * The final value is server-rendered, so it reads right without JavaScript.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen at load: leave it as is.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const target = Number(match[1]);
    const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
    const suffix = match[2];
    setShown((0).toFixed(decimals) + suffix);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, Math.max(0, (now - start) / duration)); // the first frame's time can be just before start
          const eased = 1 - Math.pow(1 - p, 3);
          setShown((target * eased).toFixed(decimals) + suffix);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per value
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}
