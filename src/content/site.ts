/**
 * Single source of truth for site-wide facts and copy.
 * Facts confirmed by Daniel on 23 Nov 2026. Change a number here and it
 * updates everywhere. Products move to the admin database in step 5.
 */

export const site = {
  name: "The Fighting Therapist",
  person: "Zakaria Benbouchta",
  short: "Zack",
  url: "https://fightingtherapist.com",
  // One number site-wide. Daniel is confirming which line stays.
  phone: "514-867-5954",
  phoneHref: "tel:+15148675954",
  email: "info@fightingtherapist.com",
  googleReviewsUrl:
    "https://search.google.com/local/reviews?placeid=ChIJI4VfupcXyUwR8lpsbUIJjyA",
  social: {
    instagram: "https://www.instagram.com/the.fighting.therapist/",
    tiktok: "https://www.tiktok.com/@thefighting.therapist",
    youtube: "https://www.youtube.com/c/DaTsiTzack",
    linkedin: "https://ca.linkedin.com/in/zackaria-benbouchta-martinovic-615698195",
  },
  description:
    "Fight-tested rehab, training and nutrition coaching from Zack Benbouchta, a CAT(C) athletic therapist and fighter with 50+ fights. Online, wherever you train.",
};

export const stats = [
  { value: "10+", label: "Years in practice" },
  { value: "100+", label: "Clients coached" },
  { value: "50+", label: "Amateur and pro fights" },
  { value: "5.0", label: "Rating from 69 Google reviews", star: true },
];

export const credentials = ["CAT(C) athletic therapist", "50+ fights", "10+ years", "5.0 from 69 reviews"];

export type ServiceKey = "rehab" | "training" | "nutrition" | "fight-camp";

/** The three hero cards. Each rotates through its photos. */
export const serviceCards: {
  key: ServiceKey;
  label: string;
  title: string;
  images: { src: string; alt: string }[];
}[] = [
  {
    key: "rehab",
    label: "Rehab",
    title: "Get out of pain for good",
    images: [
      { src: "/images/services/rehab-1.jpg", alt: "Zack assessing a client's ankle on a treatment table" },
      { src: "/images/services/rehab-2.jpg", alt: "Zack working on a client's hip" },
      { src: "/images/services/rehab-3.jpg", alt: "Zack testing a client's shoulder range of motion" },
    ],
  },
  {
    key: "training",
    label: "Training",
    title: "Build a body that holds up",
    images: [
      { src: "/images/services/train-1.jpg", alt: "Zack coaching a kettlebell floor press" },
      { src: "/images/services/train-2.jpg", alt: "Zack watching a client squat" },
      { src: "/images/services/train-3.jpg", alt: "Zack coaching a core exercise on turf" },
    ],
  },
  {
    key: "nutrition",
    label: "Nutrition",
    title: "Lose fat or make weight",
    images: [
      { src: "/images/services/nutrition-1.jpg", alt: "Zack portioning meal prep into containers" },
      { src: "/images/services/fight-1.jpg", alt: "Zack celebrating a win in the fight arena" },
    ],
  },
];

/** "What brings you here?" doors, in the visitor's words. */
export const goals: { key: ServiceKey; title: string; text: string }[] = [
  { key: "rehab", title: "I'm injured", text: "Back, knee, shoulder, or a surgery you're coming back from." },
  { key: "training", title: "I want to get strong", text: "A program built around your body, sport and schedule." },
  { key: "nutrition", title: "I want to lose fat", text: "Eat for results without giving up the foods you love." },
  { key: "fight-camp", title: "I have a fight", text: "Weight cut, rehydration and fight-week support." },
];

export type Offer = {
  key: ServiceKey | "group";
  name: string;
  tagline: string;
  forWho: string;
  includes: string[];
  terms: string;
  image: string;
  imageAlt: string;
};

