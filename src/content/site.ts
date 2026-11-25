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
      { src: "/images/programs/rehab.jpg", alt: "A therapist taping an athlete's shoulder" },
      { src: "/images/services/rehab-1.jpg", alt: "Zack assessing a client's ankle" },
      { src: "/images/services/rehab-3.jpg", alt: "Zack testing a client's shoulder range of motion" },
    ],
  },
  {
    key: "training",
    label: "Training",
    title: "Build a body that holds up",
    images: [
      { src: "/images/programs/training.jpg", alt: "A woman pushing a heavy sled across gym turf" },
      { src: "/images/services/train-1.jpg", alt: "Zack coaching a kettlebell floor press" },
      { src: "/images/services/train-2.jpg", alt: "Zack watching a client squat" },
    ],
  },
  {
    key: "nutrition",
    label: "Nutrition",
    title: "Lose fat or make weight",
    images: [
      { src: "/images/programs/nutrition.jpg", alt: "Meal prep containers, a food scale and a meal plan" },
      { src: "/images/services/nutrition-1.jpg", alt: "Zack portioning meal prep" },
    ],
  },
];

/**
 * Homepage hero, one entry per slide: Zack first, then rehab, training and
 * nutrition (same order as serviceCards). Headline = what the visitor gets;
 * subheadline = why they aren't there yet and what changes.
 */
export const heroCopy = [
  {
    headline: "Fight-tested coaching.",
    sub: "Get out of pain, get strong, get lean. A plan built around your body and your goal, coached by an athletic therapist who has been in the fight.",
    cta: { label: "Find your program", href: "/programs" },
  },
  {
    headline: "Get back to the sport you love.",
    sub: "Most injuries come back because the pain gets treated and the strength around it never gets rebuilt. Your plan fixes both, so you go back stronger than before.",
    cta: { label: "See the rehab program", href: "/programs/rehab" },
  },
  {
    headline: "Build the body you want.",
    sub: "Most people stall because their program wasn't built for their body. Yours is, and your lifts get checked every week so you keep progressing.",
    cta: { label: "See 1:1 coaching", href: "/programs/training" },
  },
  {
    headline: "Feel good in your body again.",
    sub: "No meal plan you'll quit in two weeks. Food you like, portions that fit your goal, and weekly check-ins that keep the weight off.",
    cta: { label: "See nutrition coaching", href: "/programs/nutrition" },
  },
];

