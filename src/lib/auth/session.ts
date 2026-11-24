import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "ft_admin";
const SESSION_DAYS = 30;

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export type AdminUser = { id: string; email: string; name: string; must_change_password: boolean };

/** Starts a session: random token in an httpOnly cookie, only its hash in the database. */
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const sql = db();
  await sql`insert into admin_sessions (id, user_id, expires_at) values (${hash(token)}, ${userId}, ${expires.toISOString()})`;
  await sql`update admin_users set last_login_at = now() where id = ${userId}`;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db()`delete from admin_sessions where id = ${hash(token)}`;
  jar.delete(SESSION_COOKIE);
}

/** The signed-in admin, or null. Reads the request, so callers render at request time. */
export async function getSessionUser(): Promise<AdminUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db()`
    select u.id, u.email, u.name, u.must_change_password
    from admin_sessions s join admin_users u on u.id = s.user_id
    where s.id = ${hash(token)} and s.expires_at > now()
    limit 1`;
  return (rows[0] as AdminUser | undefined) ?? null;
}

export function hashToken(token: string) {
  return hash(token);
}
