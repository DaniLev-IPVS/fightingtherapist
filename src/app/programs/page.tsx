import type { Metadata } from "next";
import Link from "next/link";
import { offers } from "@/content/site";
import { PageHero } from "@/components/page-hero";
import { OfferBlock } from "@/components/programs";
import { TalkCta } from "@/components/sections";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Online rehab coaching, 1:1 training, nutrition coaching, fight camp weight cuts and a 10-week group program with Zack Benbouchta.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Find your program."
        intro="Every program is coached online by Zack, so you can work with him from anywhere. Pick the one that matches your goal."
        image="/images/zack/coaching-wide.jpg"
        imageAlt="Zack coaching a client through a kettlebell press"
        imagePosition="60% 40%"
      >
        <nav aria-label="Programs on this page" className="mt-2 flex flex-wrap gap-2">
          {offers.map((o) => (
            <Link
              key={o.key}
              href={`#${o.key}`}
              className="rounded-full border border-white/25 px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.1em] text-mist transition-colors hover:border-blue hover:text-white"
            >
              {o.name}
            </Link>
          ))}
        </nav>
      </PageHero>

      <section className="bg-off-white">
        <Container>
          {offers.map((o, i) => (
            <OfferBlock key={o.key} offer={o} index={i} />
          ))}
        </Container>
      </section>

      <section className="bg-paper py-16">
        <Container className="flex flex-col gap-3 rounded-[6px] border border-dashed border-line p-8 text-center">
          <p className="eyebrow text-blue">Coming soon</p>
          <p className="display text-[36px] text-charcoal">Guides and video lessons</p>
          <p className="mx-auto max-w-[52ch] text-[17px] text-steel">
            Zack&apos;s rehab and training guides you can buy and start today, no coaching commitment needed.
          </p>
        </Container>
      </section>

      <TalkCta />
    </>
  );
}
