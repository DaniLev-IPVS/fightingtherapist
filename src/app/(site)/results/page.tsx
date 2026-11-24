import type { Metadata } from "next";
import { reviews, site } from "@/content/site";
import { PageHero } from "@/components/page-hero";
import { ReviewCard, StatsRow, TalkCta, imageForReview } from "@/components/sections";
import { Button, Container, Stars } from "@/components/ui";

export const metadata: Metadata = {
  title: "Results",
  description: "Rehab comebacks, weight cuts, titles and transformations. 69 Google reviews, all 5 stars.",
};

export default function ResultsPage() {
  const featured = reviews.filter((r) => r.featured);
  const rest = reviews.filter((r) => !r.featured);
  return (
    <>
      <PageHero
        eyebrow="Results"
        title="Real clients. Real comebacks."
        intro="Titles won, surgeries recovered from, pounds lost and kept off. In their own words, from Zack's Google reviews."
        image="/images/zack/fight-win.jpg"
        imageAlt="Zack celebrating a win with his arms raised"
        imagePosition="60% 30%"
      >
        <a
          href={site.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-4 self-start rounded-[6px] border border-white/20 bg-ink/60 px-5 py-4 backdrop-blur transition-colors hover:border-blue"
        >
          <span className="display text-[44px] leading-none">5.0</span>
          <span className="flex flex-col gap-1">
            <Stars className="text-[16px]" />
            <span className="text-[14px] text-mist">69 Google reviews · read them on Google</span>
          </span>
        </a>
      </PageHero>

      <section className="bg-off-white py-20 sm:py-28">
        <Container className="flex flex-col gap-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {featured.map((r) => (
              <ReviewCard key={r.name} review={r} image={imageForReview(r, 0)} />
            ))}
          </div>
          <div className="columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
            {rest.map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </div>
          <div className="flex justify-center pt-6">
            <Button href={site.googleReviewsUrl} variant="ghost-dark">Read all 69 reviews on Google</Button>
          </div>
        </Container>
      </section>

      <section aria-label="Zack in numbers" className="bg-charcoal py-12">
        <Container>
          <StatsRow dark />
        </Container>
      </section>
      <TalkCta title="Want results like these?" />
    </>
  );
}
