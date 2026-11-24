import type { ReactNode } from "react";
import { cn } from "@/components/ui";

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

export function PageHeader({ title, intro, actions }: { title: string; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div className="flex flex-col gap-1">
        <h1 className="display text-[40px] text-charcoal">{title}</h1>
        {intro && <p className="text-[15px] text-steel">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-[6px] border border-line bg-paper p-5", className)}>{children}</div>;
}

const STATUS_STYLE: Record<string, string> = {
  new: "bg-blue-wash text-blue",
  contacted: "bg-amber-50 text-amber-800",
  call_booked: "bg-violet-50 text-violet-800",
  won: "bg-emerald-50 text-emerald-800",
  lost: "bg-zinc-100 text-zinc-600",
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
