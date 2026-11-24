// Adds the five coaching offers to the products table with sales and landing page copy.
// Safe to re-run: offers that already exist (same link name) are left alone, so dashboard edits stay.
// Usage: npm run db:seed-offers
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}

const offers = [
  {
    slug: "rehab",
    title: "Online Rehab Coaching",
    goal: "rehab",
    image: "/images/programs/rehab.jpg",
    price_note: "Monthly coaching",
    summary: "A step-by-step online rehab plan for back, neck, shoulder, knee, hip or post-surgery pain.",
    sales: {
      headline: "Get back to training without the pain.",
      subheadline:
        "A step-by-step online rehab plan from an athletic therapist who has fought through his own injuries. Built around your injury, your sport and your schedule.",
      whoFor: [
        "You have back, neck, shoulder, knee or hip pain that keeps coming back",
        "You're coming back from surgery and want a plan, not guesswork",
        "You've tried rest, physio or chiro and you're still not training the way you want",
        "You want to understand why every exercise is in your plan",
      ],
      outcomes: [
        "Train without pain: Get through your sessions without bracing for the next flare-up.",
        "A plan that adapts: Your program changes as you get stronger, not on a fixed template.",
        "Stronger than before: Rebuild the strength and stability that keep the injury from coming back.",
        "Back to your sport, safely: Pass return-to-sport testing before you go back to full training.",
      ],
      included: [
        "Assessment of your injury and your sport",
        "Step-by-step rehab program, updated as you progress",
        "Check-ins by text and email",
        "Return-to-sport testing before you go back to full training",
      ],
      outcomeAgain: "Picture your next session: no bracing, no guessing, just training. That's what your plan is built for.",
      closeTitle: "Start your rehab plan",
      cta: "Start my rehab",
    },
    landing: {
      headline: "Stop training around your injury.",
      subheadline: "Tell Zack what hurts and what you want to get back to. He replies within 24 hours with how online rehab would work for you.",
      formTitle: "Tell Zack about your injury",
      cta: "Start my rehab",
    },
  },
  {
    slug: "training",
    title: "1:1 Online Coaching",
    goal: "training",
    image: "/images/programs/training.jpg",
    price_note: "Monthly, 3-month minimum. 25% off your last month on a 6-month commitment.",
    summary: "A personalized training and nutrition program from Zack, with coaching by text and email.",
    sales: {
      headline: "Get stronger every month, with a coach in your pocket.",
      subheadline:
        "A training and nutrition program built for your body, adjusted as you progress, with Zack a text away between sessions.",
      whoFor: [
        "You want to lose weight, build muscle or both",
        "You're tired of templates that ignore your body and your schedule",
        "You want someone checking your progress and adjusting the plan",
        "You train around old injuries and want a program that respects them",
      ],
      outcomes: [
        "Stronger every month: Your program is built for your body and updated as you progress.",
        "Leaner without crash diets: A nutrition guide built around how you already eat.",
        "No more guessing: Ask Zack by text or email whenever you're stuck.",
        "Accountability that sticks: Bi-weekly meetings keep your training and recipes on track.",
      ],
      included: [
        "Personalized workout program",
        "Comprehensive nutrition guide",
        "Coaching by text and email",
        "Bi-weekly meetings for training and recipes",
        "Advanced tier: two 30-minute video calls a month",
      ],
      outcomeAgain: "Three months from now you could be lifting more, moving better and actually enjoying your plan. It starts with one message.",
      closeTitle: "Apply for 1:1 coaching",
      cta: "Apply now",
    },
    landing: {
      headline: "Your program. Your body. Your coach.",
      subheadline: "Tell Zack your goal and he replies within 24 hours with how 1:1 coaching would work for you.",
      formTitle: "Tell Zack your goal",
      cta: "Apply now",
    },
  },
  {
    slug: "nutrition",
    title: "Nutrition Coaching",
    goal: "nutrition",
    image: "/images/programs/nutrition.jpg",
    price_note: "Part of 1:1 coaching",
    summary: "A nutrition plan built around how you already eat, with recipes, check-ins and adjustments.",
    sales: {
      headline: "Lose fat and keep it off. Dinners out included.",
      subheadline: "A nutrition plan built around how you already eat, with recipes, check-ins and adjustments from Zack. No crash diets.",
      whoFor: [
        "You want to lose fat or gain muscle without crash diets",
        "You've lost weight before and it came back",
        "You want to understand food, not follow a list",
        "You still want dinners out and the odd glass of wine",
      ],
      outcomes: [
        "Leaner without crash diets: Eat for results with a plan that fits your week.",
        "Keep it off: Build habits you can hold long after the plan ends.",
        "Know what to eat: Recipes and meal structure take the guesswork out.",
        "Adjusted as you go: Regular check-ins keep the plan working as your body changes.",
      ],
      included: [
        "Nutrition plan built around how you already eat",
        "Recipes and meal structure",
        "Regular check-ins and adjustments",
        "Included in every coaching tier",
      ],
      outcomeAgain: "Clients have lost anywhere from 20 to 74 lb. The plan fits your life, so the results stay.",
      closeTitle: "Start your nutrition plan",
      cta: "Start my plan",
    },
    landing: {
      headline: "Eat for results. Still enjoy dinner.",
      subheadline: "Tell Zack your goal and how you eat now. He replies within 24 hours with how nutrition coaching would work for you.",
      formTitle: "Tell Zack your goal",
      cta: "Start my plan",
    },
  },
  {
    slug: "fight-camp",
    title: "Fight Camp Weight Cut",
    goal: "fight-camp",
    image: "/images/programs/fight.jpg",
    price_note: "Priced to your camp. Travel not included.",
    summary: "Weight cut, rehydration and fight-week support for amateur and pro fighters.",
    sales: {
      headline: "Make weight and fight at full power.",
      subheadline: "Weight cut, rehydration and fight-week support from a coach with 50+ fights behind him.",
      whoFor: [
        "You're an amateur or pro fighter in camp",
        "Your last cut left you flat on fight night",
        "You want a rehydration plan built for you, not copied from someone else",
        "You want someone in your corner through fight week",
      ],
      outcomes: [
        "On weight, on time: A cut strategy planned across your whole camp.",
        "Strong after weigh-ins: A personalized rehydration protocol so you recover before you fight.",
        "Fuel for hard days: Meal prep guidance that supports your toughest sessions.",
        "Support on fight day: Zack is there when it matters most.",
      ],
      included: [
        "Weight management and cut strategy for your camp",
        "Personalized rehydration protocol after weigh-ins",
        "Meal prep guidance for hard training days",
        "One-on-one consults for program changes",
        "Fight-day support",
      ],
      outcomeAgain: "Step on the scale on weight, rehydrate properly and walk out feeling like yourself. That's the camp Zack builds with you.",
      closeTitle: "Plan your weight cut",
      cta: "Plan my cut",
    },
    landing: {
      headline: "Stop losing the fight on the scale.",
      subheadline: "Tell Zack your weight class, your fight date and where you're at now. He replies within 24 hours.",
      formTitle: "Tell Zack about your fight",
      cta: "Plan my cut",
    },
  },
  {
    slug: "group",
    title: "10-Week Group Program",
    goal: "group",
    image: "/images/programs/group.jpg",
    price_note: "10 weeks. Next group opens when enough people join.",
    summary: "A 10-week workout plan and nutrition guide, coached by Zack, in a group of 5 to 20 people.",
    sales: {
      headline: "Ten weeks. One crew. Real results.",
      subheadline:
        "A 10-week workout plan and nutrition guide coached by Zack, with a group that keeps you showing up, at a lower price than 1:1 coaching.",
      whoFor: [
        "You want structure and accountability",
        "You train better with people beside you",
        "You want Zack's coaching at a lower price than 1:1",
        "You can commit to 10 weeks",
      ],
      outcomes: [
        "A crew behind you: Train alongside 5 to 20 people chasing the same goal.",
        "A plan you can follow: A 10-week workout plan with a clear path from week one.",
        "Eat for your goal: A nutrition guide with sample recipes.",
        "Never off track for long: Bi-weekly check-ins by messaging.",
      ],
      included: [
        "10-week workout plan",
        "Nutrition guide with sample recipes",
        "Bi-weekly check-ins by messaging",
        "Groups of 5 to 20 people",
      ],
      outcomeAgain: "Ten weeks from now you could be stronger, leaner and part of a crew that kept you going.",
      closeTitle: "Join the next group",
      cta: "Join the group",
    },
    landing: {
      headline: "Get fit with a crew, coached by Zack.",
      subheadline: "Ten weeks of training and nutrition with a group that keeps you accountable. Leave your details to hear when the next group opens.",
      formTitle: "Join the next group",
      cta: "Join the group",
    },
  },
];

const sql = neon(process.env.DATABASE_URL);
let added = 0;
for (const [i, o] of offers.entries()) {
  const sales = { ...o.sales, whoFor: o.sales.whoFor.join("\n"), outcomes: o.sales.outcomes.join("\n"), included: o.sales.included.join("\n") };
  const rows = await sql`
    insert into products (slug, title, kind, close, goal, access, price_cents, currency, price_note, status, summary, image,
      sales_page, landing_page, sort_order)
    values (${o.slug}, ${o.title}, 'coaching', 'contact', ${o.goal}, 'paid', null, 'CAD', ${o.price_note}, 'published',
      ${o.summary}, ${o.image}, ${JSON.stringify(sales)}, ${JSON.stringify(o.landing)}, ${i + 1})
    on conflict (slug) do nothing
    returning slug`;
  if (rows.length) added++;
  console.log(rows.length ? `added   ${o.slug}` : `exists  ${o.slug} (left as is)`);
}
console.log(`${added} offer(s) added.`);
