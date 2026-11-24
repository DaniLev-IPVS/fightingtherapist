"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, cn } from "@/components/ui";

/** Phone-only "Find your program" bar (or "Get started" on sales pages), shown once the hero has scrolled away. */
export function StickyCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/programs" || pathname === "/contact") return null;
  // On a sales page the bar jumps to that page's own form.
  const offerPage = pathname.startsWith("/programs/");

  return (
    <div
      className={cn(
        "gutter fixed inset-x-0 bottom-0 z-40 border-t border-line-dark bg-charcoal/95 pt-3 backdrop-blur transition-transform duration-300 md:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}
      aria-hidden={!show}
    >
      <Button href={offerPage ? "#start" : "/programs"} size="lg" className="w-full" tabIndex={show ? 0 : -1}>
        {offerPage ? "Get started" : "Find your program"}
      </Button>
    </div>
  );
}
