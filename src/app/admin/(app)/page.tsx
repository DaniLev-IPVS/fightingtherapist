import Link from "next/link";
import { leadStats, listLeads } from "@/lib/crm";
import { MONTHLY_CLIENT_GOAL, STAGES, STAGE_TONE, formatMoney, stageOf } from "@/lib/pipeline";
import { sourceLabel } from "@/lib/source";
import { GymPage, PageHeader, formatDate } from "@/components/admin/ui";
import { StageIcon } from "@/components/admin/stage-icons";
import { Avatar } from "@/components/admin/pipeline-board";
import { cn } from "@/components/ui";

export const metadata = { title: { absolute: "Dashboard | Admin" } };

const panel = "rounded-[16px] border border-white/10 bg-ink/60 p-5 backdrop-blur-md";
const month = () => new Intl.DateTimeFormat("en-CA", { month: "long", timeZone: "America/Toronto" }).format(new Date());

export default async function DashboardPage() {
  const [stats, leads] = await Promise.all([leadStats(), listLeads()]);
  const recent = [...leads].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 6);
  const maxSource = Math.max(1, ...stats.bySource.map((s) => s.n));
  const f = stats.funnel;
  const steps = [
    { label: "Leads", n: f.leads, of: null as number | null },
    { label: "Talked to Zack", n: f.talked, of: f.leads },
    { label: "Booked a call", n: f.booked, of: f.talked },
    { label: "Became clients", n: f.closed, of: f.booked },
  ];

  return (
    <GymPage>
      <PageHeader dark title="Dashboard" intro="How the pipeline is lifting this month." />

      {/* The bar: every client closed this month loads a plate. */}
      <section className={cn(panel, "flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8")}>
        <div className="flex shrink-0 flex-col gap-1 lg:w-[240px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel-light">{month()} clients</span>
          <span className="display text-[64px] leading-none text-white">
            {stats.closedThisMonth}
            <span className="text-[28px] text-steel-light"> / {MONTHLY_CLIENT_GOAL}</span>
          </span>
          <span className="text-[14px] text-mist">
            {stats.closedThisMonth >= MONTHLY_CLIENT_GOAL
              ? "Bar's fully loaded. New monthly record territory."
              : `${MONTHLY_CLIENT_GOAL - stats.closedThisMonth} more to load the bar. Each new client adds a plate.`}
          </span>
        </div>
        <Barbell loaded={stats.closedThisMonth} goal={MONTHLY_CLIENT_GOAL} />
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Tile label="Monthly revenue" value={formatMoney(stats.monthlyCents)} sub="From current clients" accent="text-emerald-700" />
        <Tile label="Pipeline potential" value={formatMoney(stats.potentialCents)} sub="Open deals" />
        <Tile label="Calls today" value={String(stats.callsToday)} sub={`${stats.touchesWeek} this week, counting follow-ups`} />
        <Tile
          label="Follow-ups due"
          value={String(stats.followUpsDue)}
          sub={stats.followUpsDue ? "Today or overdue" : "All caught up"}
          accent={stats.followUpsDue ? "text-red-700" : undefined}
          href="/admin/leads?view=list"
        />
        <Tile label="New leads" value={String(stats.last7)} sub="Last 7 days" className="col-span-2 lg:col-span-1" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={cn(panel, "flex flex-col gap-4")}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[18px] font-bold text-white">From form to client</h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel-light">Last 90 days</span>
          </div>
          <ol className="flex flex-col gap-3">
            {steps.map((s) => {
              const pct = f.leads ? (s.n / f.leads) * 100 : 0;
              const rate = s.of ? Math.round((s.n / s.of) * 100) : null;
              return (
                <li key={s.label} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between text-[14px] text-mist">
                    <span>{s.label}</span>
                    <span>
                      <span className="font-mono text-white">{s.n}</span>
                      {rate != null && s.of ? <span className="text-steel-light"> · {rate}% of the step before</span> : null}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.06]">
                    <div className="h-3 rounded-full bg-gradient-to-r from-blue to-blue-bright" style={{ width: `${Math.max(pct, s.n ? 3 : 0)}%` }} />
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className={cn(panel, "flex flex-col gap-3")}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[18px] font-bold text-white">Pipeline</h2>
            <Link href="/admin/leads" className="text-[14px] text-blue-pale hover:underline">Open the board</Link>
          </div>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {STAGES.map((s) => (
              <li key={s.value}>
                <Link
                  href={`/admin/leads?view=list&status=${s.value}`}
                  className="flex items-center gap-3 rounded-[10px] px-2 py-2 text-mist hover:bg-white/5 hover:text-white"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-white/[0.07] text-white">
                    <StageIcon name={s.icon} className={cn("h-6 w-6", s.value === "closed" && "text-emerald-300", s.value === "past_client" && "text-star")} />
                  </span>
                  <span className="flex-1 text-[14px]">{s.label}</span>
                  <span className="font-mono text-[15px] text-white">{stats.byStatus[s.value] ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={cn(panel, "flex flex-col gap-4")}>
          <h2 className="text-[18px] font-bold text-white">Where leads came from, last 30 days</h2>
          {stats.bySource.length === 0 ? (
            <p className="text-[15px] text-mist">No leads yet. Each new lead is tagged with where it came from (Instagram, TikTok, Google…).</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {stats.bySource.map((s) => (
                <li key={s.source} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[14px] text-mist">
                    <Link href={`/admin/leads?view=list&source=${s.source}`} className="hover:text-white hover:underline">{sourceLabel(s.source)}</Link>
                    <span className="font-mono text-white">{s.n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06]">
                    <div className="h-2 rounded-full bg-blue" style={{ width: `${(s.n / maxSource) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={cn(panel, "flex flex-col gap-3")}>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[18px] font-bold text-white">Latest leads</h2>
            <Link href="/admin/leads?view=list" className="text-[14px] text-blue-pale hover:underline">All leads</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-[15px] text-mist">When someone fills a form on the site, they show up here.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {recent.map((l) => {
                const s = stageOf(l.status);
                return (
                  <li key={l.id}>
                    <Link href={`/admin/leads/${l.id}`} className="flex items-center gap-3 rounded-[10px] px-2 py-2 hover:bg-white/5">
                      <Avatar name={l.name} src={l.photo_thumb} className={cn("h-9 w-9 text-[12px]", STAGE_TONE[s.value].bg, STAGE_TONE[s.value].text)} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate font-semibold text-white">{l.name}</span>
                        <span className="text-[13px] text-steel-light">{sourceLabel(l.source)} · {formatDate(l.created_at)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[12.5px] text-mist">
                        <StageIcon name={s.icon} className="h-4 w-4" />
                        {s.short}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </GymPage>
  );
}

function Tile({ label, value, sub, accent, href, className }: { label: string; value: string; sub?: string; accent?: string; href?: string; className?: string }) {
  const body = (
    <>
      <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-steel">{label}</span>
      <span className={cn("display text-[32px] leading-none text-charcoal", accent)}>{value}</span>
      {sub && <span className="text-[12.5px] text-steel">{sub}</span>}
    </>
  );
  const cls = cn("flex flex-col gap-2 rounded-[14px] bg-paper p-4", href && "hover:ring-2 hover:ring-blue", className);
  return href ? <Link href={href} className={cls}>{body}</Link> : <div className={cls}>{body}</div>;
}

/** A barbell with one plate per client this month, loaded alternately left and right. */
function Barbell({ loaded, goal }: { loaded: number; goal: number }) {
  const perSide = Math.ceil(goal / 2);
  const plates = Array.from({ length: perSide * 2 }, (_, i) => i);
  const plateW = 22;
  const gap = 4;
  const sleeveL = 176; // inner collar, left
  const sleeveR = 424; // inner collar, right
  const extra = Math.max(0, loaded - goal);
  return (
    <figure className="min-w-0 flex-1">
      <svg viewBox="0 0 600 170" className="h-auto w-full" role="img" aria-label={`${loaded} of ${goal} plates loaded`}>
        <defs>
          <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dfe6ef" />
            <stop offset="0.5" stopColor="#8a97aa" />
            <stop offset="1" stopColor="#c9d3e2" />
          </linearGradient>
          <linearGradient id="plate" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0a8fd6" />
            <stop offset="0.5" stopColor="#3fb0ef" />
            <stop offset="1" stopColor="#0a8fd6" />
          </linearGradient>
        </defs>
        {/* floor */}
        <rect x="0" y="160" width="600" height="2" fill="white" opacity="0.08" />
        {/* bar */}
        <rect x="8" y="79" width="584" height="12" rx="6" fill="url(#steel)" />
        <rect x="200" y="80" width="200" height="10" fill="#6b7a90" opacity="0.5" />
        {/* collars */}
        <rect x={sleeveL - 4} y="62" width="8" height="46" rx="2" fill="url(#steel)" />
        <rect x={sleeveR - 4} y="62" width="8" height="46" rx="2" fill="url(#steel)" />
        {plates.map((i) => {
          const side = i % 2 === 0 ? "L" : "R";
          const slot = Math.floor(i / 2);
          const x = side === "L" ? sleeveL - 8 - (slot + 1) * (plateW + gap) + gap : sleeveR + 8 + slot * (plateW + gap);
          const on = i < loaded;
          return on ? (
            <g key={i}>
              <rect x={x} y="12" width={plateW} height="146" rx="5" fill="url(#plate)" />
              <rect x={x + plateW / 2 - 1} y="20" width="2" height="130" fill="white" opacity="0.25" />
            </g>
          ) : (
            <rect key={i} x={x + 0.5} y="12.5" width={plateW - 1} height="145" rx="5" fill="none" stroke="white" strokeOpacity="0.14" strokeDasharray="4 4" />
          );
        })}
        {extra > 0 && (
          <text x="300" y="56" textAnchor="middle" fill="#7cc8f0" fontSize="18" fontFamily="monospace">+{extra} over goal</text>
        )}
      </svg>
    </figure>
  );
}