/** "What brings you here?" panels: the visitor's problem, then the outcome they want. */
export const goals: { key: ServiceKey; title: string; outcome: string; text: string; image: string; imageAlt: string }[] = [
  {
    key: "rehab",
    title: "I'm injured",
    outcome: "Train without pain again.",
    text: "Back, knee, shoulder or post-surgery. A step-by-step plan that gets you moving and keeps the injury from coming back.",
    image: "/images/goals/injured.jpg",
    imageAlt: "A woman sprinting on an indoor track with tape on her knee",
  },
  {
    key: "training",
    title: "I want to get strong",
    outcome: "Lift more. Move better.",
    text: "A program built around your body, your sport and your schedule, adjusted every week as you progress.",
    image: "/images/goals/strong.jpg",
    imageAlt: "A man finishing a heavy deadlift in a dark gym",
  },
  {
    key: "nutrition",
    title: "I want to lose fat",
    outcome: "Lose it and keep it off.",
    text: "Eat for results without giving up dinners out. Clients have lost anywhere from 20 to 74 lb.",
    image: "/images/goals/fat.jpg",
    imageAlt: "A lean man smiling after a morning run by the water",
  },
  {
    key: "fight-camp",
    title: "I have a fight",
    outcome: "Make weight. Fight strong.",
    text: "Weight cut, rehydration and fight-week support from a coach with 50+ fights behind him.",
    image: "/images/goals/fight.jpg",
    imageAlt: "A fighter with wrapped hands walking out through an arena tunnel",
  },
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
  /** Short dream-outcome line for program cards. */
  outcome: string;
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
    image: "/images/programs/rehab.jpg",
    imageAlt: "A therapist taping an athlete's shoulder",
    outcome: "Pain-free and back in the gym",
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
    image: "/images/programs/training.jpg",
    imageAlt: "A woman pushing a heavy sled across gym turf",
    outcome: "Stronger every single month",
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
    image: "/images/programs/nutrition.jpg",
    imageAlt: "Meal prep containers, a food scale and a meal plan",
    outcome: "Leaner without crash diets",
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
    image: "/images/programs/fight.jpg",
    imageAlt: "A fighter pulling on boxing gloves next to a scale",
    outcome: "On weight and at full power",
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
    image: "/images/programs/group.jpg",
    imageAlt: "A small group doing battle ropes and kettlebells together",
    outcome: "Results with a crew behind you",
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

/** Google rating shown beside the reviews. */
export const googleRating = { score: "5.0", count: "69" };

/** A review on the homepage wall. Short ones have no headline; ones that don't say what the client came for have no tag. */
export type WallReview = Omit<Review, "headline" | "tag"> & { headline?: string; tag?: Review["tag"] };

/**
 * More excerpts from the same public Google reviews, read on 24 Nov 2026, for the
 * homepage wall. Same rules as above: verbatim, an ellipsis marks a cut, light
 * typo fixes only, first name and last initial. Headlines are our words and only
 * say what the review itself says.
 */
export const moreReviews: WallReview[] = [
  {
    name: "Steven V.",
    headline: "Just under 30 lb of fat gone in 12 weeks",
    quote:
      "After 12 weeks I can say I have lost just under 30 pounds of fat while maintaining/gaining lean mass, I am stronger than I have been in years and have no pain from any of my injuries.",
    tag: "Training",
  },
  {
    name: "Emerick S.",
    headline: "Two years of lower back pain, gone",
    quote: "Had lower back pain for almost 2 years, and now it's gone! Clear, simple, easy exercises, and very well explained.",
    tag: "Rehab",
  },
  {
    name: "Jabez A.",
    headline: "16 lb down in a little over a week",
    quote:
      "10/10 told me everything I needed to do and eat in order to drop 16lbs in a little over a week and I felt great after. He also walked me through what I needed to do to rehydrate and fight the next day",
    tag: "Fight camp",
  },
  { name: "Ian P.", quote: "Best in the city" },
  {
    name: "Daniel I.",
    headline: "Bulged disc, back to normal in 12 weeks",
    quote: "I came in with a bulged disc in my back that lingered for almost a year. With his program, I was back to normal within 12 weeks.",
    tag: "Rehab",
  },
  {
    name: "Sheena C.",
    headline: "Strong enough to climb Kilimanjaro",
    quote:
      "I was able to put on a substantial amount of muscle mass which translated into increased strength and mobility… I have been able to get back to my passion of hiking and have, in fact, just accomplished my first high altitude climb of Mount Kilimanjaro.",
    tag: "Training",
  },
  {
    name: "Pa A.",
    headline: "Three herniated discs, running again",
    quote:
      "I have three herniated discs in my back and for the longest time I dreaded having to pick anything off the ground. Today, I'm back to running, lifting and living a virtually pain free life!",
    tag: "Rehab",
  },
  {
    name: "Drew A.",
    headline: "Best fight camp to date",
    quote: "He helped me put together the best fight performance, weight cut, and diet of my fight camps to date. I will 100% be back for his expertise.",
    tag: "Fight camp",
  },
  {
    name: "Devon L.",
    quote: "Most talented fighter I know. Anyone ever wanting to take there fight game to the next level - this is your guy!!!",
    tag: "Fight camp",
  },
  {
    name: "Kathlene L.",
    headline: "Partially torn ACL, never felt stronger",
    quote:
      "When I came to Zack I was on the verge of giving in to having surgery for a partially torn ACL… Since working with Zack I have never felt stronger; not just my knee, but my body as a whole.",
    tag: "Rehab",
  },
  {
    name: "Eugénie C.",
    headline: "Pain free today",
    quote:
      "Not only did I heal my back, but I also learned how to understand my pain, how to work through it and not letting it dictate my life… Today, I am pain free.",
    tag: "Rehab",
  },
  {
    name: "Dylan N.",
    headline: "A healthy lifestyle without unrealistic sacrifices",
    quote: "Working one on one to curate an optimal nutrition plan, coach Zak has helped me achieve a healthy lifestyle without making unrealistic sacrifices.",
    tag: "Nutrition",
  },
  {
    name: "George A.",
    headline: "From shooting leg pain to back in training",
    quote:
      "I couldn't sit down for too long because when I would stand up I'd get a pain that shot down my leg. Zach helped me recover and got me back to training quickly and safely.",
    tag: "Rehab",
  },
  { name: "Mike L.", quote: "Incredible knowledge, pragmatic advice, and always available for answers!" },
  {
    name: "James V.",
    headline: "Full shoulder mobility back, years after the injury",
    quote: "I have regained full control and mobility of my right shoulder which was previously injured in wrestling back in 2012 (sub-luxation of the right rotator cuff).",
    tag: "Rehab",
  },
  {
    name: "Jonathan P.",
    headline: "Stronger and faster on the mats",
    quote: "I am stronger and faster and have seen direct results within my jiu Jitsu and striking because of his MMA specific workouts.",
    tag: "Training",
  },
  {
    name: "Nathaniel K.",
    headline: "Stronger than before the injury",
    quote: "He helped rehab my leg as I had pain while doing BJJ, and actually made me stronger than I was before my injury!",
    tag: "Rehab",
  },
  {
    name: "Trevor N.",
    headline: "A youth athlete's weight cut, handled",
    quote:
      "He was the only one willing to work with a youth athlete in a weight management situation… Even after a large weight cut, he felt energized and ready to go!",
    tag: "Fight camp",
  },
  {
    name: "Manpreet K.",
    headline: "A lifelong knee issue, sorted",
    quote:
      "I started training with Zak six weeks postpartum after giving birth to my beautiful daughter… I've had a lifelong issue with my knee, and thanks to his expertise, it's now cured.",
    tag: "Rehab",
  },
  {
    name: "Aiemann Z.",
    quote: "My favourite thing about Zak is how he checks in on me after a session to see how I'm recovering. Amazing service!",
  },
  {
    name: "Sarah K.",
    headline: "A neck that feels stable and strong",
    quote:
      "Recently I've received the comment (from a new, much better chiro/kine therapist) that my neck feels really stable and strong and that it's night and day compared to before.",
    tag: "Rehab",
  },
  {
    name: "Teri B.",
    headline: "PRs that were out of reach before",
    quote: "I have been able to hit many PRs that I hadn't been able to in the past. Moreover, his programs are always tailored to your goals.",
    tag: "Training",
  },
  {
    name: "Rachael D.",
    headline: "Caught up after ACL surgery",
    quote:
      "I signed up at about 6 months post op feeling weak and behind in my recovery… He pushed me to try things I wasn't sure I was ready for but because of his knowledge and passion he was able to get me to where I needed to be.",
    tag: "Rehab",
  },
  {
    name: "Ramston R.",
    quote: "Zak was super helpful with the entire weight cutting process! I think his knowledge about weight cutting and nutrition is world class.",
    tag: "Fight camp",
  },
  {
    name: "Sandra S.",
    headline: "From avoiding weights to enjoying them",
    quote: "Thanks to Zakaria, I now enjoy strength training (which I've always avoided to prioritize cardio). My strength has increased tremendously during the past months.",
    tag: "Training",
  },
  {
    name: "Thomas C.",
    headline: "A smooth recovery from elbow surgery",
    quote:
      "Zak has been extremely helpful in my elbow surgery recovery… I have no doubt his programming is the reason my recovery has gone smoothly and I'd highly recommend him to any athlete.",
    tag: "Rehab",
  },
  { name: "Peter C.", quote: "Absolutely one of the best I've worked with and will continue too!" },
  {
    name: "Cynthia S.",
    headline: "Two knee surgeries, then someone who listened",
    quote: "…after 2 knee surgeries, Zak was the first one to listen to me and take his time to slowly evaluate why I was having pain in the first place.",
    tag: "Rehab",
  },
  {
    name: "Michelle P.",
    quote: "I've been consistently going to the gym since June 2023 and I can confidently say that I look and feel amazing.",
    tag: "Training",
  },
  {
    name: "Sidney S.",
    headline: "Multiple injuries rehabbed in a short time",
    quote:
      "Not only has he helped me rehab multiple injuries in a very short time but he has equipped me with the knowledge and foundation for a lifetime of strength training.",
    tag: "Rehab",
  },
  {
    name: "Anthony M.",
    headline: "Performance, nutrition and recovery, all improved",
    quote:
      "As an experienced fighter and long time athlete, Zack helped me improve every aspect of my game from performance, to nutrition, to recovery. Best part, no broscience, all his programs are supported by sports science literature!",
    tag: "Training",
  },
  {
    name: "Jon S.",
    headline: "Back to training after shoulder surgery",
    quote: "I definitely made the right choice in having The Fighting Therapist help get me back to training after having shoulder labrum and bicep tendon surgery.",
    tag: "Rehab",
  },
  {
    name: "Benjamin R.",
    quote: "I tried many different physio over the years and this is without a doubt the best one I highly recommend",
    tag: "Rehab",
  },
  {
    name: "Simon M.",
    headline: "Back in the gym right away",
    quote:
      "I went to see him with a shoulder injury and he was quick to figure out what it was. He gave me some small changes to make to my training program and had me back in the gym and on my way to my regular routine right away.",
    tag: "Rehab",
  },
  {
    name: "Nazeer K.",
    headline: "Better in and out of the gym",
    quote:
      "I see physical progress, but more so, the changes made to my mental health has been paramount… I can truly say my quality of life wouldn't be as good without his support both in and out of the gym.",
    tag: "Training",
  },
  {
    name: "Olivia S.",
    quote:
      "I pulled my quad playing soccer and Zac helped me so much to rehabilitate it. He was very thorough and knowledgeable and gave me a series of exercises to help me get my strength back.",
    tag: "Rehab",
  },
  {
    name: "Eliane L.",
    headline: "Changes that training alone never gave",
    quote: "Also been seeing changes on my body that I couldn't see before no matter how much I trained.",
    tag: "Training",
  },
  {
    name: "Russel N.",
    headline: "Healed a knee and got stronger",
    quote: "Through Zach's workout program, I was able to heal a knee injury while still being able to gain overall strength and power.",
    tag: "Rehab",
  },
  { name: "Boyana S.", quote: "From the very first session, I felt welcomed, understood and genuinely cared for." },
  {
    name: "Alyssa V.",
    headline: "A few injuries, all resolved",
    quote: "I went to him for a few injuries and all resolved within no time. He takes the time to properly teach you what is needed for you to recover quickly.",
    tag: "Rehab",
  },
  {
    name: "Jose S.",
    headline: "Training less, performing better",
    quote:
      "I used to think the more the better, used to demolish my body in the S&C sesh, kept me tired during the busy days and left me without energy for my sport… I'm able to perform better at my sport…",
    tag: "Training",
  },
  {
    name: "Jason G.",
    quote: "Pretty good, he help me from can't use my shoulders to better than before my injury.",
    tag: "Rehab",
  },
  {
    name: "Charbel A.",
    headline: "Back to full-time training after a bad injury",
    quote: "Zach helped me get back to full time training after a bad injury. The recovery was perfectly planned in a easy to follow method…",
    tag: "Rehab",
  },
  {
    name: "Suzanna S.",
    headline: "A specialist who understands high-level athletes",
    quote:
      "As a high-level athlete, I struggled to find a knowledgeable specialist who truly understood my challenges… You can tell he genuinely cares about your progress and is fully invested.",
    tag: "Rehab",
  },
  {
    name: "Adam E.",
    quote: "From his social media posts to the workouts he set up for me he's what I thought I'd be getting and more!",
    tag: "Training",
  },
  {
    name: "Francis G.",
    quote: "I have a knee injury that happened during BJJ, and the structure given truly helps.",
    tag: "Rehab",
  },
  {
    name: "Teresa O.",
    quote: "Each step along the way things were explained to me in a meaningful way. My goals were prioritized and the program worked for me!!",
    tag: "Training",
  },
  {
    name: "James C.",
    headline: "Training again after wrist surgery",
    quote: "…when I had 1/2 surgeries done on my wrist I thought I would never be able to return and train properly again, but I love the progress I've had so far.",
    tag: "Rehab",
  },
  {
    name: "Arshia",
    quote: "He took the time to understand my specific needs and provided a personalized workout plan that has already shown great results.",
    tag: "Rehab",
  },
  {
    name: "Jason D.",
    quote: "Zack has helped me understand how to take care and improve my body in areas of mobility, muscle building, and nutrition.",
    tag: "Training",
  },
  {
    name: "Daniel L.",
    quote: "He's guided me through both weight loss and a knee injury, and I can't thank him enough for his support.",
    tag: "Training",
  },
  { name: "Clem V.", quote: "Great service" },
];

/** Every review with text, for the homepage wall: the twelve with full write-ups first. */
export const wallReviews: WallReview[] = [...reviews, ...moreReviews];

export const pressLogos =["Karate Combat", "Global News", "The Fight Space", "TriStar Gym"];

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

/** Recent Instagram reels (thumbnails saved from the old site's feed). */
export const reels = [
  { href: "https://www.instagram.com/reel/De7Ft7CiN-K/", image: "/images/reels/reel-1.jpg", title: "Your $150 pillow isn't fixing your neck pain" },
  { href: "https://www.instagram.com/reel/DeQGM99E3lt/", image: "/images/reels/reel-2.jpg", title: "What an ankle dislocation really means" },
  { href: "https://www.instagram.com/reel/DdUNK6lp3j3/", image: "/images/reels/reel-5.jpg", title: "Two types of pain every fighter should know" },
  { href: "https://www.instagram.com/reel/Dc3gmBbptYF/", image: "/images/reels/reel-9.jpg", title: "Why resting your back injury backfires" },
  { href: "https://www.instagram.com/reel/DdW6PSRpxcY/", image: "/images/reels/reel-4.jpg", title: "The overhand right that finished Benn" },
  { href: "https://www.instagram.com/reel/Dc_TZxLJfho/", image: "/images/reels/reel-7.jpg", title: "Back pain: mistakes #1 and #2" },
  { href: "https://www.instagram.com/reel/DdB_InwpRiC/", image: "/images/reels/reel-6.jpg", title: "The biggest lie you were told about tilts" },
  { href: "https://www.instagram.com/reel/Dc6TTiJpraA/", image: "/images/reels/reel-8.jpg", title: "The phrase I never want patients to hear" },
];

export const instagram = { handle: "@the.fighting.therapist", followers: "2.6K", posts: "490" };


type Photo = { src: string; alt: string };

/**
 * Photos for offer sales and landing pages, by goal (made for these pages, not
 * reused from the homepage). pain: the real problem, next to "Sound familiar?".
 * win: the result, next to the benefits list. again: behind the restated dream
 * outcome. The hero photo is set per product in the dashboard.
 */
export const offerImages: Record<string, { pain: Photo; win: Photo; again: Photo }> = {
  rehab: {
    pain: { src: "/images/offers/rehab/pain.jpg", alt: "A man grimacing and clutching his lower back as a deadlift goes wrong" },
    win: { src: "/images/offers/rehab/win.jpg", alt: "A woman in a knee sleeve driving to the basket, back playing basketball" },
    again: { src: "/images/offers/rehab/again.jpg", alt: "Two men grappling hard on the mats" },
  },
  training: {
    pain: { src: "/images/offers/training/pain.jpg", alt: "A frustrated man on a gym bench staring at a workout app" },
    win: { src: "/images/offers/training/win.jpg", alt: "A man finishing a weighted pull-up" },
    again: { src: "/images/offers/training/again.jpg", alt: "A man driving a heavy sled across gym turf" },
  },
  nutrition: {
    pain: { src: "/images/offers/nutrition/pain.jpg", alt: "A discouraged man standing on a bathroom scale at night" },
    win: { src: "/images/offers/nutrition/win.jpg", alt: "A woman laughing at dinner with friends, a glass of wine in hand" },
    again: { src: "/images/offers/nutrition/again.jpg", alt: "A lean man running up outdoor stairs at sunrise" },
  },
  "fight-camp": {
    pain: { src: "/images/offers/fight-camp/pain.jpg", alt: "A drained fighter in a sauna suit slumped against a wall during a weight cut" },
    win: { src: "/images/offers/fight-camp/win.jpg", alt: "A fighter throwing a hard right hand in the cage" },
    again: { src: "/images/offers/fight-camp/again.jpg", alt: "A fighter roaring as the referee raises his hand" },
  },
  group: {
    pain: { src: "/images/offers/group/pain.jpg", alt: "A bored woman alone on a treadmill in an empty gym at night" },
    win: { src: "/images/offers/group/win.jpg", alt: "Three people high-fiving after a hard group workout" },
    again: { src: "/images/offers/group/again.jpg", alt: "A group lying on gym turf, exhausted and laughing after a workout" },
  },
  other: {
    pain: { src: "/images/offers/rehab/pain.jpg", alt: "A man grimacing and clutching his lower back as a deadlift goes wrong" },
    win: { src: "/images/offers/training/win.jpg", alt: "A man finishing a weighted pull-up" },
    again: { src: "/images/offers/training/again.jpg", alt: "A man driving a heavy sled across gym turf" },
  },
};

/** Which review tag each offer goal shows first. */
export const reviewTagForGoal: Record<string, Review["tag"]> = {
  rehab: "Rehab",
  training: "Training",
  nutrition: "Nutrition",
  "fight-camp": "Fight camp",
  group: "Training",
};

/** Reviews for an offer page: matching ones first, topped up with featured reviews. */
export function reviewsForGoal(goal: string, count = 6) {
  const tag = reviewTagForGoal[goal];
  const matching = reviews.filter((r) => r.tag === tag);
  const rest = reviews.filter((r) => r.tag !== tag).sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return [...matching, ...rest].slice(0, count);
}

/**
 * Client results shown at the top of offer pages, taken from the Google reviews
 * above (numbers only as the reviewer stated them). `photos` takes real
 * before/after pictures once a client has given permission; never use made-up ones.
 */
export type ClientResult = {
  name: string;
  stat: string;
  /** Short line in our words, for the stat chip. */
  line: string;
  /** Verbatim excerpt from the client's Google review (an ellipsis marks a cut). */
  quote: string;
  photos?: { before: string; after: string };
};

export const resultsByGoal: Record<string, ClientResult[]> = {
  nutrition: [
    { name: "Shawn K.", stat: "−74 lb", line: "274 lb down to 200 lb", quote: "…I have not only reached my objective of 200 lbs, but it has maintained…" },
    { name: "Sagar M.", stat: "−25 lb", line: "Over eight months", quote: "With Zak's guidance, I've lost 25 pounds over the past eight months." },
    { name: "Sonia S.", stat: "−20 lb", line: "In a few months", quote: "I started at 175 lbs, and now, just a few months later, I'm down to 155 lbs." },
  ],
  training: [
    { name: "Sonia S.", stat: "−20 lb", line: "In a few months", quote: "I started at 175 lbs, and now, just a few months later, I'm down to 155 lbs." },
    { name: "Bilal B.", stat: "12 weeks", line: "Weight goal reached", quote: "I reached my weight goal and gained so much strength." },
    { name: "Shawn K.", stat: "−74 lb", line: "274 lb down to 200 lb", quote: "…I have not only reached my objective of 200 lbs, but it has maintained…" },
  ],
  rehab: [
    { name: "Arash S.", stat: "Torn ACL", line: "Back on the court", quote: "I'm now 11 months into this rehabilitation journey and back on the basketball court." },
    { name: "Mehdi C.", stat: "80% better", line: "In a few weeks", quote: "I'm 80% better after just a few weeks…" },
    { name: "Michel G.", stat: "6 months", line: "Worst back injury, beaten", quote: "In six months of working with him he has helped me overcome the worst low back injury I've ever had." },
  ],
  "fight-camp": [
    { name: "Andrew R.", stat: "Pro title", line: "Weight cut and rehydration", quote: "…we were very successful in optimizing my performance and securing a Pro Muay Thai title!" },
    { name: "Hanna E.", stat: "Back on the mats", line: "After shoulder surgery", quote: "Zack knows what he's doing as he's a martial artist himself…" },
  ],
  group: [
    { name: "Bilal B.", stat: "12 weeks", line: "Weight goal reached", quote: "I reached my weight goal and gained so much strength." },
    { name: "Sonia S.", stat: "−20 lb", line: "In a few months", quote: "I started at 175 lbs, and now, just a few months later, I'm down to 155 lbs." },
  ],
};

/** The review quoted large on each offer page. */
export const quoteForGoal: Record<string, string> = {
  rehab: "Arash S.",
  nutrition: "Shawn K.",
  "fight-camp": "Andrew R.",
  training: "Sonia S.",
  group: "Bilal B.",
};
