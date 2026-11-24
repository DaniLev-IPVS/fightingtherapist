import "server-only";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/dal";

/** Text blocks for the long sales page, in Daniel's order (no FAQ). */
export const SALES_FIELDS = [
  { key: "headline", label: "Dream outcome headline", rows: 2 },
  { key: "subheadline", label: "Subheadline", rows: 2 },
  { key: "whoFor", label: "Who it's for (one per line)", rows: 4 },
  { key: "outcomes", label: "Dream outcome points (one per line)", rows: 5 },
  { key: "included", label: "What's included (one per line)", rows: 5 },
  { key: "outcomeAgain", label: "Dream outcome, restated before the close", rows: 3 },
  { key: "cta", label: "Button text", rows: 1 },
] as const;

/** Text blocks for the short landing page: headline, subhead, form above the fold. */
export const LANDING_FIELDS = [
  { key: "headline", label: "Headline", rows: 2 },
  { key: "subheadline", label: "Subheadline", rows: 2 },
  { key: "formTitle", label: "Form title", rows: 1 },
  { key: "cta", label: "Button text", rows: 1 },
] as const;

export type PageText = Partial<Record<string, string>>;

export type Product = {
  id: string;
  slug: string;
  title: string;
  kind: "pdf" | "lesson";
  access: "free" | "paid";
  price_cents: number | null;
  currency: string;
  status: "draft" | "published";
  summary: string | null;
  sales_page: PageText;
  landing_page: PageText;
  file_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;

/** Public URLs the sales and landing pages will live at (built in step 6). */
export const salesPath = (slug: string) => `/p/${slug}`;
export const landingPath = (slug: string) => `/p/${slug}/start`;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatPrice(p: Pick<Product, "access" | "price_cents" | "currency">) {
  if (p.access === "free") return "Free";
  if (p.price_cents == null) return "No price yet";
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: p.currency }).format(p.price_cents / 100);
}

export async function listProducts() {
  await requireAdmin();
  return (await db()`select * from products order by updated_at desc`) as Product[];
}

export async function getProduct(id: string) {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db()`select * from products where id = ${id}`;
  return (row as Product | undefined) ?? null;
}

export async function slugTaken(slug: string, exceptId?: string) {
  const rows = await db()`select 1 from products where slug = ${slug} and (${exceptId ?? null}::uuid is null or id <> ${exceptId ?? null}::uuid)`;
  return rows.length > 0;
}

export async function insertProduct(p: ProductInput) {
  await requireAdmin();
  const [row] = await db()`
    insert into products (slug, title, kind, access, price_cents, currency, status, summary, sales_page, landing_page, file_url)
    values (${p.slug}, ${p.title}, ${p.kind}, ${p.access}, ${p.price_cents}, ${p.currency}, ${p.status}, ${p.summary},
      ${JSON.stringify(p.sales_page)}, ${JSON.stringify(p.landing_page)}, ${p.file_url})
    returning id`;
  return row.id as string;
}

export async function updateProduct(id: string, p: ProductInput) {
  await requireAdmin();
  await db()`
    update products set slug = ${p.slug}, title = ${p.title}, kind = ${p.kind}, access = ${p.access},
      price_cents = ${p.price_cents}, currency = ${p.currency}, status = ${p.status}, summary = ${p.summary},
      sales_page = ${JSON.stringify(p.sales_page)}, landing_page = ${JSON.stringify(p.landing_page)},
      file_url = ${p.file_url}, updated_at = now()
    where id = ${id}`;
}

export async function removeProduct(id: string) {
  await requireAdmin();
  await db()`delete from products where id = ${id}`;
}
