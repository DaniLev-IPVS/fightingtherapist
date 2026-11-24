"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { GOALS } from "@/lib/leads";
import { saveLeadDetails, saveLeadPhoto } from "@/app/admin/actions";
import { Field, btnPrimary, inputClass } from "./ui";
import { Avatar } from "./pipeline-board";
import { cn } from "@/components/ui";

/** Loads an image file and returns a centre-cropped square JPEG data URL. */
async function squareJpeg(file: File, size: number, quality: number) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function PhotoUpload({ id, name, photo, className }: { id: string; name: string; photo: string | null; className?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const shown = preview ?? photo;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const [big, thumb] = await Promise.all([squareJpeg(file, 320, 0.82), squareJpeg(file, 80, 0.8)]);
      setPreview(big);
      start(async () => {
        const res = await saveLeadPhoto(id, big, thumb);
        if (res?.error) setError(res.error);
      });
    } catch {
      setError("That file isn't an image this browser can read. Try a JPG or PNG.");
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="group relative rounded-full ring-4 ring-white/15"
        aria-label={shown ? "Change profile picture" : "Add a profile picture"}
      >
        <Avatar name={name} src={shown} className="h-24 w-24 bg-charcoal-3 text-[28px] text-white" />
        <span className="absolute inset-0 grid place-items-center rounded-full bg-ink/60 text-[12px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {pending ? "Saving…" : shown ? "Change" : "Add photo"}
        </span>
        <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-blue text-white shadow-lg">
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M6 2h4l1 2h2.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-7A1.5 1.5 0 0 1 2.5 4H5l1-2zm2 3.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
        </span>
      </button>
      <input ref={input} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={(e) => onFile(e.target.files?.[0])} />
      {shown && !pending && (
        <button
          type="button"
          className="text-[12px] text-steel-light underline hover:text-white"
          onClick={() => {
            setPreview(null);
            start(async () => {
              await saveLeadPhoto(id, null, null);
            });
          }}
        >
          Remove photo
        </button>
      )}
      {error && <p className="max-w-[200px] text-center text-[12px] text-red-300">{error}</p>}
    </div>
  );
}

type Details = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  goal: string;
  monthly_cents: number | null;
  deal_cents: number | null;
  next_follow_up: string | null;
};

const dollars = (c: number | null) => (c == null ? "" : String(Math.round(c / 100)));

export function DetailsForm({ lead }: { lead: Details }) {
  const [state, action, pending] = useActionState(saveLeadDetails, undefined);
  const [, start] = useTransition();
  const err = state?.fieldErrors ?? {};
  return (
    // Submitted by hand so React doesn't reset the fields when there's an error to fix.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        start(() => action(data));
      }}
      className="flex flex-col gap-4"
      noValidate
    >
      <input type="hidden" name="id" value={lead.id} />
      <Field label="Name" htmlFor="name" error={err.name}>
        <input id="name" name="name" defaultValue={lead.name} autoComplete="off" className={inputClass} aria-invalid={!!err.name} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone" error={err.phone}>
          <input id="phone" name="phone" type="tel" defaultValue={lead.phone ?? ""} className={inputClass} aria-invalid={!!err.phone} />
        </Field>
        <Field label="Email" htmlFor="email" error={err.email}>
          <input id="email" name="email" type="email" defaultValue={lead.email} className={inputClass} aria-invalid={!!err.email} />
        </Field>
        <Field label="Instagram" htmlFor="instagram" error={err.instagram}>
          <input id="instagram" name="instagram" defaultValue={lead.instagram ?? ""} placeholder="handle" className={inputClass} aria-invalid={!!err.instagram} />
        </Field>
        <Field label="Wants help with" htmlFor="goal" error={err.goal}>
          <select id="goal" name="goal" defaultValue={lead.goal} className={inputClass}>
            {GOALS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Deal potential ($)" htmlFor="deal" hint="What this client could be worth." error={err.deal}>
          <input id="deal" name="deal" inputMode="decimal" defaultValue={dollars(lead.deal_cents)} placeholder="1800" className={inputClass} aria-invalid={!!err.deal} />
        </Field>
        <Field label="Pays per month ($)" htmlFor="monthly" hint="Once they're a client." error={err.monthly}>
          <input id="monthly" name="monthly" inputMode="decimal" defaultValue={dollars(lead.monthly_cents)} placeholder="450" className={inputClass} aria-invalid={!!err.monthly} />
        </Field>
        <Field label="Next follow-up" htmlFor="next_follow_up" error={err.next_follow_up}>
          <input id="next_follow_up" name="next_follow_up" type="date" defaultValue={lead.next_follow_up ?? ""} className={inputClass} />
        </Field>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Saving…" : "Save details"}
        </button>
        <p aria-live="polite" className={cn("text-[14px]", state?.error ? "text-red-700" : "text-emerald-700")}>
          {state?.error ?? (state?.ok ? "Saved." : "")}
        </p>
      </div>
    </form>
  );
}
