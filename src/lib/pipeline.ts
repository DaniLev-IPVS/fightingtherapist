/** Lead pipeline stages, shared by the server and the drag-and-drop board. Client-safe. */

export const STAGES = [
  { value: "new", label: "New lead", short: "New", weight: "Warm-up", hint: "Filled a form. Call them.", icon: "rope", open: true },
  { value: "no_answer", label: "No answer", short: "No answer", weight: "Rest", hint: "Called, no pickup yet. Try again.", icon: "timer", open: true },
  { value: "follow_up", label: "Follow up", short: "Follow up", weight: "25 lb", hint: "Talked, not booked yet.", icon: "kettlebell", open: true },
  { value: "booked", label: "Call booked", short: "Booked", weight: "50 lb", hint: "Consult on the calendar.", icon: "dumbbell", open: true },
  { value: "booked_follow_up", label: "Follow up after call", short: "After call", weight: "225 lb", hint: "Had the call, deciding.", icon: "bar", open: true },
  { value: "closed", label: "Closed", short: "Closed", weight: "405 lb", hint: "Signed up. A client now.", icon: "deadlift", open: false },
  { value: "not_qualified", label: "Not qualified", short: "Not a fit", weight: "Benched", hint: "Not a fit right now.", icon: "bench", open: false },
  { value: "nurture", label: "Nurture", short: "Nurture", weight: "Recovery", hint: "Long-term list: an email or text every few weeks.", icon: "shaker", open: false },
  { value: "past_client", label: "Past client", short: "Past client", weight: "Hall of fame", hint: "Finished working with Zack.", icon: "medal", open: false },
] as const;

export type Stage = (typeof STAGES)[number]["value"];
export type StageIcon = (typeof STAGES)[number]["icon"];

export const isStage = (v: unknown): v is Stage => STAGES.some((s) => s.value === v);
export const stageOf = (v: string) => STAGES.find((s) => s.value === v) ?? STAGES[0];
export const stageLabel = (v: string) => stageOf(v).label;

/** Accent per stage, readable on white cards and as a dot on the dark board. */
export const STAGE_TONE: Record<Stage, { text: string; bg: string; ring: string; dot: string }> = {
  new: { text: "text-blue", bg: "bg-blue-wash", ring: "ring-blue/40", dot: "bg-blue" },
  no_answer: { text: "text-amber-800", bg: "bg-amber-50", ring: "ring-amber-400/50", dot: "bg-amber-400" },
  follow_up: { text: "text-orange-800", bg: "bg-orange-50", ring: "ring-orange-400/50", dot: "bg-orange-400" },
  booked: { text: "text-violet-800", bg: "bg-violet-50", ring: "ring-violet-400/50", dot: "bg-violet-400" },
  booked_follow_up: { text: "text-indigo-800", bg: "bg-indigo-50", ring: "ring-indigo-400/50", dot: "bg-indigo-400" },
  closed: { text: "text-emerald-800", bg: "bg-emerald-50", ring: "ring-emerald-400/60", dot: "bg-emerald-400" },
  not_qualified: { text: "text-zinc-600", bg: "bg-zinc-100", ring: "ring-zinc-400/50", dot: "bg-zinc-400" },
  nurture: { text: "text-teal-800", bg: "bg-teal-50", ring: "ring-teal-400/50", dot: "bg-teal-400" },
  past_client: { text: "text-yellow-800", bg: "bg-yellow-50", ring: "ring-yellow-400/60", dot: "bg-star" },
};

/** Which counter a "+1 follow-up" bumps: after the booked call it counts separately. */
export const followUpCounter = (stage: Stage) =>
  stage === "booked" || stage === "booked_follow_up" ? ("booked_follow_ups" as const) : ("follow_ups" as const);

export type Counter = "calls" | "follow_ups" | "booked_follow_ups";
export const COUNTERS: { key: Counter; label: string }[] = [
  { key: "calls", label: "Calls" },
  { key: "follow_ups", label: "Follow-ups" },
  { key: "booked_follow_ups", label: "Follow-ups after the call" },
];
export const isCounter = (v: unknown): v is Counter => COUNTERS.some((c) => c.key === v);

/** Clients closed per month that fill the bar on the dashboard. */
export const MONTHLY_CLIENT_GOAL = 8;

/** Card fields the board needs (no full photo, no attribution). */
export type BoardLead = {
  id: string;
  name: string;
  phone: string | null;
  goal: string;
  source: string;
  status: Stage;
  calls: number;
  follow_ups: number;
  booked_follow_ups: number;
  deal_cents: number | null;
  monthly_cents: number | null;
  photo_thumb: string | null;
  next_follow_up: string | null;
  created_at: string;
  stage_changed_at: string;
};

export function formatMoney(cents: number | null | undefined, opts: { compact?: boolean } = {}) {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
    notation: opts.compact && cents >= 1_000_000 ? "compact" : "standard",
  }).format(cents / 100);
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

/** "2026-11-24" in Toronto, to compare with next_follow_up dates. */
export const todayISO = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
