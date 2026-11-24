"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui";

const LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/products", label: "Products" },
];

export function AdminNav() {
  return <NavLinks path={usePathname()} />;
}

/** Without a path nothing is highlighted: used as the prerendered fallback. */
export function NavLinks({ path }: { path: string | null }) {
  return (
    <nav aria-label="Admin" className="flex gap-1 md:flex-col">
      {LINKS.map((l) => {
        const on = path != null && (l.exact ? path === l.href : path.startsWith(l.href));
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "rounded-[4px] px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em] transition-colors",
              on ? "bg-white/10 text-white" : "text-mist hover:bg-white/5 hover:text-white",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
