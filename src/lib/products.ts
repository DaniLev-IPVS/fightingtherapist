import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/dal";

export * from "./product-options";
import type { Product, ProductInput, PublicProduct } from "./product-options";

/* ── Public reads (cached, refreshed when the dashboard saves) ── */

const PUBLIC_COLUMNS = `id, slug, title, kind, close, goal, access, price_cents, currency, price_note, status, summary,
  image, sales_page, landing_page, sort_order, (file_url is not null) as has_file`;

export async function getPublishedProduct(slug: string): Promise<PublicProduct | null> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  const rows = await db().query(`select ${PUBLIC_COLUMNS} from products where slug = $1 and status = 'published'`, [slug]);
  return (rows[0] as PublicProduct | undefined) ?? null;
}

export async function listPublishedProducts(): Promise<PublicProduct[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  try {
    return (await db().query(
      `select ${PUBLIC_COLUMNS} from products where status = 'published' order by sort_order, created_at`,
    )) as PublicProduct[];
  } catch (error) {
    // Pages still render (without products) if the database is unreachable at build time.
    console.error("[products] list failed", error);
    return [];
  }
}

/** Server only, for the free-download form: the file link of a published free product. */
export async function freeDownloadFor(slug: string) {
  const [row] = await db()`
    select file_url from products where slug = ${slug} and status = 'published' and close = 'free' and file_url is not null`;
  return (row?.file_url as string | undefined) ?? null;
}

/* ── Admin ── */

export async function listProducts() {
  await requireAdmin();
  return (await db()`select * from products order by sort_order, created_at`) as Product[];
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
    insert into products (slug, title, kind, close, goal, access, price_cents, currency, price_note, status, summary, image,
      sales_page, landing_page, file_url, sort_order)
    values (${p.slug}, ${p.title}, ${p.kind}, ${p.close}, ${p.goal}, ${p.access}, ${p.price_cents}, ${p.currency}, ${p.price_note},
      ${p.status}, ${p.summary}, ${p.image}, ${JSON.stringify(p.sales_page)}, ${JSON.stringify(p.landing_page)}, ${p.file_url},
      (select coalesce(max(sort_order), 0) + 1 from products))
    returning id`;
  return row.id as string;
}

export async function updateProduct(id: string, p: ProductInput) {
  await requireAdmin();
  await db()`
    update products set slug = ${p.slug}, title = ${p.title}, kind = ${p.kind}, close = ${p.close}, goal = ${p.goal},
      access = ${p.access}, price_cents = ${p.price_cents}, currency = ${p.currency}, price_note = ${p.price_note},
      status = ${p.status}, summary = ${p.summary}, image = ${p.image},
      sales_page = ${JSON.stringify(p.sales_page)}, landing_page = ${JSON.stringify(p.landing_page)},
      file_url = ${p.file_url}, updated_at = now()
    where id = ${id}`;
}

export async function removeProduct(id: string) {
  await requireAdmin();
  await db()`delete from products where id = ${id}`;
}
