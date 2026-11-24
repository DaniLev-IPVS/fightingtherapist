import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { ContactBlock, Press, StatsBand } from "@/components/sections";
import { Button, Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Zack",
  description:
    "Zakaria “Zack” Benbouchta is a CAT(C) certified athletic therapist and fighter with 50+ amateur and pro fights, including Karate Combat.",
};

const chapters = [
  {
    eyebrow: "The fighter",
    title: "50+ fights. Karate Combat. TriStar Gym.",
    image: "/images/zack/fight-flags.jpg",
    alt: "Zack holding the Moroccan and Croatian flags in the arena",
    body: [
      "Zack has more than 50 amateur and pro fights, including bouts on Karate Combat. He has trained at TriStar Gym in Montreal, home of champions like Georges St-Pierre and Rory MacDonald, and sparred with arm-wrestling legend Devon Larratt.",
      "He has lived the fight camps, the weight cuts and the injuries. He knows what it takes to show up on fight night ready, and what it takes to keep training after.",
    ],
  },
  {
    eyebrow: "The therapist",
    title: "Certified athletic therapist, CAT(C).",
    image: "/images/zack/treating.jpg",
    alt: "Zack treating a client's ankle on a treatment table",
    body: [
      "For more than ten years Zack has treated and coached athletes, from weekend lifters to pro fighters. Over 100 clients have trusted him with chronic pain, post-surgery rehab, weight loss and fight preparation.",
      "His rehab work blends traditional athletic therapy with research-backed strategies and the demands of combat sports. Physical therapists and chiropractors are among his clients.",
    ],
  },
  {
    eyebrow: "The method",
    title: "Performance and durability, equally.",
    image: "/images/zack/coaching.jpg",
    alt: "Zack coaching a client through a kettlebell press",
    body: [
      "Most training builds strength and technique. Zack's approach also builds a body that holds up. Every plan gives equal weight to performance and health, driven by a clear understanding of how the body moves and what it needs.",
      "You'll understand why you're doing every exercise. The goal is to get you out of pain, keep you training and teach you how to manage your body for the long run.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Zack"
        title="He learned the science. Then he lived it."
        intro="Zakaria “Zack” Benbouchta is an athletic therapist who fights, and a fighter who fixes athletes."
        image="/images/hero/wraps.jpg"
        imageAlt="Zack wrapping his hands on a ring apron under a spotlight"
        imagePosition="75% 30%"
      />

      <section className="bg-off-white py-20 sm:py-28">
        <Container className="flex flex-col gap-20 sm:gap-28">
          {chapters.map((c, i) => (
            <div key={c.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-[6px] bg-charcoal ${i % 2 ? "lg:order-2" : ""}`}>
                <Image src={c.image} alt={c.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-5">
                <Eyebrow>{c.eyebrow}</Eyebrow>
                <h2 className="display text-[44px] text-charcoal sm:text-[56px]">{c.title}</h2>
                {c.body.map((p) => (
                  <p key={p.slice(0, 24)} className="max-w-[58ch] text-[18px] text-steel">{p}</p>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>

      <StatsBand />
      <Press />

      <section className="bg-paper py-20">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="display text-[40px] text-charcoal sm:text-[52px]">Ready to work with Zack?</h2>
          <Button href="/programs" size="lg">Find your program</Button>
        </Container>
      </section>

      <ContactBlock title="Questions first? Ask Zack." pageType="other" />
    </>
  );
}
