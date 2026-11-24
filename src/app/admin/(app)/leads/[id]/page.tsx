import Link from "next/link";
import { notFound } from "next/navigation";
import { GOALS } from "@/lib/leads";
import { STATUSES, getLead, statusLabel, type LeadEvent } from "@/lib/crm";
import { sourceLabel } from "@/lib/source";
import { addNote, removeLead, updateLeadStatus } from "@/app/admin/actions";
import { Card, Pill, btnDanger, btnGhost, btnPrimary, formatDate, inputClass } from "@/components/admin/ui";

export const metadata = { title: "Lead" };

const goalLabel = (v: string) => GOALS.find((g) => g.value === v)?.label ?? v;

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const data = await getLead(id);
  if (!data) notFound();
  const { lead, events } = data;
  const first = lead.attribution?.first ?? {};
  const last = lead.attribution?.last ?? {};
  const touchRows = (t: Record<string, string>) =>
    (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "referrer", "landing_page", "fbclid", "gclid", "ttclid"] as const)
      .filter((k) => t[k])
      .map((k) => [k.replace("utm_", "").replace("_", " "), t[k]] as const);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/leads" className="text-[14px] text-blue hover:underline">← All leads</Link>

      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="display text-[40px] text-charcoal">{lead.name}</h1>
          <div className="flex flex-wrap items-center gap-2 text-[14px] text-steel">
            <Pill tone={lead.status}>{statusLabel(lead.status)}</Pill>
            <span>{goalLabel(lead.goal)}</span>
            <span aria-hidden="true">·</span>
            <span>Came from {sourceLabel(lead.source)}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDate(lead.created_at, true)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${lead.email}`} className={btnPrimary}>Email</a>
          {lead.phone && <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className={btnGhost}>Call</a>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-3">
            <h2 className="text-[18px] font-bold">Add a note</h2>
            <form action={addNote} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="body" className="sr-only">Note</label>
              <textarea id="body" name="body" rows={3} required placeholder="Called, left a voicemail. Wants to start after his surgery follow-up." className={inputClass} />
              <button type="submit" className={`${btnGhost} self-start`}>Save note</button>
            </form>
          </Card>

          <Card className="flex flex-col gap-4">
            <h2 className="text-[18px] font-bold">Timeline</h2>
            <ol className="flex flex-col gap-4">
              {events.map((e) => (
                <li key={e.id} className="flex flex-col gap-1 border-l-2 border-line pl-4">
                  <span className="text-[13px] text-steel">
                    {eventTitle(e)} · {formatDate(e.created_at, true)}
                  </span>
                  {e.body && <p className="whitespace-pre-wrap text-[15px]">{e.body}</p>}
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-3">
            <h2 className="text-[18px] font-bold">Status</h2>
            <form action={updateLeadStatus} className="flex gap-2">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="status" className="sr-only">Status</label>
              <select id="status" name="status" defaultValue={lead.status} className={inputClass}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <button type="submit" className={btnGhost}>Save</button>
            </form>
          </Card>

          <Card className="flex flex-col gap-3">
            <h2 className="text-[18px] font-bold">Contact</h2>
            <dl className="grid grid-cols-[80px_minmax(0,1fr)] gap-x-3 gap-y-2 text-[14px]">
              <dt className="text-steel">Email</dt>
              <dd className="break-words">{lead.email}</dd>
              <dt className="text-steel">Phone</dt>
              <dd>{lead.phone ?? "—"}</dd>
              <dt className="text-steel">Form</dt>
              <dd>{lead.page_type}{lead.offer ? ` · ${lead.offer}` : ""}</dd>
            </dl>
          </Card>

          <Card className="flex flex-col gap-3">
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
  switch (e.type) {
    case "created":
      return "Filled the form";
    case "status":
      return `${e.author_name ?? "Someone"} moved to ${statusLabel(e.meta?.to ?? "")}`;
    case "note":
      return `Note by ${e.author_name ?? "someone"}`;
    case "message_out":
      return `Email sent by ${e.author_name ?? "someone"}`;
    case "message_in":
      return "Email received";
  }
}
