"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { getAttribution } from "@/lib/attribution";
import { GOALS, validateLead, type GoalValue, type LeadErrors, type LeadInput } from "@/lib/leads";
import { cn } from "@/components/ui";

type Props = {
  tone?: "dark" | "light";
  pageType: NonNullable<LeadInput["pageType"]>;
  offer?: string;
  defaultGoal?: GoalValue;
  submitLabel?: string;
  showMessage?: boolean;
  /** Preselect the goal from ?goal= in the URL (used on /contact). */
  goalFromUrl?: boolean;
  /** Offer pages already know the goal: send defaultGoal without asking. */
  hideGoal?: boolean;
  /** Name and email only (free downloads). */
  minimal?: boolean;
};

export function LeadForm({
  tone = "dark",
  pageType,
  offer,
  defaultGoal,
  submitLabel = "Send",
  showMessage = true,
  goalFromUrl = false,
  hideGoal = false,
  minimal = false,
}: Props) {
  const id = useId();
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [download, setDownload] = useState<string | null>(null);
  const goalRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!goalFromUrl || !goalRef.current) return;
    const g = new URLSearchParams(window.location.search).get("goal");
    if (g && GOALS.some((x) => x.value === g)) goalRef.current.value = g;
  }, [goalFromUrl]);

  const dark = tone === "dark";
  const field = cn(
    "w-full rounded-[4px] border px-4 py-3 text-[16px] outline-none transition-colors",
    dark
      ? "border-line-dark bg-charcoal-2 text-off-white placeholder:text-steel-light focus:border-blue-bright"
      : "border-line bg-paper text-charcoal placeholder:text-steel focus:border-blue",
  );
  const label = cn("text-[14px] font-semibold", dark ? "text-mist" : "text-charcoal");
  const errorText = "text-[13px] text-[#ff8a80]";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Partial<LeadInput> = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      goal: String(fd.get("goal") ?? "") as GoalValue,
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
      offer,
      pageType,
    };
    const found = validateLead(payload);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, attribution: getAttribution() }),
      });
      const data = (await res.json()) as { ok: boolean; errors?: LeadErrors; download?: string };
      if (res.ok && data.ok) {
        if (data.download?.startsWith("https://")) setDownload(data.download);
        setStatus("sent");
      } else {
        setErrors(data.errors ?? {});
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent" && download) {
    return (
      <div role="status" className={cn("flex flex-col items-start gap-3 rounded-[6px] border p-6", dark ? "border-line-dark bg-charcoal-2" : "border-line bg-paper")}>
        <p className={cn("display text-[30px]", dark ? "text-off-white" : "text-charcoal")}>It&apos;s yours.</p>
        <p className={dark ? "text-mist" : "text-steel"}>Open it now, or save the link for later.</p>
        <a
          href={download}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-[4px] bg-blue px-7 py-4 font-mono text-[13px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-blue-bright"
        >
          Open the download
        </a>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div role="status" className={cn("rounded-[6px] border p-6", dark ? "border-line-dark bg-charcoal-2" : "border-line bg-paper")}>
        <p className={cn("display text-[30px]", dark ? "text-off-white" : "text-charcoal")}>Message received.</p>
        <p className={cn("mt-2", dark ? "text-mist" : "text-steel")}>
          Zack reads every message himself and replies within 24 hours, usually by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className={label}>Name</label>
          <input id={`${id}-name`} name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} />
          {errors.name && <p id={`${id}-name-err`} className={errorText}>{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className={label}>Email</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} />
          {errors.email && <p id={`${id}-email-err`} className={errorText}>{errors.email}</p>}
        </div>
      </div>
      {hideGoal && <input type="hidden" name="goal" value={defaultGoal ?? "other"} />}
      {!minimal && (
        <div className={cn("grid gap-4", !hideGoal && "sm:grid-cols-2")}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-phone`} className={label}>
              Phone <span className="font-normal opacity-70">(optional)</span>
            </label>
            <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" className={field} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${id}-phone-err` : undefined} />
            {errors.phone && <p id={`${id}-phone-err`} className={errorText}>{errors.phone}</p>}
          </div>
          {!hideGoal && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-goal`} className={label}>What do you need?</label>
              <select ref={goalRef} id={`${id}-goal`} name="goal" defaultValue={defaultGoal ?? ""} className={field} aria-invalid={!!errors.goal} aria-describedby={errors.goal ? `${id}-goal-err` : undefined}>
                <option value="" disabled>Choose one</option>
                {GOALS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              {errors.goal && <p id={`${id}-goal-err`} className={errorText}>{errors.goal}</p>}
            </div>
          )}
        </div>
      )}
      {showMessage && !minimal && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-message`} className={label}>
            Tell Zack about your injury or goal <span className="font-normal opacity-70">(optional)</span>
          </label>
          <textarea id={`${id}-message`} name="message" rows={4} className={field} aria-invalid={!!errors.message} />
          {errors.message && <p className={errorText}>{errors.message}</p>}
        </div>
      )}
      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 inline-flex items-center justify-center rounded-[4px] bg-blue px-7 py-4 font-mono text-[13px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-blue-bright disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
      {status === "error" && !Object.keys(errors).length && (
        <p role="alert" className={errorText}>
          That didn&apos;t go through. Check your connection and try again, or email info@fightingtherapist.com.
        </p>
      )}
    </form>
  );
}
