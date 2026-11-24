// Adds the five coaching offers to the products table with sales and landing page copy.
// Default: offers that already exist (same link name) are left alone, so dashboard edits stay.
// --update: overwrite the page text (sales and landing) of existing offers with the copy below.
// Usage: npm run db:seed-offers            (add missing offers)
//        npm run db:seed-offers -- --update (also rewrite page text of existing ones)
//
// Copy rules: talk to the reader about their real situation, in plain sentences.
// No slogan lines or "X. Y. Z." taglines. The problem, the comparison and the
// benefits each say something different. Facts only from the site and reviews.
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}
const update = process.argv.includes("--update");

const offers = [
  {
    slug: "rehab",
    title: "Online Rehab Coaching",
    goal: "rehab",
    image: "/images/offers/rehab/hero.jpg",
    price_note: "Monthly coaching",
    summary: "A step-by-step online rehab plan for back, neck, shoulder, knee, hip or post-surgery pain.",
    sales: {
      callout: "For athletes and lifters stuck with back, knee, shoulder or hip pain",
      headline: "Train hard again without the pain, even if your injury keeps coming back",
      subheadline:
        "Lift, run, spar and roll without bracing for the next flare-up. You rebuild the strength around your injury so it stops coming back, and you go back to your sport knowing you're ready.",
      problemTitle: "You've rested it, stretched it and paid for treatment, and it still hurts when you train",
      problem: [
        "Maybe it's your lower back after deadlifts, a knee that aches after every run, or a shoulder you can't press overhead anymore. You took time off and it felt better. Then you went back to training and it flared up again within a week.",
        "So now you train around it. You skip the lifts that hurt, warm up for twenty minutes, and quietly wonder if this is just how it's going to be from now on.",
        "Rest and treatment can calm the pain down, but they don't rebuild the strength around the injury. That's why it comes back as soon as you load it again.",
      ],
      compareLeft: "Most rehab",
      compare: [
        "A generic sheet of exercises | A plan built around your injury and your sport",
        "The same exercises for months | A program that changes as you get stronger",
        "Treatment that calms the pain for a few days | Strength work that keeps it from coming back",
        "Back to training once it stops hurting | Return-to-sport testing before you go back to full training",
        "Advice from someone who doesn't train | A therapist who fights and trains himself",
      ],
      outcomesTitle: "What you'll be able to do",
      outcomes: [
        "Train hard without bracing for the pain: Pick up the bar, run, spar or roll without that moment of waiting for it to hurt.",
        "Know exactly what to do each day: Your plan tells you what to do, how much and why, so you stop guessing.",
        "Come back stronger than before the injury: You rebuild the strength and control the injury took away, which is what keeps it from happening again.",
        "Go back to your sport knowing you're ready: Return-to-sport testing shows you're ready before you go back to full training.",
        "Understand your own body: Zack explains why every exercise is in your plan, so you know how to look after the injury long after you finish.",
      ],
      steps: [
        "Tell Zack what's going on: Fill in the form with your injury, your sport and what you want to get back to. He replies within 24 hours.",
        "Get assessed and get your plan: Zack assesses your injury and your sport, then builds your step-by-step rehab program.",
        "Train, check in and progress: Check in by text and email while your program changes with you, all the way to return-to-sport testing.",
      ],
      included: [
        "Assessment of your injury and your sport",
        "Step-by-step rehab program, updated as you progress",
        "Check-ins by text and email",
        "Return-to-sport testing before you go back to full training",
      ],
      outcomeAgain:
        "Picture finishing a full session and realising you didn't think about your injury once. Tell Zack what's going on and he'll tell you how he would approach your rehab.",
      closeTitle: "Tell Zack about your injury",
      cta: "Start my rehab",
    },
    landing: {
      headline: "Get back to training hard, without the pain coming back",
      subheadline:
        "Stop skipping the lifts that hurt and warming up for twenty minutes just to get through a session. Tell Zack what hurts and you'll hear back within 24 hours.",
      formTitle: "Tell Zack about your injury",
      cta: "Start my rehab",
    },
  },
  {
    slug: "training",
    title: "1:1 Online Coaching",
    goal: "training",
    image: "/images/offers/training/hero.jpg",
    price_note: "Monthly, 3-month minimum. 25% off your last month on a 6-month commitment.",
    summary: "A personalized training and nutrition program from Zack, with coaching by text and email.",
    sales: {
      callout: "For people who want to lose fat, build muscle or both, and stick with it this time",
      headline: "Get stronger every month and stay consistent, even if you've started over before",
      subheadline:
        "Watch the weights go up, lose the fat that's been hanging around, and keep going on the weeks you'd normally quit, with a plan that fits your body, your schedule and your old injuries.",
      problemTitle: "You know you should be further along by now",
      problem: [
        "You've tried the apps, the YouTube programs and the 12-week challenges. You start strong and see some progress. Then work gets busy, you miss a week, and it slides. A few months later you're back at the start.",
        "It isn't that you're lazy. A program written for everyone doesn't know about your bad shoulder, your job or the forty-five minutes you have on a good day. And nobody notices when you stop showing up.",
        "What changes things is a plan built for your life and a person who checks in on you.",
      ],
      compareLeft: "Apps and templates",
      compare: [
        "Written for everyone | Built for your body, goals and schedule",
        "The same plan whether you progress or not | Adjusted as you progress",
        "Nobody to ask when you're stuck | Coaching by text and email",
        "Nobody notices when you skip a week | Bi-weekly meetings to keep you on track",
        "Nutrition left to guesswork | A nutrition guide built around how you eat",
      ],
      outcomesTitle: "What you get from 1:1 coaching",
      outcomes: [
        "See yourself get stronger month after month: The weights go up and your body changes, because your program moves with you.",
        "A plan you can keep doing: Training fits your schedule and works around old injuries, so life doesn't knock you off it.",
        "Lose fat without living on chicken and rice: Your nutrition guide works with food you already like.",
        "Someone in your corner: When you're stuck, sore or unsure, you text Zack instead of guessing.",
        "Consistency that lasts: Someone is expecting you every two weeks, which gets you through the weeks you'd normally quit.",
      ],
      steps: [
        "Apply: Tell Zack your goal, your schedule and what's held you back before. He replies within 24 hours.",
        "Get your program: Zack builds your workout program and nutrition guide around you.",
        "Train with a coach: Check in by text and email, meet every two weeks, and your plan changes as you progress.",
      ],
      included: [
        "Personalized workout program",
        "Comprehensive nutrition guide",
        "Coaching by text and email",
        "Bi-weekly meetings for training and recipes",
        "Advanced tier: two 30-minute video calls a month",
      ],
      outcomeAgain:
        "Three months from now you could be stronger, leaner and still going, instead of starting over again. Apply below and Zack will tell you how he'd set up your first month.",
      closeTitle: "Apply for 1:1 coaching",
      cta: "Apply now",
    },
    landing: {
      headline: "Get stronger every month and stay consistent this time",
      subheadline: "A plan built around your life means you keep making progress instead of starting over every few months. Tell Zack your goal and you'll hear back within 24 hours.",
      formTitle: "Tell Zack your goal",
      cta: "Apply now",
    },
  },
  {
    slug: "nutrition",
    title: "Nutrition Coaching",
    goal: "nutrition",
    image: "/images/offers/nutrition/hero.jpg",
    price_note: "Part of 1:1 coaching",
    summary: "A nutrition plan built around how you already eat, with recipes, check-ins and adjustments.",
    sales: {
      callout: "For people who've lost weight before and watched it come back",
      headline: "Lose the weight for good, even if you've lost it and gained it back before",
      subheadline:
        "Keep eating the food you like, enjoy dinners out and the odd glass of wine, and watch the weight come off and stay off. Clients have lost anywhere from 20 to 74 lb.",
      problemTitle: "You've lost weight before, and it came back every time",
      problem: [
        "Keto, counting points, shakes, no carbs after 6pm. Each one worked for a while. Then came a holiday, a stressful month or a birthday dinner, the rules fell apart, and the weight came back with a few extra pounds.",
        "Every time it happens it's harder to start again, and you start to believe you just don't have the discipline.",
        "The diets didn't fail because of you. They asked you to live a life you don't actually live. A plan you can't follow at a restaurant on a Friday is not a plan you can follow for a year.",
      ],
      compareLeft: "Diets",
      compare: [
        "Cut out the foods you love | Built around how you already eat",
        "The same rules for everyone | A plan made for your body and your goal",
        "Fall apart the first time you eat out | Dinners out and the odd glass of wine planned in",
        "On your own when progress stalls | Regular check-ins and adjustments",
        "The weight comes back when the diet ends | Habits you keep after the coaching ends",
      ],
      outcomesTitle: "What changes for you",
      outcomes: [
        "Lose fat without giving up the food you enjoy: Your plan is built around what you already eat, so it doesn't feel like a diet.",
        "Eat out without wrecking your week: Restaurants, birthdays and a glass of wine are part of the plan, not a reason to start over on Monday.",
        "Stop thinking about food all day: Recipes and a simple meal structure take the daily guesswork out.",
        "Keep the weight off: You build habits you can hold long after the coaching ends.",
      ],
      steps: [
        "Tell Zack your goal: Share where you are now, how you eat and what's worked or failed before. He replies within 24 hours.",
        "Get your plan: Zack builds your nutrition plan, recipes and meal structure around your life.",
        "Check in and adjust: Regular check-ins keep the plan working as your body changes.",
      ],
      included: [
        "Nutrition plan built around how you already eat",
        "Recipes and meal structure",
        "Regular check-ins and adjustments",
        "Included in every coaching tier",
      ],
      outcomeAgain:
        "Picture ordering dinner out without doing the maths in your head, and getting dressed without checking the mirror twice. Tell Zack where you're starting from and he'll tell you how he'd get you there.",
      closeTitle: "Start your nutrition plan",
      cta: "Start my plan",
    },
    landing: {
      headline: "Lose the weight for good, without giving up dinners out",
      subheadline: "No foods banned, no starting over every Monday, and results that last after the plan ends. Tell Zack your goal and you'll hear back within 24 hours.",
      formTitle: "Tell Zack your goal",
      cta: "Start my plan",
    },
  },
  {
    slug: "fight-camp",
    title: "Fight Camp Weight Cut",
    goal: "fight-camp",
    image: "/images/offers/fight-camp/hero.jpg",
    price_note: "Priced to your camp. Travel not included.",
    summary: "Weight cut, rehydration and fight-week support for amateur and pro fighters.",
    sales: {
      callout: "For amateur and pro fighters in camp",
      headline: "Make weight and still feel strong on fight night",
      subheadline:
        "Step on the scale on weight without a last-week panic, rehydrate properly, and walk out with all the strength and cardio you built in camp still in your legs.",
      problemTitle: "Your last cut cost you more than the weight",
      problem: [
        "You spent the last week of camp hungry, spitting and sitting in a sauna suit. You made weight, barely. Then you woke up on fight day flat and heavy-legged, and you were tired by the second round.",
        "Most fighters cut the way their teammates do, or the way they did last time, and hope it works out.",
        "A crash cut and guessed rehydration can throw away the strength and cardio you spent your whole camp building.",
      ],
      compareLeft: "Cutting on guesswork",
      compare: [
        "A crash cut in the last week | Weight managed across the whole camp",
        "Copying a teammate's rehydration | A rehydration protocol built for you",
        "Under-fuelled for hard sessions | Meal prep guidance for hard training days",
        "Figuring out fight week alone | One-on-one consults and fight-day support",
      ],
      outcomesTitle: "What a planned cut gives you",
      outcomes: [
        "Step on the scale on weight, on time: Your cut is planned across camp, so the last week isn't a panic.",
        "Recover properly after weigh-ins: A rehydration protocol built for your body, so you refuel before you fight.",
        "Train hard all camp: Meal prep guidance keeps you fuelled for the sessions that matter.",
        "Have someone in your corner on fight week: Consults for changes and support on fight day, from someone who has fought 50+ times.",
      ],
      steps: [
        "Tell Zack about your fight: Your weight class, fight date and where your weight is now. He replies within 24 hours.",
        "Get your cut plan: Zack builds your weight management and rehydration plan around your camp.",
        "Cut, check in, compete: Adjust with one-on-one consults and get support on fight day.",
      ],
      included: [
        "Weight management and cut strategy for your camp",
        "Personalized rehydration protocol after weigh-ins",
        "Meal prep guidance for hard training days",
        "One-on-one consults for program changes",
        "Fight-day support",
      ],
      outcomeAgain:
        "Make weight, rehydrate properly and walk out feeling like yourself, with all the work from camp still in your legs. Tell Zack about your fight and he'll tell you how he'd plan your cut.",
      closeTitle: "Tell Zack about your fight",
      cta: "Plan my cut",
    },
    landing: {
      headline: "Make weight and feel like yourself on fight night",
      subheadline: "A cut planned across your whole camp, so you don't spend fight week starving and walk out flat. Send your weight class and fight date and you'll hear back within 24 hours.",
      formTitle: "Tell Zack about your fight",
      cta: "Plan my cut",
    },
  },
  {
    slug: "group",
    title: "10-Week Group Program",
    goal: "group",
    image: "/images/offers/group/hero.jpg",
    price_note: "10 weeks. Next group opens when enough people join.",
    summary: "A 10-week workout plan and nutrition guide, coached by Zack, in a group of 5 to 20 people.",
    sales: {
      callout: "For people who want coaching and accountability without paying for 1:1",
      headline: "Get fitter and stronger in 10 weeks, with a group that keeps you showing up",
      subheadline:
        "Know exactly what to do every session, eat in a way that supports it, and stay consistent because people are expecting you, for less than 1:1 coaching.",
      problemTitle: "It's hard to stay consistent when nobody notices if you skip",
      problem: [
        "You know roughly what to do. But on your own it's easy to push the workout to tomorrow, skip the last set, or let one missed week turn into a month.",
        "1:1 coaching would help, but it isn't in the budget right now.",
        "You want structure and someone checking in, at a price that makes sense.",
      ],
      compareLeft: "Training on your own",
      compare: [
        "No plan, or a random one | A 10-week workout plan",
        "Guessing at nutrition | A nutrition guide with sample recipes",
        "Nobody checks in | Bi-weekly check-ins by messaging",
        "Easy to skip | A group of 5 to 20 people doing it with you",
      ],
      outcomesTitle: "What you get from the group",
      outcomes: [
        "Show up because people expect you: A group going through the same 10 weeks makes it harder to quietly skip.",
        "Know exactly what to do every session: The plan lays out all 10 weeks, so you just follow it.",
        "Eat in a way that supports your training: The nutrition guide and recipes keep it simple.",
        "Get Zack's coaching for less: Check-ins with Zack at a lower price than 1:1 coaching.",
      ],
      steps: [
        "Leave your details: Tell Zack your goal and he'll let you know when the next group opens.",
        "Join your group: Get your 10-week plan and nutrition guide when the group starts.",
        "Train and check in: Follow the plan and check in every two weeks by messaging.",
      ],
      included: [
        "10-week workout plan",
        "Nutrition guide with sample recipes",
        "Bi-weekly check-ins by messaging",
        "Groups of 5 to 20 people",
      ],
      outcomeAgain:
        "Ten weeks from now you could be stronger and leaner, with a group of people who watched you do it. Leave your details and Zack will let you know when the next group starts.",
      closeTitle: "Join the next group",
      cta: "Join the group",
    },
    landing: {
      headline: "Get fit in 10 weeks, with a group that keeps you going",
      subheadline: "A plan to follow, simple nutrition and people who expect you to show up, for less than 1:1 coaching. Leave your details to hear when the next group opens.",
      formTitle: "Join the next group",
      cta: "Join the group",
    },
  },
];

const joinLines = (page) =>
  Object.fromEntries(Object.entries(page).map(([k, v]) => [k, Array.isArray(v) ? v.join("\n") : v]));

const sql = neon(process.env.DATABASE_URL);
for (const [i, o] of offers.entries()) {
  const sales = JSON.stringify(joinLines(o.sales));
  const landing = JSON.stringify(o.landing);
  const added = await sql`
    insert into products (slug, title, kind, close, goal, access, price_cents, currency, price_note, status, summary, image,
      sales_page, landing_page, sort_order)
    values (${o.slug}, ${o.title}, 'coaching', 'contact', ${o.goal}, 'paid', null, 'CAD', ${o.price_note}, 'published',
      ${o.summary}, ${o.image}, ${sales}, ${landing}, ${i + 1})
    on conflict (slug) do nothing
    returning slug`;
  if (added.length) {
    console.log(`added    ${o.slug}`);
  } else if (update) {
    await sql`update products set sales_page = ${sales}, landing_page = ${landing}, updated_at = now() where slug = ${o.slug}`;
    console.log(`updated  ${o.slug} (page text)`);
  } else {
    console.log(`exists   ${o.slug} (left as is; use --update to rewrite its page text)`);
  }
}
