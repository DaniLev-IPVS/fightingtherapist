import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { offers } from "@/content/site";
import { PageHero } from "@/components/page-hero";
import { OfferBlock } from "@/components/programs";
import { TalkCta } from "@/components/sections";
import { Arrow, Container } from "@/components/ui";
import { formatPrice, kindLabel, listPublishedProducts, salesPath } from "@/lib/products";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Online rehab coaching, 1:1 training, nutrition coaching, fight camp weight cuts and a 10-week group program with Zack Benbouchta.",
};

export default async function ProgramsPage() {
  const products = await listPublishedProducts();
  const coachingByGoal = new Map(products.filter((p) => p.kind === "coaching").map((p) => [p.goal as string, p]));
  const guides = products.filter((p) => p.kind !== "coaching");
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
            <OfferBlock key={o.key} offer={o} index={i} href={coachingByGoal.has(o.key) ? salesPath(coachingByGoal.get(o.key)!.slug) : undefined} />
          ))}
        </Container>
      </section>

      {guides.length > 0 ? (
        <section id="guides" className="bg-paper py-20 sm:py-24">
          <Container className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <p className="eyebrow text-blue">Guides and lessons</p>
              <h2 className="display text-[44px] leading-[0.92] text-charcoal sm:text-[60px]">Start today, on your own.</h2>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((g) => (
                <li key={g.id}>
                  <Link href={salesPath(g.slug)} className="group flex h-full flex-col overflow-hidden rounded-[6px] border border-line bg-off-white transition-colors hover:border-blue">
                    <span className="relative aspect-[4/3] bg-charcoal">
                      <Image
                        src={g.image || "/images/zack/coaching.jpg"}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        unoptimized={!!g.image?.startsWith("http")}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="flex flex-1 flex-col gap-2 p-5">
                      <span className="eyebrow text-[11px] text-blue">{kindLabel(g.kind)} · {formatPrice(g)}</span>
                      <span className="display text-[28px] leading-[0.95] text-charcoal">{g.title}</span>
                      {g.summary && <span className="text-[15px] text-steel">{g.summary}</span>}
                      <span className="mt-auto inline-flex items-center gap-2 pt-2 font-mono text-[12px] uppercase tracking-[0.12em] text-blue">
                        See what&apos;s inside <Arrow />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : (
        <section className="bg-paper py-16">
          <Container className="flex flex-col gap-3 rounded-[6px] border border-dashed border-line p-8 text-center">
            <p className="eyebrow text-blue">Coming soon</p>
            <p className="display text-[36px] text-charcoal">Guides and video lessons</p>
            <p className="mx-auto max-w-[52ch] text-[17px] text-steel">
              Zack&apos;s rehab and training guides you can buy and start today, no coaching commitment needed.
            </p>
          </Container>
        </section>
      )}

      <TalkCta />
    </>
  );
}
