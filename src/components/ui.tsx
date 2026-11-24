import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("gutter mx-auto w-full max-w-[1240px]", className)}>{children}</div>;
}

type ButtonProps = {
  href: string;
  variant?: "primary" | "ghost-light" | "ghost-dark" | "white";
  size?: "md" | "lg";
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function Button({ href, variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  const external = href.startsWith("http");
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[4px] font-mono uppercase tracking-[0.12em] transition-colors",
    size === "lg" ? "px-7 py-4 text-[13px]" : "px-5 py-3 text-[12px]",
    variant === "primary" && "bg-blue text-white hover:bg-blue-bright",
    variant === "white" && "bg-paper text-charcoal hover:bg-blue-wash",
    variant === "ghost-light" && "border border-white/40 text-white hover:border-white hover:bg-white/10",
    variant === "ghost-dark" && "border border-charcoal/30 text-charcoal hover:border-charcoal hover:bg-charcoal/5",
    className,
  );
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-blue", className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}>
      {eyebrow && <Eyebrow className={dark ? "text-blue-pale" : undefined}>{eyebrow}</Eyebrow>}
      <h2 className={cn("display text-[40px] sm:text-[56px] lg:text-[64px]", dark ? "text-off-white" : "text-charcoal")}>
        {title}
      </h2>
      {intro && (
        <p className={cn("max-w-[60ch] text-[18px]", dark ? "text-mist" : "text-steel")}>{intro}</p>
      )}
    </div>
  );
}

export function Stars({ className, label = "5 out of 5 stars" }: { className?: string; label?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5 text-star", className)} role="img" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-[1em] w-[1em] fill-current" aria-hidden="true">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("h-4 w-4", className)} fill="none" aria-hidden="true">
      <path d="M4 10h11m-4-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
