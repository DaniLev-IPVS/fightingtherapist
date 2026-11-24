@AGENTS.md

# The Fighting Therapist

Next.js 16 (App Router, Cache Components on) + Tailwind v4, deployed on Vercel. Repo: DaniLev-IPVS/fightingtherapist.

## Commands
- `npm run dev -- --port 3100` · `npm run build` · `npm run lint`

## Conventions
- All site facts, offers, reviews and press live in `src/content/site.ts`. Change copy there, not in components.
- Design tokens are in `src/app/globals.css` (`@theme`): charcoal, logo blue, off-white, steel. No dark-mode switch.
- Name is "Zakaria Benbouchta", short form "Zack". Credentials: CAT(C), 10+ years, 100+ clients, 50+ fights.
- Review quotes are verbatim excerpts from Google reviews; an ellipsis marks a cut. Never paraphrase inside quote marks.
- Every form posts to `/api/leads` with attribution from `src/lib/attribution.ts` (UTM, click IDs, referrer, first and last touch).
- `next/image`: use `preload` (not `priority`); allowed qualities are 75 and 85.
- English first; French comes after launch, so keep copy in data files.

## Roadmap (each step confirmed by Daniel before the next)
1-3 done: audit, wireframes (`docs/`). 4 main site (this build). 5 backend: auth, CRM, products dashboard. 6 sales + landing pages per offer and product. 7 client portal.
