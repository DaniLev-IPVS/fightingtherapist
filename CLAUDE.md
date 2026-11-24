@AGENTS.md

# The Fighting Therapist

Next.js 16 (App Router, Cache Components on) + Tailwind v4, deployed on Vercel. Repo: DaniLev-IPVS/fightingtherapist.

## Commands
- `npm run dev -- --port 3100` · `npm run build` · `npm run lint`
- `npm run db:migrate` applies `db/migrations/*.sql` to Neon (`DATABASE_URL` in `.env.local`)
- `npm run db:seed-offers` adds the five coaching offers to products (skips ones that exist)
- `npm run admin:add -- email "Name" "temp-password"` creates an admin who must change the password on first sign-in (temp expires in 7 days)

## Conventions
- All site facts, offers, reviews and press live in `src/content/site.ts`. Change copy there, not in components.
- Design tokens are in `src/app/globals.css` (`@theme`): charcoal, logo blue, off-white, steel. No dark-mode switch.
- Name is "Zakaria Benbouchta", short form "Zack". Credentials: CAT(C), 10+ years, 100+ clients, 50+ fights.
- Offer page copy (sales/landing): plain sentences to the reader about their real situation. No slogan or tagline lines ("Real clients. Real comebacks."), no repeating the same point across sections. Proof goes high: client results (`resultsByGoal` in `site.ts`) and reviews right under the hero. Never use AI or stock before/after photos as client results; only real ones with permission.
- Review quotes are verbatim excerpts from Google reviews; an ellipsis marks a cut. Never paraphrase inside quote marks.
- Every form posts to `/api/leads` with attribution from `src/lib/attribution.ts` (UTM, click IDs, referrer, first and last touch); leads are stored in Neon and the first touch sets `source`.
- Products (coaching offers, PDFs, lessons) live in Neon, edited at /admin/products. Each published product gets a sales page at `/programs/[slug]` and a landing page at `/go/[slug]` (`src/components/offer-pages.tsx`); saving in the dashboard refreshes them via `updateTag("products")`. The `goal` field links a coaching product to its offer in `site.ts` and picks its reviews.
- Lead pipeline stages, counters and the monthly client goal live in `src/lib/pipeline.ts` (client-safe). The board (`src/components/admin/pipeline-board.tsx`) drags with pointer events so it works on phones (long-press, then drop on a column or the bottom dock). Lead photos are resized in the browser and stored as small JPEG data URLs (`photo`, `photo_thumb`).
- Admin lives in `src/app/admin` (sign-in, CRM, products). Every data function calls `requireAdmin()` from `src/lib/auth/dal.ts`; `src/proxy.ts` only bounces signed-out visitors.
- `next/image`: use `preload` (not `priority`); allowed qualities are 75 and 85.
- English first; French comes after launch, so keep copy in data files.

## Roadmap (each step confirmed by Daniel before the next)
1-3 done: audit, wireframes (`docs/`). 4 main site. 5 backend: auth, CRM, products dashboard. 6 sales + landing pages per offer and product (pages built; Stripe checkout and file uploads still to do). 7 client portal.
