import "server-only";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/dal";
import { sourceFromTouch, type TouchLike } from "@/lib/source";
import type { LeadInput } from "@/lib/leads";
import { isStage, stageOf, type BoardLead, type Counter, type Stage } from "@/lib/pipeline";

export { STAGES as STATUSES, isStage as isStatus, stageLabel as statusLabel } from "@/lib/pipeline";
export type Status = Stage;

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
  calls: number;
  follow_ups: number;
  booked_follow_ups: number;
  monthly_cents: number | null;
  deal_cents: number | null;
  photo: string | null;
  photo_thumb: string | null;
  instagram: string | null;
  next_follow_up: string | null;
  last_contact_at: string | null;
  stage_changed_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadEvent = {
  id: string;
  type: "created" | "note" | "status" | "message_out" | "message_in" | "call" | "follow_up" | "update";
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
export type ListLead = BoardLead & { email: string; utm_campaign: string | null; utm_medium: string | null };

const OPEN = ["new", "no_answer", "follow_up", "booked", "booked_follow_up"];

/** Cards for the board and rows for the list. Leaves out full photos and attribution. */
export async function listLeads(filters: LeadFilters = {}) {
  await requireAdmin();
  const status = isStage(filters.status) ? filters.status : null;
  const source = filters.source?.trim() || null;
  const q = filters.q?.trim() ? `%${filters.q.trim().toLowerCase()}%` : null;
  const rows = await db()`
    select id, name, email, phone, goal, source, status, calls, follow_ups, booked_follow_ups,
      deal_cents, monthly_cents, photo_thumb, to_char(next_follow_up, 'YYYY-MM-DD') as next_follow_up,
      utm_campaign, utm_medium, created_at, stage_changed_at
    from leads
    where (${status}::text is null or status = ${status})
      and (${source}::text is null or source = ${source})
      and (${q}::text is null or lower(name) like ${q} or lower(email) like ${q} or coalesce(phone, '') like ${q})
    order by stage_changed_at desc
    limit 1000`;
  return rows as ListLead[];
}

const TORONTO_DAY = `date_trunc('day', now() at time zone 'America/Toronto') at time zone 'America/Toronto'`;
const TORONTO_MONTH = `date_trunc('month', now() at time zone 'America/Toronto') at time zone 'America/Toronto'`;

export async function leadStats() {
  await requireAdmin();
  const sql = db();
  const [byStatus, bySource, totals, funnel] = await Promise.all([
    sql`select status, count(*)::int as n, coalesce(sum(deal_cents), 0)::int as deal from leads group by status`,
    sql`select source, count(*)::int as n from leads where created_at > now() - interval '30 days' group by source order by n desc`,
    sql.query(
      `select
        (select count(*)::int from leads where created_at > now() - interval '7 days') as last7,
        (select count(*)::int from leads where closed_at >= ${TORONTO_MONTH}) as closed_month,
        (select count(*)::int from lead_events where type = 'call' and created_at >= ${TORONTO_DAY}) as calls_today,
        (select count(*)::int from lead_events where type in ('call', 'follow_up') and created_at > now() - interval '7 days') as touches_week,
        (select coalesce(sum(monthly_cents), 0)::int from leads where status = 'closed') as monthly,
        (select coalesce(sum(deal_cents), 0)::int from leads where status = any($1)) as potential,
        (select count(*)::int from leads where status = any($1)
           and next_follow_up <= (now() at time zone 'America/Toronto')::date) as due`,
      [OPEN],
    ),
    // Furthest stage each lead reached in the last 90 days, from its current stage and its history.
    sql`
      with reached as (
        select l.id, l.status as s from leads l where l.created_at > now() - interval '90 days'
        union all
        select e.lead_id, e.meta->>'to' from lead_events e join leads l on l.id = e.lead_id
        where e.type = 'status' and l.created_at > now() - interval '90 days'
      )
      select
        count(distinct id)::int as leads,
        count(distinct id) filter (where s in ('follow_up', 'booked', 'booked_follow_up', 'closed', 'past_client'))::int as talked,
        count(distinct id) filter (where s in ('booked', 'booked_follow_up', 'closed', 'past_client'))::int as booked,
        count(distinct id) filter (where s in ('closed', 'past_client'))::int as closed
      from reached`,
  ]);
  const t = totals[0] ?? {};
  return {
    byStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.n])) as Record<string, number>,
    dealByStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.deal])) as Record<string, number>,
    bySource: bySource as { source: string; n: number }[],
    last7: (t.last7 as number) ?? 0,
    closedThisMonth: (t.closed_month as number) ?? 0,
    callsToday: (t.calls_today as number) ?? 0,
    touchesWeek: (t.touches_week as number) ?? 0,
    monthlyCents: (t.monthly as number) ?? 0,
    potentialCents: (t.potential as number) ?? 0,
    followUpsDue: (t.due as number) ?? 0,
    funnel: (funnel[0] ?? { leads: 0, talked: 0, booked: 0, closed: 0 }) as { leads: number; talked: number; booked: number; closed: number },
  };
}

