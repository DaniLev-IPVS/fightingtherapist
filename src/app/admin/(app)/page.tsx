import Link from "next/link";
import { STATUSES, leadStats, listLeads, statusLabel } from "@/lib/crm";
import { sourceLabel } from "@/lib/source";
import { Card, PageHeader, Pill, formatDate } from "@/components/admin/ui";

export const metadata = { title: { absolute: "Dashboard | Admin" } };

export default async function DashboardPage() {
  const [stats, leads] = await Promise.all([leadStats(), listLeads()]);
  const recent = leads.slice(0, 8);
  const open = (stats.byStatus.new ?? 0) + (stats.byStatus.contacted ?? 0) + (stats.byStatus.call_booked ?? 0);
  const maxSource = Math.max(1, ...stats.bySource.map((s) => s.n));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Dashboard" intro="Where leads come from and where they are in the pipeline." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="New leads, last 7 days" value={stats.last7} />
        <Stat label="Open in the pipeline" value={open} />
        <Stat label="Became clients" value={stats.byStatus.won ?? 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <h2 className="text-[18px] font-bold">Pipeline</h2>
          <ul className="flex flex-col gap-2">
            {STATUSES.map((s) => (
              <li key={s.value}>
                <Link href={`/admin/leads?status=${s.value}`} className="flex items-center justify-between rounded-[4px] px-2 py-1.5 hover:bg-off-white">
                  <Pill tone={s.value}>{s.label}</Pill>
                  <span className="font-mono text-[14px]">{stats.byStatus[s.value] ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="flex flex-col gap-4">
          <h2 className="text-[18px] font-bold">Sources, last 30 days</h2>
          {stats.bySource.length === 0 ? (
            <p className="text-[15px] text-steel">No leads yet. Each new lead is tagged with where it came from (Instagram, TikTok, Google…).</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {stats.bySource.map((s) => (
                <li key={s.source} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[14px]">
                    <Link href={`/admin/leads?source=${s.source}`} className="hover:underline">
                      {sourceLabel(s.source)}
                    </Link>
                    <span className="font-mono">{s.n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-off-white">
                    <div className="h-2 rounded-full bg-blue" style={{ width: `${(s.n / maxSource) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold">Latest leads</h2>
          <Link href="/admin/leads" className="text-[14px] text-blue hover:underline">
            All leads
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-[15px] text-steel">When someone fills a form on the site, they show up here.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:bg-off-white">
                  <span className="flex flex-col">
                    <span className="font-semibold">{l.name}</span>
                    <span className="text-[13px] text-steel">
                      {sourceLabel(l.source)} · {formatDate(l.created_at)}
                    </span>
                  </span>
                  <Pill tone={l.status}>{statusLabel(l.status)}</Pill>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="display text-[44px] leading-none text-charcoal">{value}</span>
      <span className="text-[14px] text-steel">{label}</span>
    </Card>
  );
}
