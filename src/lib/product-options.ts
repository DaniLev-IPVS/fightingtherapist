/** Product options, types and helpers shared by the dashboard (client) and the server. */

/**
 * Text blocks for the long sales page. Order on the page: callout and headline,
 * client results and reviews, the problem, what's different, the benefits, how it
 * works, what's included, then the close. Write to the reader in plain sentences.
 */
export const SALES_FIELDS = [
  { key: "callout", label: "Who it's for, one line above the headline (e.g. For fighters in camp)", rows: 1 },
  { key: "headline", label: "Headline: the outcome, aimed at the person", rows: 2 },
  { key: "subheadline", label: "Subheadline", rows: 3 },
  { key: "problemTitle", label: "Problem heading", rows: 2 },
  { key: "problem", label: "The problem, in the reader's words (one paragraph per line)", rows: 6 },
  { key: "compareLeft", label: "Comparison: name for the usual way (e.g. Diets)", rows: 1 },
  { key: "compare", label: "Comparison rows (one per line: the usual way | with Zack)", rows: 5 },
  { key: "outcomesTitle", label: "Benefits heading", rows: 1 },
  { key: "outcomes", label: "Benefits (one per line: short bold line, a colon, then one sentence)", rows: 6 },
  { key: "steps", label: "How it works (one per line: step name, a colon, then one sentence)", rows: 3 },
  { key: "included", label: "What's included (one per line)", rows: 5 },
  { key: "outcomeAgain", label: "Dream outcome, restated at the close", rows: 3 },
  { key: "closeTitle", label: "Close heading (above the form)", rows: 1 },
  { key: "cta", label: "Button text", rows: 1 },
] as const;

/** Text blocks for the short landing page: headline, subhead, form above the fold. */
export const LANDING_FIELDS = [
  { key: "headline", label: "Headline", rows: 2 },
  { key: "subheadline", label: "Subheadline", rows: 2 },
  { key: "formTitle", label: "Form title", rows: 1 },
  { key: "cta", label: "Button text", rows: 1 },
] as const;

export const KINDS = [
  { value: "coaching", label: "Coaching" },
  { value: "pdf", label: "PDF guide" },
  { value: "lesson", label: "Video lesson" },
] as const;

export const CLOSES = [
  { value: "contact", label: "Contact form", hint: "Visitors send their details and Zack follows up." },
  { value: "buy", label: "Buy", hint: "Price and checkout on the page. Card checkout needs Stripe, which isn't connected yet, so the contact form shows until then." },
  { value: "free", label: "Free download", hint: "Visitors enter their email and get the file link." },
] as const;

/** Form goal, which also picks the testimonials shown on the pages. */
export const GOAL_OPTIONS = [
  { value: "rehab", label: "Rehab" },
  { value: "training", label: "Training" },
  { value: "nutrition", label: "Nutrition" },
  { value: "fight-camp", label: "Fight camp" },
  { value: "group", label: "Group program" },
  { value: "other", label: "Other" },
] as const;

export type Kind = (typeof KINDS)[number]["value"];
export type Close = (typeof CLOSES)[number]["value"];
export type Goal = (typeof GOAL_OPTIONS)[number]["value"];
export type PageText = Partial<Record<string, string>>;

export type Product = {
  id: string;
  slug: string;
  title: string;
  kind: Kind;
  close: Close;
  goal: Goal;
  access: "free" | "paid";
  price_cents: number | null;
  currency: string;
  price_note: string | null;
  status: "draft" | "published";
  summary: string | null;
  image: string | null;
  sales_page: PageText;
  landing_page: PageText;
  file_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at" | "sort_order">;

/** Public product shape: never includes the file link, which only free sign-ups receive. */
export type PublicProduct = Omit<Product, "file_url" | "created_at" | "updated_at"> & { has_file: boolean };

export const salesPath = (slug: string) => `/programs/${slug}`;
export const landingPath = (slug: string) => `/go/${slug}`;
export const kindLabel = (k: string) => KINDS.find((x) => x.value === k)?.label ?? k;
export const closeLabel = (c: string) => CLOSES.find((x) => x.value === c)?.label ?? c;

export const isKind = (v: string): v is Kind => KINDS.some((x) => x.value === v);
export const isClose = (v: string): v is Close => CLOSES.some((x) => x.value === v);
export const isGoal = (v: string): v is Goal => GOAL_OPTIONS.some((x) => x.value === v);

/** Splits a multi-line field into trimmed, non-empty lines. */
export const lines = (text?: string) => (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatPrice(p: Pick<Product, "close" | "price_cents" | "currency">) {
  if (p.close === "free") return "Free";
  if (p.price_cents == null) return p.close === "contact" ? "On request" : "No price yet";
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: p.currency }).format(p.price_cents / 100);
}