/** Coaching offers kept in step 3 (all online). Copy from the current site, tightened. */
export const offers: Offer[] = [
  {
    key: "rehab",
    name: "Online Rehab Coaching",
    tagline: "Back to training without the pain.",
    forWho: "Athletes and active people dealing with back, neck, shoulder, knee, hip or post-surgery pain.",
    includes: [
      "Assessment of your injury and your sport",
      "Step-by-step rehab program, updated as you progress",
      "Check-ins by text and email",
      "Return-to-sport testing before you go back to full training",
    ],
    terms: "Monthly coaching. Apply to get your plan.",
    image: "/images/zack/treating.jpg",
    imageAlt: "Zack treating a client's ankle",
  },
  {
    key: "training",
    name: "1:1 Online Coaching",
    tagline: "A program built for your body, not a template.",
    forWho: "Anyone who wants to lose weight, build muscle or recompose, with a coach in their pocket.",
    includes: [
      "Personalized workout program",
      "Comprehensive nutrition guide",
      "Coaching by text and email",
      "Bi-weekly meetings for training and recipes",
      "Advanced tier: two 30-minute video calls a month",
    ],
    terms: "Monthly, 3-month minimum. 25% off your last month on a 6-month commitment.",
    image: "/images/zack/coaching.jpg",
    imageAlt: "Zack coaching a client through a kettlebell press",
  },
  {
    key: "nutrition",
    name: "Nutrition Coaching",
    tagline: "Eat for results and still enjoy dinner.",
    forWho: "People who want to lose fat, gain muscle or finally understand food, without crash diets.",
    includes: [
      "Nutrition plan built around how you already eat",
      "Recipes and meal structure",
      "Regular check-ins and adjustments",
      "Included in every coaching tier",
    ],
    terms: "Part of 1:1 coaching. Apply to get started.",
    image: "/images/services/nutrition-1.jpg",
    imageAlt: "Zack portioning meal prep",
  },
  {
    key: "fight-camp",
    name: "Fight Camp Weight Cut",
    tagline: "Make weight. Rehydrate. Perform.",
    forWho: "Amateur and pro fighters in camp who want to make weight without losing their performance.",
    includes: [
      "Weight management and cut strategy for your camp",
      "Personalized rehydration protocol after weigh-ins",
      "Meal prep guidance for hard training days",
      "One-on-one consults for program changes",
      "Fight-day support",
    ],
    terms: "Priced to your camp. Travel not included.",
    image: "/images/zack/fight-win.jpg",
    imageAlt: "Zack with his arms raised after a win",
  },
  {
    key: "group",
    name: "10-Week Group Program",
    tagline: "Train with a crew, coached by Zack.",
    forWho: "People who want structure and accountability at a lower price than 1:1 coaching.",
    includes: [
      "10-week workout plan",
      "Nutrition guide with sample recipes",
      "Bi-weekly check-ins by messaging",
      "Groups of 5 to 20 people",
    ],
    terms: "10 weeks. Next group opens when enough people join.",
    image: "/images/zack/coaching-floor.jpg",
    imageAlt: "Zack coaching a client on turf",
  },
];

export type Review = {
  name: string;
  headline: string;
  quote: string;
  tag: "Rehab" | "Training" | "Nutrition" | "Fight camp";
  featured?: boolean;
};

/**
 * Excerpts from Zack's public Google reviews (an ellipsis marks a cut, light typo fixes only). Names shortened to first name and
 * last initial; Daniel/Zack are confirming permission for the featured three.
 */
