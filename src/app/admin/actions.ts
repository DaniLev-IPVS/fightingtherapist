"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession, destroySession, getSessionUser, hashToken } from "@/lib/auth/session";
import { hashPassword, verifyPassword, MIN_PASSWORD } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/dal";
import { addLeadNote, deleteLead, isStatus, setLeadStatus } from "@/lib/crm";
import {
  LANDING_FIELDS,
  SALES_FIELDS,
  insertProduct,
  removeProduct,
  slugTaken,
  slugify,
  updateProduct,
  type ProductInput,
} from "@/lib/products";

export type FormState = { error?: string; fieldErrors?: Record<string, string>; ok?: boolean } | undefined;

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

/** Only same-site paths, so ?next= can't bounce people to another domain. */
const safeNext = (v: string) => (v.startsWith("/admin") && !v.startsWith("//") ? v : "/admin");

/* ── Sign-in ─────────────────────────────────────────── */

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const email = str(form, "email").toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  const [user] = await db()`
    select id, password_hash, must_change_password, temp_password_expires_at < now() as temp_expired
    from admin_users where email = ${email}`;
  const ok = await verifyPassword(password, (user?.password_hash as string | null) ?? null);
  if (!user || !ok) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "That email and password don't match." };
  }
  if (user.must_change_password && user.temp_expired) {
    return { error: "This temporary password has expired. Ask Daniel for a new one." };
  }
  await createSession(user.id as string);
  redirect(user.must_change_password ? "/admin/change-password" : safeNext(str(form, "next")));
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}

export async function setupPassword(_: FormState, form: FormData): Promise<FormState> {
  const token = str(form, "token");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < MIN_PASSWORD) return { error: `Use at least ${MIN_PASSWORD} characters.` };
  if (password !== confirm) return { error: "The two passwords don't match." };
  const [user] = await db()`
    select id from admin_users where setup_token_hash = ${hashToken(token)} and setup_expires_at > now()`;
  if (!user) return { error: "This link has expired or was already used. Ask for a new invite." };
  await db()`
    update admin_users set password_hash = ${await hashPassword(password)}, setup_token_hash = null, setup_expires_at = null
    where id = ${user.id}`;
  await createSession(user.id as string);
  redirect("/admin");
}

export async function changePassword(_: FormState, form: FormData): Promise<FormState> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < MIN_PASSWORD) return { error: `Use at least ${MIN_PASSWORD} characters.` };
  if (password !== confirm) return { error: "The two passwords don't match." };
  if (/^(12345|password|fightingtherapist)/i.test(password)) return { error: "Pick something harder to guess." };
  await db()`
    update admin_users
    set password_hash = ${await hashPassword(password)}, must_change_password = false, temp_password_expires_at = null
    where id = ${user.id}`;
  redirect("/admin");
}

/* ── CRM ─────────────────────────────────────────────── */

export async function updateLeadStatus(form: FormData) {
  const id = str(form, "id");
  const status = str(form, "status");
  if (!isStatus(status)) return;
  await setLeadStatus(id, status);
  revalidatePath("/admin", "layout");
}

export async function addNote(form: FormData) {
  const id = str(form, "id");
  await addLeadNote(id, str(form, "body"));
  revalidatePath(`/admin/leads/${id}`);
}

export async function removeLead(form: FormData) {
  await deleteLead(str(form, "id"));
  revalidatePath("/admin", "layout");
  redirect("/admin/leads");
}

/* ── Products ────────────────────────────────────────── */

export async function saveProduct(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(form, "id") || null;
  const title = str(form, "title");
  const slug = slugify(str(form, "slug") || title);
  const kind = str(form, "kind") === "lesson" ? "lesson" : "pdf";
  const access = str(form, "access") === "free" ? "free" : "paid";
  const priceRaw = str(form, "price").replace(/[$,\s]/g, "");
  const fieldErrors: Record<string, string> = {};

  if (title.length < 3) fieldErrors.title = "Give it a title of at least 3 characters.";
  if (!slug) fieldErrors.slug = "Add a link name using letters and numbers.";
  else if (await slugTaken(slug, id ?? undefined)) fieldErrors.slug = "Another product already uses this link name.";
  let price_cents: number | null = null;
  if (access === "paid" && priceRaw) {
    const n = Number(priceRaw);
    if (!Number.isFinite(n) || n < 0 || n > 100000) fieldErrors.price = "Enter a price like 29 or 29.99.";
    else price_cents = Math.round(n * 100);
  }
  const status = str(form, "status") === "published" ? "published" : "draft";
  if (status === "published" && access === "paid" && price_cents == null) {
    fieldErrors.price = "Paid products need a price before they can be published.";
  }
  const fileUrl = str(form, "file_url");
  if (fileUrl && !/^https:\/\//.test(fileUrl)) fieldErrors.file_url = "Use a link that starts with https://";
  if (Object.keys(fieldErrors).length) return { fieldErrors, error: "Fix the highlighted fields." };

  const pick = (prefix: string, fields: readonly { key: string }[]) =>
    Object.fromEntries(fields.map((f) => [f.key, str(form, `${prefix}.${f.key}`)]).filter(([, v]) => v));

  const input: ProductInput = {
    slug,
    title,
    kind,
    access,
    price_cents: access === "free" ? null : price_cents,
    currency: "CAD",
    status,
    summary: str(form, "summary") || null,
    sales_page: pick("sales", SALES_FIELDS),
    landing_page: pick("landing", LANDING_FIELDS),
    file_url: fileUrl || null,
  };

  const savedId = id ?? (await insertProduct(input));
  if (id) await updateProduct(id, input);
  revalidatePath("/admin/products", "layout");
  if (!id) redirect(`/admin/products/${savedId}?saved=1`);
  return { ok: true };
}

export async function deleteProduct(form: FormData) {
  await removeProduct(str(form, "id"));
  revalidatePath("/admin/products", "layout");
  redirect("/admin/products");
}
