// Creates an admin (or resets one) with a temporary password they must change on first sign-in.
// The temporary password stops working after 7 days.
// Usage: npm run admin:add -- someone@example.com "Their Name" "temporary-password"
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import { neon } from "@neondatabase/serverless";

const scrypt = promisify(scryptCb);
const [email, name, temp] = process.argv.slice(2);
if (!email || !email.includes("@") || !name || !temp) {
  console.error('Usage: npm run admin:add -- someone@example.com "Their Name" "temporary-password"');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}

// Same format as src/lib/auth/password.ts: scrypt$N$r$p$salt$hash
const P = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const salt = randomBytes(16);
const hash = await scrypt(temp, salt, 64, P);
const stored = ["scrypt", P.N, P.r, P.p, salt.toString("base64"), hash.toString("base64")].join("$");
const expires = new Date(Date.now() + 7 * 86_400_000).toISOString();

const sql = neon(process.env.DATABASE_URL);
await sql`
  insert into admin_users (email, name, password_hash, must_change_password, temp_password_expires_at)
  values (${email.trim().toLowerCase()}, ${name.trim()}, ${stored}, true, ${expires})
  on conflict (email) do update
    set name = excluded.name, password_hash = excluded.password_hash,
        must_change_password = true, temp_password_expires_at = excluded.temp_password_expires_at`;
// Sign out any existing sessions for this admin.
await sql`delete from admin_sessions where user_id = (select id from admin_users where email = ${email.trim().toLowerCase()})`;

console.log(`${name} <${email}> can sign in with the temporary password until ${expires.slice(0, 10)}, then must change it.`);