export const reviews: Review[] = [
  {
    name: "Andrew R.",
    headline: "Won a pro Muay Thai title",
    quote:
      "Zak developed a personalized nutrition plan and helped guide me through my weight cut and rehydration for my most recent fight camp. I really felt the difference in my training and preparation… I put my trust in Zak and we were very successful in optimizing my performance and securing a Pro Muay Thai title!",
    tag: "Fight camp",
    featured: true,
  },
  {
    name: "Arash S.",
    headline: "Back on the court after a torn ACL",
    quote:
      "I suffered a basketball injury resulting in a torn ACL, partially torn MCL, and bilateral meniscus tear… Zakaria's depth of knowledge when it comes to multi-ligament knee rehab protocols is truly remarkable… I'm now 11 months into this rehabilitation journey and back on the basketball court.",
    tag: "Rehab",
    featured: true,
  },
  {
    name: "Shawn K.",
    headline: "274 lb to 200 lb, and kept it off",
    quote:
      "I began with a starting weight of 274 lbs and suffered with migraines and body aches. Within 6 months I had lost 50 lbs. After a year and half I have not only reached my objective of 200 lbs, but it has maintained… I have not had a migraine since the weight came off!!",
    tag: "Nutrition",
    featured: true,
  },
  {
    name: "Mehdi C.",
    headline: "80% better in a few weeks",
    quote:
      "He works on both the physical and the mental aspect of the injury and makes sure that you understand why you're doing what you're doing. I'm 80% better after just a few weeks… If like me you've spent thousands of dollars on physio/chiro without any improvement, go see Zack.",
    tag: "Rehab",
  },
  {
    name: "Hanna E.",
    headline: "Back to grappling after shoulder surgery",
    quote:
      "Even sports physios don't always understand what it takes to safely return to grappling and wrestling… Zack knows what he's doing as he's a martial artist himself, so he understands the sport firsthand and knows how to progressively rebuild the strength and stability your joints need.",
    tag: "Rehab",
  },
  {
    name: "Michel G.",
    headline: "A chiropractor's worst back injury",
    quote:
      "As a chiropractor and fighting/fitness enthusiast, I can't express how valuable and essential Coach Zak's programming has been for me. In six months of working with him he has helped me overcome the worst low back injury I've ever had.",
    tag: "Rehab",
  },
  {
    name: "Sagar M.",
    headline: "25 lb down, wine included",
    quote:
      "I started training with him to fix hip issues from my hockey days, and in just a month, my pain was gone… With Zak's guidance, I've lost 25 pounds over the past eight months. His balanced approach lets me enjoy dinners and wine while staying on track.",
    tag: "Nutrition",
  },
  {
    name: "Mark H.",
    headline: "Stronger after a grade 3 ACL tear",
    quote:
      "Zack helped me recover from a grade 3 ACL tear and meniscus repair. Not only is my operated leg and full body stronger than ever, I learnt how to structure my training in a way that will reduce future injuries!",
    tag: "Rehab",
  },
  {
    name: "Sonia S.",
    headline: "175 lb to 155 lb in a few months",
    quote:
      "I started at 175 lbs, and now, just a few months later, I'm down to 155 lbs. The combination of strength training and a tailored nutrition plan has truly transformed my body.",
    tag: "Training",
  },
  {
    name: "TaeKyung M.",
    headline: "Praise from a physical therapist",
    quote:
      "He also listens to what your goals are and actually helps you to achieve them… I am also a physical therapist, and I only have the highest praise for Coach Zak.",
    tag: "Fight camp",
  },
  {
    name: "Samantha K.",
    headline: "Ten months of back and neck pain, finally improving",
    quote:
      "I had already tried everything else you could think of (osteopathy, chiropractic, massage, acupuncture etc) and nothing made a difference… I'm finally seeing a difference (actually started noticing small improvements within 2-3 weeks).",
    tag: "Rehab",
  },
  {
    name: "Bilal B.",
    headline: "Hit his goal in a 12-week program",
    quote:
      "I signed up for a 12 week summer program with The Fighting Therapist and I gotta say, it was a massive success. I reached my weight goal and gained so much strength.",
    tag: "Training",
  },
];

export const pressLogos = ["Karate Combat", "Global News", "The Fight Space", "TriStar Gym"];

export const press = [
  {
    outlet: "Karate Combat 39",
    title: "Full fight: Adam Ramos vs Zakaria Benbouchta",
    href: "https://www.youtube.com/watch?v=ULUoXEHd7E0",
    image: "/images/press/karate-combat-39.jpg",
    kind: "Watch the fight",
  },
  {
    outlet: "Global News",
    title: "Montreal fighter Zakaria Benbouchta on his career and his quest to fight for Canada",
    href: "https://globalnews.ca/video/3805307/",
    image: "/images/zack/fight-flags.jpg",
    kind: "Watch the segment",
  },
  {
    outlet: "The Fight Space podcast",
    title: "Karate Combat heavyweight and TriStar Gym veteran on weight cutting and fight camps",
    href: "https://open.spotify.com/episode/7r7RgqFf6j03t2F8r9kXds",
    image: "/images/zack/fight-arena.jpg",
    kind: "Listen",
  },
  {
    outlet: "Matt Rhodes Sport",
    title: "Sparring footage with arm-wrestling champion Devon Larratt",
    href: "https://www.youtube.com/watch?v=pirm-Y14Mpk",
    image: "/images/press/devon-larratt.jpg",
    kind: "Watch",
  },
];

export const nav = [
  { href: "/programs", label: "Programs" },
  { href: "/results", label: "Results" },
  { href: "/about", label: "About Zack" },
  { href: "/contact", label: "Contact" },
];
