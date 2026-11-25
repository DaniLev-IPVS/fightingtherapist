import type { Metadata } from "next";
import { googleRating, site, wallReviews } from "@/content/site";
import { PageHero } from "@/components/page-hero";
import { StatsRow, TalkCta } from "@/components/sections";
import { ReviewWall } from "@/components/review-wall";
import { Container, Stars } from "@/components/ui";

export const metadata: Metadata = {
  title: "Results",
  description: "Rehab comebacks, weight cuts, titles and transformations. 69 Google reviews, all 5 stars.",
};

export default function ResultsPage() {
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

      <section className="overflow-x-clip bg-off-white py-16 sm:py-24">
        <Container>
          {/* The hero above already shows the rating, so the wall starts at the filters. */}
          <ReviewWall reviews={wallReviews} score={googleRating.score} count={googleRating.count} googleUrl={site.googleReviewsUrl} rating={false} />
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
