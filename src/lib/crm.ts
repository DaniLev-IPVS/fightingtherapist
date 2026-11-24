import "server-only";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/dal";
import { sourceFromTouch, type TouchLike } from "@/lib/source";
import type { LeadInput } from "@/lib/leads";

export const STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "call_booked", label: "Call booked" },
  { value: "won", label: "Client" },
  { value: "lost", label: "Lost" },
] as const;
export type Status = (typeof STATUSES)[number]["value"];
export const isStatus = (v: unknown): v is Status => STATUSES.some((s) => s.value === v);
export const statusLabel = (v: string) => STATUSES.find((s) => s.value === v)?.label ?? v;

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  goal: string;
  message: string | null;
  offer: string | null;
  page_type: string;
  status: Status;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  landing_page: string | null;
  attribution: { first?: Record<string, string>; last?: Record<string, string>; page?: string } | null;
  created_at: string;
  updated_at: string;
};

export type LeadEvent = {
  id: string;
  type: "created" | "note" | "status" | "message_out" | "message_in";
  body: string | null;
  meta: Record<string, string> | null;
  author_name: string | null;
  created_at: string;
};

type Attribution = { first?: TouchLike & Record<string, string>; last?: TouchLike & Record<string, string>; page?: string };

const clip = (v: unknown, n: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, n) : null);

/** Public: called by /api/leads. The first touch decides the source (how they found Zack). */
export async function saveLead(input: LeadInput, userAgent: string | null) {
  const attribution = (input.attribution && typeof input.attribution === "object" ? input.attribution : null) as Attribution | null;
  const first = attribution?.first ?? attribution?.last ?? null;
  const source = sourceFromTouch(first);
  const sql = db();
  const rows = await sql`
    insert into leads (name, email, phone, goal, message, offer, page_type, source,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, landing_page, attribution, user_agent)
    values (
      ${input.name.trim()}, ${input.email.trim().toLowerCase()}, ${clip(input.phone, 40)}, ${input.goal},
      ${clip(input.message, 2000)}, ${clip(input.offer, 120)}, ${input.pageType ?? "other"}, ${source},
      ${clip(first?.utm_source, 200)}, ${clip(first?.utm_medium, 200)}, ${clip(first?.utm_campaign, 200)},
      ${clip(first?.utm_content, 200)}, ${clip(first?.utm_term, 200)}, ${clip(first?.referrer, 300)},
      ${clip(first?.landing_page, 300)}, ${attribution ? JSON.stringify(attribution) : null}, ${clip(userAgent, 300)}
    )
    returning id`;
  const id = rows[0].id as string;
  await sql`insert into lead_events (lead_id, type, body) values (${id}, 'created', ${clip(input.message, 2000)})`;
  return id;
}

export type LeadFilters = { status?: string; source?: string; q?: string };

export async function listLeads(filters: LeadFilters = {}) {
  await requireAdmin();
  const status = isStatus(filters.status) ? filters.status : null;
  const source = filters.source?.trim() || null;
  const q = filters.q?.trim() ? `%${filters.q.trim().toLowerCase()}%` : null;
  const rows = await db()`
    select id, name, email, phone, goal, offer, status, source, utm_source, utm_medium, utm_campaign, page_type, created_at
    from leads
    where (${status}::text is null or status = ${status})
      and (${source}::text is null or source = ${source})
      and (${q}::text is null or lower(name) like ${q} or lower(email) like ${q} or coalesce(phone, '') like ${q})
    order by created_at desc
    limit 500`;
  return rows as Lead[];
}

export async function leadStats() {
  await requireAdmin();
  const sql = db();
  const [byStatus, bySource, recent] = await Promise.all([
    sql`select status, count(*)::int as n from leads group by status`,
    sql`select source, count(*)::int as n from leads where created_at > now() - interval '30 days' group by source order by n desc`,
    sql`select count(*)::int as n from leads where created_at > now() - interval '7 days'`,
  ]);
  return {
    byStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.n])) as Record<string, number>,
    bySource: bySource as { source: string; n: number }[],
    last7: (recent[0]?.n as number) ?? 0,
  };
}

export async function getLead(id: string) {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const sql = db();
  const [lead] = await sql`select * from leads where id = ${id}`;
  if (!lead) return null;
  const events = await sql`
    select e.id, e.type, e.body, e.meta, e.created_at, u.name as author_name
    from lead_events e left join admin_users u on u.id = e.author_id
    where e.lead_id = ${id} order by e.created_at desc`;
  return { lead: lead as Lead, events: events as LeadEvent[] };
}

export async function setLeadStatus(id: string, status: Status) {
  const user = await requireAdmin();
  const sql = db();
  const [prev] = await sql`select status from leads where id = ${id}`;
  if (!prev || prev.status === status) return;
  await sql.transaction([
    sql`update leads set status = ${status}, updated_at = now() where id = ${id}`,
    sql`insert into lead_events (lead_id, type, meta, author_id)
        values (${id}, 'status', ${JSON.stringify({ from: prev.status, to: status })}, ${user.id})`,
  ]);
}

export async function addLeadNote(id: string, body: string) {
  const user = await requireAdmin();
  const text = body.trim().slice(0, 5000);
  if (!text) return;
  const sql = db();
  await sql.transaction([
    sql`insert into lead_events (lead_id, type, body, author_id) values (${id}, 'note', ${text}, ${user.id})`,
    sql`update leads set updated_at = now() where id = ${id}`,
  ]);
}

export async function deleteLead(id: string) {
  await requireAdmin();
  await db()`delete from leads where id = ${id}`;
}
