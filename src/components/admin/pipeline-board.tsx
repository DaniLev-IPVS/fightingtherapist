"use client";

import Link from "next/link";
import { useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { GOALS } from "@/lib/leads";
import { sourceLabel } from "@/lib/source";
import {
  STAGES,
  STAGE_TONE,
  followUpCounter,
  formatMoney,
  initials,
  stageOf,
  todayISO,
  type BoardLead,
  type Counter,
  type Stage,
} from "@/lib/pipeline";
import { bumpLead, moveLead } from "@/app/admin/actions";
import { StageIcon } from "./stage-icons";
import { cn } from "@/components/ui";

const goalLabel = (v: string) => GOALS.find((g) => g.value === v)?.label ?? v;

type Action =
  | { type: "move"; id: string; stage: Stage }
  | { type: "bump"; id: string; counter: Counter; delta: 1 | -1 };

function reduce(state: BoardLead[], a: Action): BoardLead[] {
  return state.map((l) => {
    if (l.id !== a.id) return l;
    if (a.type === "move") {
      const calls = a.stage === "no_answer" && l.status !== "no_answer" ? l.calls + 1 : l.calls;
      return { ...l, status: a.stage, calls, stage_changed_at: new Date().toISOString() };
    }
    return { ...l, [a.counter]: Math.max(0, l[a.counter] + a.delta) };
  });
}

type Drag = {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  offX: number;
  offY: number;
  w: number;
  active: boolean;
  touch: boolean;
  timer?: number;
};

/** Hold a card (touch) or grab it (mouse), then drop it on a column or on the stage dock. */
export function PipelineBoard({ leads }: { leads: BoardLead[] }) {
  const [items, apply] = useOptimistic(leads, reduce);
  const [, startTransition] = useTransition();
  const [drag, setDrag] = useState<Drag | null>(null);
  const [over, setOver] = useState<Stage | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const overRef = useRef<Stage | null>(null);
  const suppressClick = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const today = todayISO();

  const run = (a: Action, server: () => Promise<unknown>) =>
    startTransition(async () => {
      apply(a);
      await server();
    });

  const move = (lead: BoardLead, stage: Stage) => {
    if (lead.status === stage) return;
    run({ type: "move", id: lead.id, stage }, () => moveLead(lead.id, stage));
    if (stage === "closed") {
      setToast(`New PR. ${lead.name.split(" ")[0]} is a client.`);
      window.setTimeout(() => setToast(null), 3200);
    }
  };
  const bump = (lead: BoardLead, counter: Counter, outcome?: "no_answer") =>
    run({ type: "bump", id: lead.id, counter, delta: 1 }, () => bumpLead(lead.id, counter, 1, outcome));

  // Stops the page from scrolling while a card is being dragged with a finger.
  useEffect(() => {
    const block = (e: TouchEvent) => {
      if (dragRef.current?.active) e.preventDefault();
    };
    window.addEventListener("touchmove", block, { passive: false });
    return () => window.removeEventListener("touchmove", block);
  }, []);

  // Scrolls the board sideways (and the page up or down) when a dragged card nears an edge.
  useEffect(() => {
    if (!drag?.active) return;
    let raf = 0;
    const tick = () => {
      const d = dragRef.current;
      const el = scroller.current;
      if (d?.active && el) {
        const edge = 48;
        if (d.x < edge) el.scrollLeft -= 14;
        else if (d.x > window.innerWidth - edge) el.scrollLeft += 14;
        const dock = window.innerWidth < 768 ? 230 : 110;
        if (d.y < 70) window.scrollBy(0, -12);
        else if (d.y > window.innerHeight - dock - 20 && d.y < window.innerHeight - dock) window.scrollBy(0, 12);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [drag?.active]);

  function onPointerDown(e: React.PointerEvent<HTMLElement>, lead: BoardLead) {
    if (e.button !== 0 || (e.target as HTMLElement).closest("[data-nodrag]")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const d: Drag = {
      id: lead.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
      w: rect.width,
      active: false,
      touch: e.pointerType !== "mouse",
    };
    const activate = () => {
      d.active = true;
      dragRef.current = d;
      setDrag({ ...d });
      navigator.vibrate?.(12);
    };
    if (d.touch) d.timer = window.setTimeout(activate, 260);
    dragRef.current = d;

    const onMove = (ev: PointerEvent) => {
      const cur = dragRef.current;
      if (!cur || ev.pointerId !== cur.pointerId) return;
      const moved = Math.hypot(ev.clientX - cur.startX, ev.clientY - cur.startY);
      if (!cur.active) {
        if (cur.touch && moved > 8) return end(false); // a scroll, not a drag
        if (!cur.touch && moved > 6) activate();
        else return;
      }
      cur.x = ev.clientX;
      cur.y = ev.clientY;
      setDrag({ ...cur });
      const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest<HTMLElement>("[data-stage]");
      const stage = (target?.dataset.stage as Stage | undefined) ?? null;
      overRef.current = stage;
      setOver(stage);
    };
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId === dragRef.current?.pointerId) end(ev.type === "pointerup");
    };
    const end = (drop: boolean) => {
      const cur = dragRef.current;
      window.clearTimeout(cur?.timer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (cur?.active) {
        suppressClick.current = true;
        window.setTimeout(() => (suppressClick.current = false), 50);
        const stage = overRef.current;
        if (drop && stage) move(lead, stage);
      }
      dragRef.current = null;
      overRef.current = null;
      setDrag(null);
      setOver(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  const jumpTo = (stage: Stage) => {
    const col = scroller.current?.querySelector<HTMLElement>(`section[data-stage="${stage}"]`);
    if (col && scroller.current) scroller.current.scrollTo({ left: col.offsetLeft - scroller.current.offsetLeft, behavior: "smooth" });
  };

  const dragged = drag?.active ? items.find((l) => l.id === drag.id) : undefined;

  return (
    <div className="flex flex-col gap-4">
      {/* Stage strip: counts at a glance, tap to jump to a column on a phone. */}
      <nav aria-label="Stages" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0">
        {STAGES.map((s) => {
          const n = items.filter((l) => l.status === s.value).length;
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => jumpTo(s.value)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-3 text-[13px] text-mist backdrop-blur hover:bg-white/10"
            >
              <span className={cn("h-2 w-2 rounded-full", STAGE_TONE[s.value].dot)} />
              {s.short}
              <span className="font-mono text-white">{n}</span>
            </button>
          );
        })}
      </nav>

      <div
        ref={scroller}
        className={cn(
          "-mx-5 flex items-stretch gap-3 overflow-x-auto px-5 pb-6 md:mx-0 md:px-0",
          !drag?.active && "snap-x snap-mandatory md:snap-none",
        )}
      >
        {STAGES.map((s, i) => {
          const col = items.filter((l) => l.status === s.value);
          const money =
            s.value === "closed"
              ? col.reduce((sum, l) => sum + (l.monthly_cents ?? 0), 0)
              : s.open
                ? col.reduce((sum, l) => sum + (l.deal_cents ?? 0), 0)
                : 0;
          const isOver = over === s.value;
          return (
            <section
              key={s.value}
              data-stage={s.value}
              aria-label={s.label}
              className={cn(
                "flex min-h-[60svh] w-[84vw] max-w-[320px] shrink-0 snap-start flex-col gap-2.5 rounded-[14px] border p-2.5 backdrop-blur-md transition-colors md:w-[272px]",
                isOver ? "border-blue-bright bg-blue/15" : "border-white/10 bg-ink/55",
              )}
            >
              <header className="flex items-center gap-3 px-1 pb-1 pt-0.5">
                <span
                  className={cn(
                    "grid shrink-0 place-items-center rounded-[10px] bg-white/[0.07] text-white ring-1 ring-white/10",
                    i >= 5 ? "h-12 w-12" : "h-10 w-10",
                  )}
                >
                  <StageIcon name={s.icon} className={cn(s.value === "closed" ? "h-9 w-9 text-emerald-300" : i >= 3 && i < 5 ? "h-7 w-7" : "h-6 w-6", s.value === "past_client" && "text-star")} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[15px] font-bold text-white">{s.label}</h2>
                    <span className="rounded-full bg-white/10 px-2 font-mono text-[12px] text-white">{col.length}</span>
                  </div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-steel-light">
                    {s.weight}
                    {money > 0 && <span className="text-mist"> · {formatMoney(money)}{s.value === "closed" ? "/mo" : ""}</span>}
                  </p>
                </div>
              </header>

              {col.length === 0 && (
                <div className={cn("rounded-[10px] border border-dashed px-3 py-6 text-center text-[13px]", drag?.active ? "border-white/30 text-mist" : "border-white/10 text-steel-light")}>
                  {drag?.active ? "Drop here" : s.hint}
                </div>
              )}

              {col.map((l) => (
                <Card
                  key={l.id}
                  lead={l}
                  today={today}
                  ghost={drag?.active === true && drag.id === l.id}
                  onPointerDown={(e) => onPointerDown(e, l)}
                  onOpen={(e) => {
                    if (suppressClick.current) e.preventDefault();
                  }}
                  onNoAnswer={() => (l.status === "new" ? move(l, "no_answer") : bump(l, "calls", "no_answer"))}
                  onFollowUp={() => bump(l, followUpCounter(l.status))}
                />
              ))}
            </section>
          );
        })}
      </div>

      {/* Floating copy of the card under the finger. */}
      {dragged && drag && !drag.touch && (
        <div
          className="pointer-events-none fixed z-50 rotate-[2deg] scale-[1.03] opacity-95 drop-shadow-2xl"
          style={{ left: drag.x - drag.offX, top: drag.y - drag.offY, width: drag.w }}
        >
          <CardBody lead={dragged} today={today} />
        </div>
      )}
      {/* On a phone the finger hides what's under it, so a small chip floats above it instead. */}
      {dragged && drag?.touch && (
        <div
          className="pointer-events-none fixed z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-paper py-1.5 pl-1.5 pr-4 shadow-2xl ring-2 ring-blue-bright"
          style={{ left: drag.x, top: drag.y - 76 }}
        >
          <Avatar name={dragged.name} src={dragged.photo_thumb} className={cn("h-8 w-8 text-[11px]", STAGE_TONE[dragged.status].bg, STAGE_TONE[dragged.status].text)} />
          <span className="max-w-[180px] truncate text-[14px] font-semibold text-charcoal">{dragged.name}</span>
          {over && <span className="text-[12px] text-steel">→ {stageOf(over).short}</span>}
        </div>
      )}

      {/* Drop dock: every stage within thumb reach while dragging. */}
      {drag?.active && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg">
          <p className="mb-2 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-steel-light">Drop on a stage</p>
          <div className="mx-auto grid max-w-[1100px] grid-cols-3 gap-2 md:grid-cols-9">
            {STAGES.map((s) => (
              <div
                key={s.value}
                data-stage={s.value}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[10px] border px-1 py-2 text-center transition-colors",
                  over === s.value ? "border-blue-bright bg-blue/30 text-white" : "border-white/10 bg-white/5 text-mist",
                )}
              >
                <StageIcon name={s.icon} className="h-6 w-6" />
                <span className="text-[11.5px] font-semibold leading-tight">{s.short}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed inset-x-0 top-6 z-50 mx-auto flex w-fit items-center gap-3 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-white shadow-2xl">
          <StageIcon name="deadlift" className="h-7 w-7" />
          {toast}
        </div>
      )}
    </div>
  );
}

function Card({
  lead,
  today,
  ghost,
  onPointerDown,
  onOpen,
  onNoAnswer,
  onFollowUp,
}: {
  lead: BoardLead;
  today: string;
  ghost: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onOpen: (e: React.MouseEvent) => void;
  onNoAnswer: () => void;
  onFollowUp: () => void;
}) {
  const s = lead.status;
  return (
    <div
      onPointerDown={onPointerDown}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "relative cursor-grab touch-manipulation select-none [-webkit-touch-callout:none] active:cursor-grabbing",
        ghost && "opacity-30",
      )}
    >
      <CardBody lead={lead} today={today} onOpen={onOpen}>
        {(s === "new" || s === "no_answer" || s === "follow_up" || s === "booked_follow_up" || lead.phone) && (
          <div className="relative z-10 mt-1 flex flex-wrap gap-1.5">
            {lead.phone && (
              <a data-nodrag href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className={chip}>
                Call
              </a>
            )}
            {(s === "new" || s === "no_answer") && (
              <button data-nodrag type="button" onClick={onNoAnswer} className={chip}>
                No answer +1
              </button>
            )}
            {(s === "follow_up" || s === "booked_follow_up") && (
              <button data-nodrag type="button" onClick={onFollowUp} className={chip}>
                Followed up +1
              </button>
            )}
          </div>
        )}
      </CardBody>
    </div>
  );
}

const chip =
  "inline-flex min-h-8 items-center rounded-full border border-line bg-off-white px-3 text-[12.5px] font-semibold text-charcoal hover:border-charcoal/40 active:bg-mist";

function CardBody({
  lead,
  today,
  onOpen,
  children,
}: {
  lead: BoardLead;
  today: string;
  onOpen?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}) {
  const tone = STAGE_TONE[lead.status];
  const overdue = lead.next_follow_up != null && lead.next_follow_up <= today && stageOf(lead.status).open;
  const fuAfter = lead.booked_follow_ups;
  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-white/60 bg-paper p-3 shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-3">
        <Avatar name={lead.name} src={lead.photo_thumb} className={cn("h-10 w-10 text-[13px]", tone.bg, tone.text)} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/admin/leads/${lead.id}`}
            onClick={onOpen}
            draggable={false}
            className="block truncate font-semibold text-charcoal after:absolute after:inset-0 hover:text-blue"
          >
            {lead.name}
          </Link>
          <p className="truncate text-[12.5px] text-steel">{goalLabel(lead.goal)}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-steel">
        <span title="Calls" className="inline-flex items-center gap-1">
          <PhoneIcon /> {lead.calls}
        </span>
        <span title="Follow-ups" className="inline-flex items-center gap-1">
          <LoopIcon /> {lead.follow_ups}
          {fuAfter > 0 && <span className="text-steel-light">+{fuAfter} after call</span>}
        </span>
        {lead.status === "closed" || lead.status === "past_client"
          ? lead.monthly_cents != null && <span className="font-semibold text-emerald-700">{formatMoney(lead.monthly_cents)}/mo</span>
          : lead.deal_cents != null && <span className="font-semibold text-charcoal">{formatMoney(lead.deal_cents)}</span>}
        <span className="ml-auto text-steel-light">{sourceLabel(lead.source)}</span>
      </div>
      {lead.next_follow_up && stageOf(lead.status).open && (
        <p className={cn("text-[12px] font-semibold", overdue ? "text-red-700" : "text-steel")}>
          {overdue ? "Follow up due" : "Follow up"} {shortDate(lead.next_follow_up)}
        </p>
      )}
      {children}
    </div>
  );
}

export function Avatar({ name, src, className }: { name: string; src: string | null; className?: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element -- small data-URL thumbnails
    <img src={src} alt="" draggable={false} className={cn("shrink-0 rounded-full object-cover", className)} />
  ) : (
    <span aria-hidden="true" className={cn("grid shrink-0 place-items-center rounded-full font-bold", className)}>
      {initials(name)}
    </span>
  );
}

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
      <path d="M3.6 1.5l2 .3 1 3-1.4 1.2a8.6 8.6 0 0 0 4.8 4.8l1.2-1.4 3 1 .3 2c0 .9-.7 1.6-1.6 1.6A12.5 12.5 0 0 1 2 3.1c0-.9.7-1.6 1.6-1.6z" />
    </svg>
  );
}
function LoopIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M13 6.5A5 5 0 0 0 3.6 4.4M3 9.5a5 5 0 0 0 9.4 2.1M3.5 2v2.6h2.6M12.5 14v-2.6H9.9" />
    </svg>
  );
}
