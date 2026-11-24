# The Fighting Therapist

Website for Zakaria "Zack" Benbouchta: fight-tested rehab, training and nutrition coaching.

## Run it

```bash
npm install
npm run dev -- --port 3100
```

Open http://localhost:3100.

## Where things are

| Path | What |
| --- | --- |
| `src/content/site.ts` | Facts, offers, reviews, press, navigation |
| `src/components/sections.tsx` | Homepage sections, reused on inner pages |
| `src/components/programs.tsx` | Program shelf and offer blocks |
| `src/components/lead-form.tsx` | The one form, used everywhere |
| `src/lib/attribution.ts` | UTM and referrer capture for the CRM |
| `src/app/api/leads/route.ts` | Form endpoint (logs only until the CRM ships) |
| `docs/` | Audit, PDF report and wireframes |
| `assets/` | Original photos from the old site and AI-generated images |

## Status

Step 4 (main site) is built. Forms validate and post, but leads are only logged until step 5 adds the CRM database, so don't send real traffic to the forms before then.
