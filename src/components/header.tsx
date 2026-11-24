"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Button, cn } from "@/components/ui";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-charcoal/95 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur" : "bg-transparent",
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="gutter mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label="The Fighting Therapist, home" onClick={() => setOpen(false)}>
          <Image src="/images/logo-light.png" alt="" width={64} height={45} className="h-[40px] w-auto" preload />
          <span className="display hidden text-[20px] leading-none tracking-wide text-off-white sm:block">
            The Fighting
            <br />
            <span className="text-blue-pale">Therapist</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-mono text-[12px] uppercase tracking-[0.14em] transition-colors hover:text-white",
                pathname === item.href ? "text-white" : "text-mist",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block">
            <Button href="/programs">Find your program</Button>
          </span>
          <Link
            href="/admin/login"
            className="inline-flex h-11 items-center gap-2 rounded-[4px] border border-white/20 px-3 font-mono text-[12px] uppercase tracking-[0.12em] text-mist transition-colors hover:border-white hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Sign in
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded border border-white/20 text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="gutter h-[calc(100dvh-72px)] bg-charcoal pb-10 md:hidden">
        <nav aria-label="Mobile" className="flex flex-col gap-1 pt-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="display border-b border-line-dark py-4 text-[34px] text-off-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button href="/programs" size="lg" className="mt-8 w-full" onClick={() => setOpen(false)}>
          Find your program
        </Button>
      </div>
    </header>
  );
}
