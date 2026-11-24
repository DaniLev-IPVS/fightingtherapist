import Link from "next/link";
import { GOALS } from "@/lib/leads";
import { listLeads, type ListLead } from "@/lib/crm";
import { STAGES, STAGE_TONE, formatMoney, isStage, stageOf, todayISO } from "@/lib/pipeline";
import { SOURCES, sourceLabel } from "@/lib/source";
import { GymPage, PageHeader, formatDate, inputClass } from "@/components/admin/ui";
import { Avatar, PipelineBoard } from "@/components/admin/pipeline-board";
import { StageIcon } from "@/components/admin/stage-icons";
import { cn } from "@/components/ui";

export const metadata = { title: "Leads" };

const goalLabel = (v: string) => GOALS.find((g) => g.value === v)?.label ?? v;
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const sp = await searchParams;
  const view = one(sp.view) === "list" ? "list" : "board";
  const status = one(sp.status);
  const source = one(sp.source);
  const q = one(sp.q);
  const leads = await listLeads({ status: view === "board" ? undefined : status, source, q });

  const href = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { view, status, source, q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === "view" && v === "board")) next.set(k, v);
    const s = next.toString();
    return `/admin/leads${s ? `?${s}` : ""}`;
  };

  return (
    <GymPage>
      <PageHeader
        dark
        title="Leads"
        intro="Call them, follow up, book the call, close. Hold a card to drag it to the next stage."
        actions={
          <div className="flex rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur" role="group" aria-label="View">
            {(["board", "list"] as const).map((v) => (
              <Link
                key={v}
                href={href({ view: v })}
                aria-current={view === v ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 font-mono text-[12px] uppercase tracking-[0.1em]",
                  view === v ? "bg-white text-charcoal" : "text-mist hover:text-white",
                )}
              >
                {v === "board" ? "Board" : "List"}
              </Link>
            ))}
          </div>
        }
      />

      <form className="flex flex-wrap items-end gap-3" action="/admin/leads">
        {view === "list" && <input type="hidden" name="view" value="list" />}
        <div className="flex min-w-[200px] flex-1 flex-col gap-1">
          <label htmlFor="q" className="text-[13px] font-semibold text-mist">Search</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Name, email or phone" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="source" className="text-[13px] font-semibold text-mist">Source</label>
          <select id="source" name="source" defaultValue={source ?? ""} className={inputClass}>
            <option value="">All sources</option>
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        {view === "list" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-[13px] font-semibold text-mist">Stage</label>
            <select id="status" name="status" defaultValue={isStage(status) ? status : ""} className={inputClass}>
              <option value="">All stages</option>
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        )}
        <button
          type="submit"
          className="inline-flex items-center rounded-[4px] border border-white/20 bg-white/10 px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-white hover:bg-white/20"
        >
          Filter
        </button>
        {(q || source || status) && (
          <Link href={href({ q: undefined, source: undefined, status: undefined })} className="py-2.5 text-[14px] text-blue-pale hover:underline">
            Clear
          </Link>
        )}
      </form>

      {view === "board" ? <PipelineBoard leads={leads} /> : <List leads={leads} />}
    </GymPage>
  );
}

function StagePill({ stage }: { stage: string }) {
  const s = stageOf(stage);
  const tone = STAGE_TONE[s.value];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full py-0.5 pl-1.5 pr-2.5 text-[12px] font-semibold", tone.bg, tone.text)}>
      <StageIcon name={s.icon} className="h-4 w-4" />
      {s.label}
    </span>
  );
}

function Money({ l }: { l: ListLead }) {
  if (l.status === "closed" || l.status === "past_client") return l.monthly_cents != null ? <>{formatMoney(l.monthly_cents)}/mo</> : <>—</>;
  return <>{formatMoney(l.deal_cents)}</>;
}

function List({ leads }: { leads: ListLead[] }) {
  const today = todayISO();
  if (leads.length === 0) {
    return (
      <div className="rounded-[14px] border border-white/10 bg-ink/60 p-6 text-[15px] text-mist backdrop-blur">
        No leads match. New form entries show up here on their own.
      </div>
    );
  }
  return (
    <>
      {/* Phone: one card per lead. */}
      <ul className="flex flex-col gap-2 md:hidden">
        {leads.map((l) => {
          const due = l.next_follow_up && l.next_follow_up <= today && stageOf(l.status).open;
          return (
            <li key={l.id}>
              <Link href={`/admin/leads/${l.id}`} className="flex items-center gap-3 rounded-[12px] bg-paper p-3 active:bg-off-white">
                <Avatar name={l.name} src={l.photo_thumb} className={cn("h-11 w-11 text-[14px]", STAGE_TONE[l.status].bg, STAGE_TONE[l.status].text)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold">{l.name}</span>
                    {(l.deal_cents != null || l.monthly_cents != null) && <span className="shrink-0 text-[13px] font-semibold"><Money l={l} /></span>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-steel">
                    <StagePill stage={l.status} />
                    <span>{plural(l.calls, "call")} · {plural(l.follow_ups + l.booked_follow_ups, "follow-up")}</span>
                    {due && <span className="font-semibold text-red-700">Follow up due</span>}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop table. */}
      <div className="hidden overflow-x-auto rounded-[14px] border border-white/10 bg-paper md:block">
        <table className="w-full min-w-[900px] text-left text-[14px]">
          <thead className="border-b border-line bg-off-white text-[12px] uppercase tracking-[0.08em] text-steel">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Name</th>
              <th scope="col" className="px-4 py-3 font-semibold">Stage</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Calls</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Follow-ups</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Value</th>
              <th scope="col" className="px-4 py-3 font-semibold">Next follow-up</th>
              <th scope="col" className="px-4 py-3 font-semibold">Source</th>
              <th scope="col" className="px-4 py-3 font-semibold">Came in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.map((l) => {
              const due = l.next_follow_up && l.next_follow_up <= today && stageOf(l.status).open;
              return (
                <tr key={l.id} className="hover:bg-off-white">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={l.name} src={l.photo_thumb} className={cn("h-9 w-9 text-[12px]", STAGE_TONE[l.status].bg, STAGE_TONE[l.status].text)} />
                      <div className="min-w-0">
                        <Link href={`/admin/leads/${l.id}`} className="font-semibold text-charcoal hover:text-blue">{l.name}</Link>
                        <div className="text-[13px] text-steel">{goalLabel(l.goal)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StagePill stage={l.status} /></td>
                  <td className="px-4 py-3 text-right font-mono">{l.calls}</td>
                  <td className="px-4 py-3 text-right font-mono">
                    {l.follow_ups}
                    {l.booked_follow_ups > 0 && <span className="text-steel"> +{l.booked_follow_ups}</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold"><Money l={l} /></td>
                  <td className={cn("whitespace-nowrap px-4 py-3", due ? "font-semibold text-red-700" : "text-steel")}>
                    {l.next_follow_up ? formatDate(`${l.next_follow_up}T12:00:00Z`) : "—"}
                  </td>
                  <td className="px-4 py-3">{sourceLabel(l.source)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-steel">{formatDate(l.created_at)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
