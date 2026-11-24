import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/components/ui";
import { STAGE_TONE } from "@/lib/pipeline";

export const inputClass =
  "w-full rounded-[4px] border border-line bg-paper px-3 py-2.5 text-[15px] text-charcoal outline-none transition-colors placeholder:text-steel-light focus:border-blue aria-[invalid=true]:border-red-600";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-[4px] bg-blue px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-blue-bright disabled:opacity-60";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-[4px] border border-line bg-paper px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-charcoal transition-colors hover:border-charcoal/40";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-[4px] border border-red-200 bg-paper px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-red-700 transition-colors hover:bg-red-50";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[14px] font-semibold text-charcoal">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-[13px] text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[13px] text-steel">{hint}</p>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  intro,
  actions,
  dark,
}: {
  title: string;
  intro?: ReactNode;
  actions?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4 border-b pb-6", dark ? "border-white/10" : "border-line")}>
      <div className="flex flex-col gap-1">
        <h1 className={cn("display text-[40px]", dark ? "text-white" : "text-charcoal")}>{title}</h1>
        {intro && <p className={cn("text-[15px]", dark ? "text-mist" : "text-steel")}>{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-[6px] border border-line bg-paper p-5", className)}>{children}</div>;
}

const STATUS_STYLE: Record<string, string> = {
  ...Object.fromEntries(Object.entries(STAGE_TONE).map(([k, v]) => [k, `${v.bg} ${v.text}`])),
  draft: "bg-zinc-100 text-zinc-600",
  published: "bg-emerald-50 text-emerald-800",
};

export function Pill({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold", STATUS_STYLE[tone] ?? "bg-zinc-100 text-zinc-700")}>
      {children}
    </span>
  );
}

export function formatDate(iso: string, withTime = false) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: "America/Toronto",
  }).format(new Date(iso));
}

/**
 * Dark gym backdrop for the CRM pages: the photo sits faint at the top and fades
 * into near-black, so cards and text stay easy to read.
 */
export function GymPage({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate -mx-5 -my-8 min-h-svh overflow-x-clip bg-ink px-5 py-8 md:-mx-10 md:-my-10 md:px-10 md:py-10">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[680px]">
        <Image src="/images/admin/gym.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_60%] opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/75 to-ink" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
