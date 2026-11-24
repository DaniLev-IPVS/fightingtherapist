// Applies db/migrations/*.sql in order, once each. Run: npm run db:migrate
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}
const sql = neon(url);
const dir = join(import.meta.dirname, "..", "db", "migrations");

await sql`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`;
const done = new Set((await sql`select name from schema_migrations`).map((r) => r.name));
const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

for (const file of files) {
  if (done.has(file)) continue;
  const text = await readFile(join(dir, file), "utf8");
  // Split on semicolons at line ends; migrations avoid functions with inner semicolons.
  const statements = text
    .split(/;\s*$/m)
    .map((s) => s.replace(/--.*$/gm, "").trim())
    .filter(Boolean);
  await sql.transaction([...statements.map((s) => sql.query(s)), sql`insert into schema_migrations (name) values (${file})`]);
  console.log(`applied ${file} (${statements.length} statements)`);
}
console.log("migrations up to date");
