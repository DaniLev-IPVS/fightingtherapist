import Link from "next/link";
import { GOALS } from "@/lib/leads";
import { STATUSES, isStatus, listLeads, statusLabel, type Lead } from "@/lib/crm";
import { SOURCES, sourceLabel } from "@/lib/source";
import { Card, PageHeader, Pill, btnGhost, formatDate, inputClass } from "@/components/admin/ui";
import { cn } from "@/components/ui";

export const metadata = { title: "Leads" };

const goalLabel = (v: string) => GOALS.find((g) => g.value === v)?.label ?? v;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const sp = await searchParams;
  const view = one(sp.view) === "board" ? "board" : "list";
  const status = one(sp.status);
  const source = one(sp.source);
  const q = one(sp.q);
  const leads = await listLeads({ status: view === "board" ? undefined : status, source, q });

  const href = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { view, status, source, q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === "view" && v === "list")) next.set(k, v);
    const s = next.toString();
    return `/admin/leads${s ? `?${s}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Leads"
        intro="Everyone who filled a form, with where they came from."
        actions={
          <div className="flex rounded-[4px] border border-line bg-paper p-0.5" role="group" aria-label="View">
            {(["list", "board"] as const).map((v) => (
              <Link
                key={v}
                href={href({ view: v })}
                aria-current={view === v ? "page" : undefined}
                className={cn("rounded-[3px] px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.1em]", view === v ? "bg-charcoal text-white" : "text-steel")}
              >
                {v === "list" ? "List" : "Pipeline"}
              </Link>
            ))}
          </div>
        }
      />

      <form className="flex flex-wrap items-end gap-3" action="/admin/leads">
        {view === "board" && <input type="hidden" name="view" value="board" />}
        <div className="flex min-w-[220px] flex-1 flex-col gap-1">
          <label htmlFor="q" className="text-[13px] font-semibold">Search</label>
          <input id="q" name="q" defaultValue={q} placeholder="Name, email or phone" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="source" className="text-[13px] font-semibold">Source</label>
          <select id="source" name="source" defaultValue={source ?? ""} className={inputClass}>
            <option value="">All sources</option>
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        {view === "list" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-[13px] font-semibold">Status</label>
            <select id="status" name="status" defaultValue={isStatus(status) ? status : ""} className={inputClass}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className={btnGhost}>Filter</button>
        {(q || source || status) && (
          <Link href={href({ q: undefined, source: undefined, status: undefined })} className="py-2.5 text-[14px] text-blue hover:underline">
            Clear
          </Link>
        )}
      </form>

      {view === "board" ? <Board leads={leads} /> : <Table leads={leads} />}
    </div>
  );
}

function Table({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return <Card><p className="text-[15px] text-steel">No leads match. New form entries appear here automatically.</p></Card>;
  }
  return (
    <div className="overflow-x-auto rounded-[6px] border border-line bg-paper">
      <table className="w-full min-w-[760px] text-left text-[14px]">
        <thead className="border-b border-line bg-off-white text-[12px] uppercase tracking-[0.08em] text-steel">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Name</th>
            <th scope="col" className="px-4 py-3 font-semibold">Wants</th>
            <th scope="col" className="px-4 py-3 font-semibold">Source</th>
            <th scope="col" className="px-4 py-3 font-semibold">Campaign</th>
            <th scope="col" className="px-4 py-3 font-semibold">Status</th>
            <th scope="col" className="px-4 py-3 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {leads.map((l) => (
            <tr key={l.id} className="hover:bg-off-white">
              <td className="px-4 py-3">
                <Link href={`/admin/leads/${l.id}`} className="font-semibold text-charcoal hover:text-blue">{l.name}</Link>
                <div className="text-[13px] text-steel">{l.email}</div>
              </td>
              <td className="px-4 py-3">{goalLabel(l.goal)}</td>
              <td className="px-4 py-3">{sourceLabel(l.source)}</td>
              <td className="px-4 py-3 text-steel">{[l.utm_campaign, l.utm_medium].filter(Boolean).join(" · ") || "—"}</td>
              <td className="px-4 py-3"><Pill tone={l.status}>{statusLabel(l.status)}</Pill></td>
              <td className="whitespace-nowrap px-4 py-3 text-steel">{formatDate(l.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Board({ leads }: { leads: Lead[] }) {
  return (
    <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:px-0">
      {STATUSES.map((s) => {
        const col = leads.filter((l) => l.status === s.value);
        return (
          <section key={s.value} aria-label={s.label} className="flex w-[260px] shrink-0 flex-col gap-3 rounded-[6px] bg-charcoal/5 p-3">
            <header className="flex items-center justify-between px-1">
              <Pill tone={s.value}>{s.label}</Pill>
              <span className="font-mono text-[13px] text-steel">{col.length}</span>
            </header>
            {col.length === 0 && <p className="px-1 text-[13px] text-steel">Nobody here.</p>}
            {col.map((l) => (
              <Link key={l.id} href={`/admin/leads/${l.id}`} className="flex flex-col gap-1 rounded-[4px] border border-line bg-paper p-3 hover:border-blue">
                <span className="font-semibold">{l.name}</span>
                <span className="text-[13px] text-steel">{goalLabel(l.goal)}</span>
                <span className="text-[12px] text-steel">{sourceLabel(l.source)} · {formatDate(l.created_at)}</span>
              </Link>
            ))}
          </section>
        );
      })}
    </div>
  );
}
