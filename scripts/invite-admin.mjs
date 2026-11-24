// Creates (or re-invites) an admin and prints a one-time link to set their password.
// Usage: npm run admin:invite -- someone@example.com "Their Name" [https://site-url]
import { createHash, randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const [email, name, base = "https://fightingtherapist.vercel.app"] = process.argv.slice(2);
if (!email || !email.includes("@") || !name) {
  console.error('Usage: npm run admin:invite -- someone@example.com "Their Name" [https://site-url]');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const token = randomBytes(32).toString("base64url");
const tokenHash = createHash("sha256").update(token).digest("hex");
const expires = new Date(Date.now() + 7 * 86_400_000).toISOString();

await sql`
  insert into admin_users (email, name, setup_token_hash, setup_expires_at)
  values (${email.trim().toLowerCase()}, ${name.trim()}, ${tokenHash}, ${expires})
  on conflict (email) do update
    set name = excluded.name, setup_token_hash = excluded.setup_token_hash, setup_expires_at = excluded.setup_expires_at`;

console.log(`\nInvite ready for ${name} <${email}>. The link works once and expires in 7 days:\n`);
console.log(`${base.replace(/\/$/, "")}/admin/setup?token=${token}\n`);
