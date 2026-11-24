"use client";

import { useEffect } from "react";

/**
 * Scroll reveals for the public site. Headings, intro lines and the items of
 * grids and lists below the fold rise and fade in as they scroll into view;
 * items in a row arrive one after another. Anything already on screen when the
 * page loads is left alone, so the first paint never waits on JavaScript.
 * Add data-reveal (="zoom" | "left" | "right") to opt an element in, or
 * data-no-reveal to keep a block and everything inside it still.
 */
const AUTO = [
  "main h2",
  "main h2 + p",
  "main .eyebrow",
  "main :is(.grid, ul, ol, dl, .goal-panels, [data-stagger]) > *",
  "main figure",
  "main [data-reveal]",
].join(", ");

export function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.dataset.shown = "";
          io.unobserve(el);
          el.addEventListener("transitionend", () => (el.dataset.done = ""), { once: true });
          window.setTimeout(() => (el.dataset.done = ""), 1600); // in case transitionend never fires
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const seen = new WeakSet<Element>();
    let retries = 0;
    let retryTimer = 0;
    // React marks DOM nodes it has hydrated; streamed sections can hydrate after load, so wait for them.
    const hydrated = (el: Element) => retries >= 12 || Object.keys(el).some((k) => k.startsWith("__reactFiber"));
    const scan = () => {
      const vh = window.innerHeight;
      let waiting = false;
      for (const el of document.querySelectorAll<HTMLElement>(AUTO)) {
        if (seen.has(el)) continue;
        if (!hydrated(el)) {
          waiting = true;
          continue;
        }
        seen.add(el);
        if (el.closest("[data-no-reveal], .snap-x, .marquee, header, nav, form, [role=dialog]")) continue;
        if (el.parentElement?.closest("[data-reveal]")) continue; // the outer block already animates
        if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
        if (el.getBoundingClientRect().top < vh) {
          el.dataset.shown = "";
          el.dataset.done = "";
          continue;
        }
        // Stagger siblings in a row: each one waits a little longer, up to six steps.
        const parent = el.parentElement;
        if (parent && parent.matches(".grid, ul, ol, dl, .goal-panels, [data-stagger]")) {
          const i = Array.prototype.indexOf.call(parent.children, el) as number;
          el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 90}ms`);
        }
        io.observe(el);
      }
      window.clearTimeout(retryTimer);
      if (waiting) {
        retries++;
        retryTimer = window.setTimeout(scan, 400);
      }
    };

    // New content after client-side navigation.
    let queued = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(scan);
    });
    // Start only once the page has loaded and gone idle, so React has finished
    // hydrating: touching its elements earlier causes hydration mismatches.
    let timer = 0;
    const start = () => {
      root.classList.add("reveal-ready");
      scan();
      mo.observe(document.body, { childList: true, subtree: true });
    };
    const whenIdle = () => {
      timer = window.setTimeout(() => ("requestIdleCallback" in window ? window.requestIdleCallback(start, { timeout: 800 }) : start()), 50);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(retryTimer);
      window.removeEventListener("load", whenIdle);
      io.disconnect();
      mo.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return <div aria-hidden="true" className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-blue-bright" />;
}
