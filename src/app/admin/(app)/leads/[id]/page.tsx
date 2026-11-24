import Link from "next/link";
import { notFound } from "next/navigation";
import { GOALS } from "@/lib/leads";
import { getLead, type LeadEvent } from "@/lib/crm";
import { STAGES, STAGE_TONE, formatMoney, stageLabel, stageOf, todayISO, type Counter } from "@/lib/pipeline";
import { sourceLabel } from "@/lib/source";
import { addNote, bumpLeadForm, removeLead, updateLeadStatus } from "@/app/admin/actions";
import { Card, GymPage, btnDanger, btnGhost, formatDate, inputClass } from "@/components/admin/ui";
import { StageIcon } from "@/components/admin/stage-icons";
import { DetailsForm, PhotoUpload } from "@/components/admin/lead-profile";
import { cn } from "@/components/ui";

export const metadata = { title: "Lead" };

const goalLabel = (v: string) => GOALS.find((g) => g.value === v)?.label ?? v;
const daysSince = (iso: string) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
const glassBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 font-mono text-[12px] uppercase tracking-[0.1em] text-white backdrop-blur hover:bg-white/20";

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const data = await getLead(id);
  if (!data) notFound();
  const { lead, events } = data;
  const stage = stageOf(lead.status);
  const tone = STAGE_TONE[stage.value];
  const phone = lead.phone?.replace(/[^\d+]/g, "");
  const first = lead.attribution?.first ?? {};
  const last = lead.attribution?.last ?? {};
  const due = lead.next_follow_up && lead.next_follow_up <= todayISO() && stage.open;
  const touchRows = (t: Record<string, string>) =>
    (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "referrer", "landing_page", "fbclid", "gclid", "ttclid"] as const)
      .filter((k) => t[k])
      .map((k) => [k.replace("utm_", "").replace("_", " "), t[k]] as const);

  return (
    <GymPage>
      <Link href="/admin/leads" className="text-[14px] text-blue-pale hover:underline">← All leads</Link>

      {/* Header: photo, name, stage and one-tap contact. */}
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
        <PhotoUpload id={lead.id} name={lead.name} photo={lead.photo} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <h1 className="display break-words text-[36px] leading-tight text-white sm:text-[44px]">{lead.name}</h1>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[14px] text-mist sm:justify-start">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full py-0.5 pl-1.5 pr-2.5 text-[12.5px] font-semibold", tone.bg, tone.text)}>
              <StageIcon name={stage.icon} className="h-4 w-4" />
              {stage.label}
            </span>
            <span>{goalLabel(lead.goal)}</span>
            <span aria-hidden="true">·</span>
            <span>From {sourceLabel(lead.source)}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(lead.created_at)}</span>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            {phone && (
              <a href={`tel:${phone}`} className={cn(glassBtn, "border-blue bg-blue hover:bg-blue-bright")}>Call</a>
            )}
            {phone && <a href={`sms:${phone}`} className={glassBtn}>Text</a>}
            <a href={`mailto:${lead.email}`} className={glassBtn}>Email</a>
            {lead.instagram && (
              <a href={`https://instagram.com/${lead.instagram}`} target="_blank" rel="noopener noreferrer" className={glassBtn}>
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Client dashboard. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6">
        <CounterTile id={lead.id} counter="calls" label="Calls" value={lead.calls} outcomes />
        <CounterTile id={lead.id} counter="follow_ups" label="Follow-ups" value={lead.follow_ups} />
        <CounterTile id={lead.id} counter="booked_follow_ups" label="After the call" value={lead.booked_follow_ups} />
        <Tile label="Pays per month" value={lead.monthly_cents != null ? formatMoney(lead.monthly_cents) : "—"} accent={lead.monthly_cents != null ? "text-emerald-700" : undefined} />
        <Tile label="Deal potential" value={formatMoney(lead.deal_cents)} />
        <Tile
          label={due ? "Follow-up due" : "Next follow-up"}
          value={lead.next_follow_up ? formatDate(`${lead.next_follow_up}T12:00:00Z`).replace(/, \d{4}$/, "") : "—"}
          accent={due ? "text-red-700" : undefined}
          sub={`${daysSince(lead.created_at)} day${daysSince(lead.created_at) === 1 ? "" : "s"} since the form`}
        />
      </div>

      {/* Stage picker. */}
      <section aria-label="Stage" className="flex flex-col gap-2">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel-light">Move to</h2>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {STAGES.map((s) => {
            const on = s.value === lead.status;
            return (
              <form key={s.value} action={updateLeadStatus}>
                <input type="hidden" name="id" value={lead.id} />
                <input type="hidden" name="status" value={s.value} />
                <button
                  type="submit"
                  disabled={on}
                  aria-pressed={on}
                  className={cn(
                    "flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition-colors",
                    on ? "border-white bg-white text-charcoal" : "border-white/15 bg-white/5 text-mist hover:bg-white/15 hover:text-white",
                  )}
                >
                  <StageIcon name={s.icon} className="h-5 w-5" />
                  {s.short}
                </button>
              </form>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col gap-3 rounded-[14px]">
            <h2 className="text-[18px] font-bold">Notes</h2>
            <form action={addNote} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="body" className="sr-only">Note</label>
              <textarea id="body" name="body" rows={3} required placeholder="Talked for 10 minutes. Knee surgery in March, wants to box again by summer." className={inputClass} />
              <button type="submit" className={`${btnGhost} self-start`}>Save note</button>
            </form>
            {lead.message && (
              <div className="rounded-[8px] bg-off-white p-3 text-[14px]">
                <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-steel">From the form</p>
                <p className="whitespace-pre-wrap">{lead.message}</p>
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-4 rounded-[14px]">
            <h2 className="text-[18px] font-bold">Timeline</h2>
            <ol className="flex flex-col gap-4">
              {events.map((e) => (
                <li key={e.id} className={cn("flex flex-col gap-1 border-l-2 pl-4", e.type === "note" ? "border-blue" : "border-line")}>
                  <span className="text-[13px] text-steel">
                    {eventTitle(e)} · {formatDate(e.created_at, true)}
                  </span>
                  {e.body && e.type !== "update" && <p className="whitespace-pre-wrap text-[15px]">{e.body}</p>}
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card className="flex flex-col gap-4 rounded-[14px]">
            <h2 className="text-[18px] font-bold">Details</h2>
            <DetailsForm
              lead={{
                id: lead.id,
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                instagram: lead.instagram,
                goal: lead.goal,
                monthly_cents: lead.monthly_cents,
                deal_cents: lead.deal_cents,
                next_follow_up: lead.next_follow_up,
              }}
            />
            <p className="text-[13px] text-steel">
              Form: {lead.page_type}
              {lead.offer ? ` · ${lead.offer}` : ""}
            </p>
          </Card>

          <Card className="flex flex-col gap-3 rounded-[14px]">
            <h2 className="text-[18px] font-bold">Where they came from</h2>
            <Touch title="First visit" rows={touchRows(first)} />
            <Touch title="Visit before the form" rows={touchRows(last)} />
          </Card>

          <form action={removeLead}>
            <input type="hidden" name="id" value={lead.id} />
            <button type="submit" className={btnDanger}>Delete lead</button>
          </form>
        </div>
      </div>
    </GymPage>
  );
}

function Tile({ label, value, accent, sub }: { label: string; value: string; accent?: string; sub?: string }) {
  return (
    <div className="flex flex-col justify-between gap-2 rounded-[14px] bg-paper p-4">
      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-steel">{label}</span>
      <span className={cn("display text-[30px] leading-none text-charcoal", accent)}>{value}</span>
      {sub && <span className="text-[12px] text-steel">{sub}</span>}
    </div>
  );
}

const tileBtn =
  "grid h-9 min-w-9 place-items-center rounded-full border border-line bg-off-white px-2.5 text-[13px] font-semibold text-charcoal hover:border-charcoal/40 active:bg-mist";

function CounterTile({ id, counter, label, value, outcomes }: { id: string; counter: Counter; label: string; value: number; outcomes?: boolean }) {
  const hidden = (delta: string, outcome?: string) => (
    <>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="counter" value={counter} />
      <input type="hidden" name="delta" value={delta} />
      {outcome && <input type="hidden" name="outcome" value={outcome} />}
    </>
  );
  return (
    <div className="flex flex-col justify-between gap-2 rounded-[14px] bg-paper p-4">
      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-steel">{label}</span>
      <div className="flex items-end justify-between gap-2">
        <span className="display text-[30px] leading-none text-charcoal">{value}</span>
        <form action={bumpLeadForm}>
          {hidden("-1")}
          <button type="submit" disabled={value === 0} aria-label={`Remove one from ${label.toLowerCase()}`} className={cn(tileBtn, "disabled:opacity-40")}>
            −
          </button>
        </form>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {outcomes ? (
          <>
            <form action={bumpLeadForm}>
              {hidden("1", "no_answer")}
              <button type="submit" className={tileBtn}>+ No answer</button>
            </form>
            <form action={bumpLeadForm}>
              {hidden("1", "answered")}
              <button type="submit" className={tileBtn}>+ Answered</button>
            </form>
          </>
        ) : (
          <form action={bumpLeadForm}>
            {hidden("1")}
            <button type="submit" className={tileBtn}>+1</button>
          </form>
        )}
      </div>
    </div>
  );
}

function Touch({ title, rows }: { title: string; rows: (readonly [string, string])[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-steel">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-[14px] text-steel">Typed the address or no tracking data.</p>
      ) : (
        <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-1 text-[14px]">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="capitalize text-steel">{k}</dt>
              <dd className="break-words">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function eventTitle(e: LeadEvent) {
  const who = e.author_name ?? "Someone";
  switch (e.type) {
    case "created":
      return "Filled the form";
    case "status":
      return `${who} moved to ${stageLabel(e.meta?.to ?? "")}`;
    case "note":
      return `Note by ${who}`;
    case "call":
      return e.meta?.outcome === "no_answer" ? `${who} called, no answer` : e.meta?.outcome === "answered" ? `${who} called, they answered` : `${who} logged a call`;
    case "follow_up":
      return e.meta?.phase === "after_call" ? `${who} followed up after the call` : `${who} followed up`;
    case "update":
      return `${who} updated the details`;
    case "message_out":
      return `Email sent by ${who}`;
    case "message_in":
      return "Email received";
  }
}