export async function getLead(id: string) {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const sql = db();
  const [lead] = await sql`select *, to_char(next_follow_up, 'YYYY-MM-DD') as next_follow_up from leads where id = ${id}`;
  if (!lead) return null;
  const events = await sql`
    select e.id, e.type, e.body, e.meta, e.created_at, u.name as author_name
    from lead_events e left join admin_users u on u.id = e.author_id
    where e.lead_id = ${id} order by e.created_at desc`;
  return { lead: lead as Lead, events: events as LeadEvent[] };
}

/** Moves a lead to a stage. Moving into "No answer" counts as one more call that wasn't picked up. */
export async function setLeadStatus(id: string, status: Stage) {
  const user = await requireAdmin();
  const sql = db();
  const [prev] = await sql`select status from leads where id = ${id}`;
  if (!prev || prev.status === status) return;
  const missedCall = status === "no_answer";
  await sql.transaction([
    sql`update leads set status = ${status}, stage_changed_at = now(), updated_at = now(),
          closed_at = case when ${status}::text = 'closed' then coalesce(closed_at, now()) else closed_at end,
          calls = calls + ${missedCall ? 1 : 0},
          last_contact_at = case when ${missedCall}::boolean then now() else last_contact_at end
        where id = ${id}`,
    sql`insert into lead_events (lead_id, type, meta, author_id)
        values (${id}, 'status', ${JSON.stringify({ from: prev.status, to: status })}, ${user.id})`,
    ...(missedCall
      ? [sql`insert into lead_events (lead_id, type, meta, author_id) values (${id}, 'call', ${JSON.stringify({ outcome: "no_answer" })}, ${user.id})`]
      : []),
  ]);
}

const COUNTER_EVENT: Record<Counter, { type: "call" | "follow_up"; phase?: string }> = {
  calls: { type: "call" },
  follow_ups: { type: "follow_up", phase: "before_call" },
  booked_follow_ups: { type: "follow_up", phase: "after_call" },
};

/** +1 (logged on the timeline) or -1 (a correction, not logged) on a counter. */
export async function bumpCounter(id: string, counter: Counter, delta: 1 | -1, outcome?: string) {
  const user = await requireAdmin();
  const sql = db();
  // Column names can't be parameters; `counter` is checked against the three allowed names.
  const col = ({ calls: "calls", follow_ups: "follow_ups", booked_follow_ups: "booked_follow_ups" } as const)[counter];
  const update = sql.query(
    `update leads set ${col} = greatest(0, ${col} + $2), updated_at = now(),
       last_contact_at = case when $2 > 0 then now() else last_contact_at end
     where id = $1`,
    [id, delta],
  );
  if (delta < 0) return void (await update);
  const ev = COUNTER_EVENT[counter];
  await sql.transaction([
    update,
    sql`insert into lead_events (lead_id, type, meta, author_id)
        values (${id}, ${ev.type}, ${JSON.stringify({ ...(ev.phase ? { phase: ev.phase } : {}), ...(outcome ? { outcome } : {}) })}, ${user.id})`,
  ]);
}

export type LeadDetails = {
  name: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  goal: string;
  monthly_cents: number | null;
  deal_cents: number | null;
  next_follow_up: string | null;
};

export async function updateLeadDetails(id: string, d: LeadDetails) {
  const user = await requireAdmin();
  const sql = db();
  await sql.transaction([
    sql`update leads set name = ${d.name}, email = ${d.email}, phone = ${d.phone}, instagram = ${d.instagram},
          goal = ${d.goal}, monthly_cents = ${d.monthly_cents}, deal_cents = ${d.deal_cents},
          next_follow_up = ${d.next_follow_up}::date, updated_at = now()
        where id = ${id}`,
    sql`insert into lead_events (lead_id, type, body, author_id) values (${id}, 'update', 'Details updated', ${user.id})`,
  ]);
}

export async function setLeadPhoto(id: string, photo: string | null, thumb: string | null) {
  await requireAdmin();
  await db()`update leads set photo = ${photo}, photo_thumb = ${thumb}, updated_at = now() where id = ${id}`;
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

export { stageOf };
