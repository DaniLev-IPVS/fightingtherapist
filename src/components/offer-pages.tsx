import Image from "next/image";
import type { ReactNode } from "react";
import { offerImages, quoteForGoal, resultsByGoal, reviews as allReviews, reviewsForGoal, site, type ClientResult } from "@/content/site";
import { formatPrice, lines, type PublicProduct } from "@/lib/product-options";
import type { GoalValue } from "@/lib/leads";
import { LeadForm } from "@/components/lead-form";
import { Scroller } from "@/components/scroller";
import { ProofBar, ReviewCard, StatsRow } from "@/components/sections";
import { Arrow, Button, Container, Eyebrow, Stars, cn } from "@/components/ui";

/*
 * Shared pieces for /programs/[slug] (sales page) and /go/[slug] (landing page).
 * Headings here are plain and specific. No slogan lines: proof is shown, not announced.
 */

const photos = (p: PublicProduct) => offerImages[p.goal] ?? offerImages.other;
const heroImage = (p: PublicProduct) => p.image || photos(p).win.src;

/** "Short bold line: one sentence" per line. */
function parsePairs(text?: string) {
  return lines(text).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? { title: l.slice(0, i).trim(), text: l.slice(i + 1).trim() } : { title: l, text: "" };
  });
}
type Pair = ReturnType<typeof parsePairs>[number];

/** "The usual way | with Zack" per line. */
function parseCompare(text?: string) {
  return lines(text)
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter((x) => x.length === 2 && x[0] && x[1]) as [string, string][];
}

/** next/image only optimizes local files; dashboard https links load as-is. */
function Photo({ src, alt, className, sizes, preload }: { src: string; alt: string; className?: string; sizes: string; preload?: boolean }) {
  return <Image src={src} alt={alt} fill sizes={sizes} preload={preload} unoptimized={src.startsWith("http")} className={className} />;
}

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("h-4 w-4 shrink-0", className)} fill="none" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("h-4 w-4 shrink-0", className)} fill="none" aria-hidden="true">
      <path d="M5.5 5.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function CheckBadge() {
  return (
    <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue text-white">
      <Check className="h-5 w-5" />
    </span>
  );
}

/** Small proof line: credentials as support, never the headline. */
export function ProofLine({ className }: { className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-mist", className)}>
      <Stars className="text-[14px]" />
      <span>5.0 from 69 Google reviews</span>
      <span aria-hidden="true" className="text-steel-light">·</span>
      <span>CAT(C) athletic therapist</span>
      <span aria-hidden="true" className="text-steel-light">·</span>
      <span>50+ fights</span>
    </p>
  );
}

/** The close: contact form, free-download email, or (once Stripe is connected) checkout. */
export function OfferForm({ product, pageType, tone = "dark", cta }: { product: PublicProduct; pageType: "sales" | "landing"; tone?: "dark" | "light"; cta?: string }) {
  const goal = product.goal as GoalValue;
  if (product.close === "free") {
    return <LeadForm tone={tone} pageType={pageType} offer={product.slug} defaultGoal={goal} hideGoal minimal submitLabel={cta || "Send me the download"} />;
  }
  // "buy" falls back to the contact form until Stripe checkout is connected.
  return <LeadForm tone={tone} pageType={pageType} offer={product.slug} defaultGoal={goal} hideGoal submitLabel={cta || "Send"} />;
}

function PriceTag({ product, dark = false }: { product: PublicProduct; dark?: boolean }) {
  const showPrice = product.close === "free" || product.price_cents != null;
  if (!showPrice && !product.price_note) return null;
  return (
    <div className="flex flex-col gap-1">
      {showPrice && <span className={cn("display text-[48px] leading-none", dark ? "text-off-white" : "text-charcoal")}>{formatPrice(product)}</span>}
      {product.price_note && <span className={cn("font-mono text-[12px] uppercase tracking-[0.1em]", dark ? "text-mist" : "text-steel")}>{product.price_note}</span>}
    </div>
  );
}

/** Shown for a moment while an offer page loads. */
export function OfferPageFallback() {
  return <div aria-hidden="true" className="min-h-[86svh] bg-charcoal" />;
}

/* ───────────────────────── Proof blocks ───────────────────────── */

/**
 * One-line client testimonial: their own words in quote marks, the result as a
 * chip, then name and stars. Real before/after photos show when we have them.
 */
function ResultCard({ result, className }: { result: ClientResult; className?: string }) {
  const pics = result.photos;
  return (
    <figure className={cn("relative flex overflow-hidden rounded-[8px] bg-paper text-charcoal shadow-[0_18px_50px_rgba(0,0,0,0.35)]", className)}>
      {pics && (
        <div className="grid w-[40%] shrink-0 grid-cols-2 gap-px bg-ink">
          {(["before", "after"] as const).map((k) => (
            <div key={k} className="relative">
              <Image src={pics[k]} alt={`${result.name}, ${k}`} fill sizes="120px" className="object-cover" />
              <span className="absolute bottom-1.5 left-1.5 rounded-[3px] bg-ink/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white">{k}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-center justify-between gap-3">
          <Stars className="text-[13px]" label="5 out of 5 stars" />
          <span className="rounded-full bg-blue-wash px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-blue">
            {result.stat} · {result.line}
          </span>
        </div>
        <blockquote className="text-[16px] font-semibold leading-snug">“{result.quote}”</blockquote>
        <figcaption className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel">{result.name} · Google review</figcaption>
      </div>
    </figure>
  );
}

/**
 * Reviews straight after the hero: no heading, the people speak for themselves.
 * Clients already featured in the result cards or the big quote are skipped.
 */
function ReviewsRow({ goal, count = 6, className }: { goal: string; count?: number; className?: string }) {
  const featured = new Set([...(resultsByGoal[goal] ?? []).map((r) => r.name), quoteForGoal[goal]]);
  const list = reviewsForGoal(goal, allReviews.length).filter((r) => !featured.has(r.name)).slice(0, count);
  return (
    <section aria-label="Client reviews" className={cn("bg-off-white py-12 sm:py-16", className)}>
      <Container className="flex flex-col gap-6">
        <a href={site.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 self-start text-[15px] text-steel hover:text-charcoal">
          <span className="display text-[30px] leading-none text-charcoal">5.0</span>
          <Stars className="text-[15px]" />
          <span>69 Google reviews · read them all</span>
        </a>
        <Scroller label="client reviews">
          {list.map((r) => (
            <div key={r.name} className="w-[290px] shrink-0 snap-start sm:w-[360px]">
              <ReviewCard review={r} />
            </div>
          ))}
        </Scroller>
      </Container>
    </section>
  );
}

/** A client's own words, large, over a photo of the result. */
function QuoteBand({ goal, photo }: { goal: string; photo: { src: string; alt: string } }) {
  const review = allReviews.find((r) => r.name === quoteForGoal[goal]);
  if (!review) return null;
  return (
    <section className="relative isolate overflow-hidden bg-charcoal py-24 text-off-white sm:py-32">
      <Photo src={photo.src} alt="" sizes="100vw" className="-z-20 object-cover object-[70%_center]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/30 max-md:bg-charcoal/85" />
      <Container>
        <figure className="flex max-w-[820px] flex-col gap-6">
          <span aria-hidden="true" className="display text-[120px] leading-[0.5] text-blue">“</span>
          <blockquote className="text-[22px] font-semibold leading-snug sm:text-[30px]">{review.quote}</blockquote>
          <figcaption className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-mist">
            <Stars className="text-[13px]" /> {review.name} · Google review
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

/** The benefits as one list beside a photo of the result. No boxes, no grid. */
function BenefitList({
  items,
  photo,
  title,
  tone = "dark",
  children,
}: {
  items: Pair[];
  photo: { src: string; alt: string };
  title: ReactNode;
  tone?: "dark" | "light";
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section className={cn("py-20 sm:py-28", dark ? "bg-charcoal text-off-white" : "bg-off-white text-charcoal")}>
      <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-ink max-lg:max-h-[560px] max-lg:w-full lg:sticky lg:top-24 lg:self-start">
          <Photo src={photo.src} alt={photo.alt} sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-8">
          <h2 className="display text-[40px] leading-[0.95] sm:text-[56px]">{title}</h2>
          <ul className={cn("flex flex-col border-b", dark ? "border-line-dark" : "border-line")}>
            {items.map((o) => (
              <li key={o.title} className={cn("flex gap-5 border-t py-7 sm:gap-6 sm:py-8", dark ? "border-line-dark" : "border-line")}>
                <CheckBadge />
                <div className="flex flex-col gap-2">
                  <p className="display text-[30px] leading-[0.95] sm:text-[38px]">{o.title}</p>
                  {o.text && <p className={cn("max-w-[56ch] text-[18px] leading-relaxed", dark ? "text-mist" : "text-steel")}>{o.text}</p>}
                </div>
              </li>
            ))}
          </ul>
          {children}
        </div>
      </Container>
    </section>
  );
}

function CoachBand() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="grid items-center gap-8 md:grid-cols-[220px_1fr] md:gap-12">
          <div className="relative aspect-square w-[160px] overflow-hidden rounded-[6px] bg-charcoal md:w-full">
            <Image src="/images/services/fight-1.jpg" alt="Zack celebrating a win in the Karate Combat pit" fill sizes="220px" className="object-cover object-[50%_20%]" />
          </div>
          <div className="flex flex-col gap-3">
            <Eyebrow>Who you&apos;ll work with</Eyebrow>
            <p className="display text-[34px] leading-[0.95] text-charcoal sm:text-[44px]">Zakaria “Zack” Benbouchta</p>
            <p className="max-w-[64ch] text-[17px] leading-relaxed text-steel">
              A certified athletic therapist, CAT(C), with more than 10 years in practice and over 100 clients coached.
              He&apos;s also a fighter with 50+ amateur and pro bouts, including Karate Combat, so he has been through the
              injuries, camps and weight cuts himself.
            </p>
          </div>
        </div>
        <StatsRow className="border-t border-line pt-8" />
      </Container>
    </section>
  );
}

function CloseSection({ product, title, text, cta }: { product: PublicProduct; title: string; text?: string; cta: string }) {
  return (
    <section id="start" className="scroll-mt-20 bg-charcoal py-20 text-off-white sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 className="display text-[44px] leading-[0.92] sm:text-[60px]">{title}</h2>
          {text && <p className="max-w-[48ch] text-[19px] leading-relaxed text-mist">{text}</p>}
          <PriceTag product={product} dark />
          <p className="max-w-[46ch] text-[15px] text-steel-light">
            {product.close === "free"
              ? "Enter your name and email and the download opens right away."
              : "Zack reads every message himself and replies within 24 hours, usually by email."}
          </p>
        </div>
        <div className="rounded-[6px] border border-line-dark bg-charcoal-2 p-6 sm:p-8">
          <OfferForm product={product} pageType="sales" cta={cta} />
        </div>
      </Container>
    </section>
  );
}

function NoBadge() {
  return (
    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fde8e8] text-[#d64545]">
      <Cross className="h-4 w-4" />
    </span>
  );
}

function YesBadge() {
  return (
    <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-white">
      <Check className="h-4 w-4" />
    </span>
  );
}

/**
 * What you don't get vs what you get, point by point. Desktop: two rounded cards
 * whose rows line up (subgrid). Phone: one rounded card per pair.
 */
function Comparison({ rows, left }: { rows: [string, string][]; left: string }) {
  const span = { gridRow: `span ${rows.length + 1}` };
  return (
    <section className="bg-off-white py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <h2 className="display max-w-[20ch] text-[38px] leading-[0.95] text-charcoal sm:text-[52px]">What&apos;s different about working with Zack</h2>

        {/* Desktop */}
        <div className="relative hidden gap-6 md:grid md:grid-cols-2" style={{ gridTemplateRows: `repeat(${rows.length + 1}, auto)` }}>
          <div className="grid grid-rows-subgrid gap-3 rounded-[24px] border border-line bg-paper p-6 lg:p-8" style={span}>
            <p className="flex items-center gap-3 pb-2 font-mono text-[12px] uppercase tracking-[0.12em] text-steel">
              <NoBadge /> {left}
            </p>
            {rows.map(([no]) => (
              <p key={no} className="flex items-center gap-4 rounded-[16px] bg-off-white px-5 py-4 text-[17px] text-steel">
                <NoBadge />
                {no}
              </p>
            ))}
          </div>
          <div className="grid grid-rows-subgrid gap-3 rounded-[24px] bg-charcoal p-6 shadow-[0_24px_60px_rgba(9,16,28,0.25)] lg:p-8" style={span}>
            <p className="flex items-center gap-3 pb-2 font-mono text-[12px] uppercase tracking-[0.12em] text-blue-pale">
              <YesBadge /> Working with Zack
            </p>
            {rows.map(([, yes]) => (
              <p key={yes} className="flex items-center gap-4 rounded-[16px] bg-white/[0.06] px-5 py-4 text-[17px] font-semibold text-off-white">
                <YesBadge />
                {yes}
              </p>
            ))}
          </div>
          <span aria-hidden="true" className="absolute left-1/2 top-7 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-off-white bg-blue font-mono text-[12px] uppercase tracking-[0.08em] text-white lg:top-9">
            vs
          </span>
        </div>

        {/* Phone */}
        <ul className="flex flex-col gap-3 md:hidden">
          {rows.map(([no, yes]) => (
            <li key={no} className="overflow-hidden rounded-[20px] border border-line bg-paper">
              <p className="flex items-center gap-3 px-4 py-3.5 text-[15px] text-steel">
                <NoBadge />
                {no}
              </p>
              <p className="flex items-center gap-3 bg-charcoal px-4 py-3.5 text-[15px] font-semibold text-off-white">
                <YesBadge />
                {yes}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ───────────────────────── Sales page ───────────────────────── */

export function SalesPage({ product }: { product: PublicProduct }) {
  const s = product.sales_page;
  const cta = s.cta || "Get started";
  const { pain, win, again } = photos(product);
  const results = resultsByGoal[product.goal] ?? [];
  const problem = lines(s.problem);
  const compare = parseCompare(s.compare);
  const outcomes = parsePairs(s.outcomes);
  const steps = parsePairs(s.steps);
  const included = lines(s.included);

  return (
    <>
      {/* 1. Who it's for and the outcome, with client testimonials beside it */}
      <section className="relative isolate overflow-hidden bg-charcoal text-off-white">
        <Photo src={heroImage(product)} alt="" preload sizes="100vw" className="-z-20 object-cover object-[65%_35%] opacity-70" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,16,28,0.97)_0%,rgba(9,16,28,0.86)_50%,rgba(9,16,28,0.45)_100%)] max-lg:bg-[rgba(9,16,28,0.86)]" />
        <Container className="grid items-center gap-10 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:min-h-[min(88svh,900px)] lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-28">
          <div className="flex flex-col gap-5">
            {s.callout && <p className="eyebrow text-blue-pale">{s.callout}</p>}
            <h1 className="display max-w-[20ch] text-[40px] leading-[0.95] sm:text-[52px] lg:text-[60px]">{s.headline || product.title}</h1>
            {(s.subheadline || product.summary) && <p className="max-w-[50ch] text-[18px] leading-relaxed text-mist">{s.subheadline || product.summary}</p>}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Button href="#start" size="lg">{cta} <Arrow /></Button>
            </div>
            <ProofLine />
          </div>
          {results.length > 0 && (
            <div className="flex flex-col gap-4 lg:pl-4">
              {results.slice(0, 3).map((r, i) => (
                <ResultCard key={r.name} result={r} className={cn("lg:max-w-[460px]", i % 2 === 1 ? "lg:ml-10" : "lg:mr-10")} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 2. Reviews, high on the page */}
      <ReviewsRow goal={product.goal} />

      {/* 3. The problem, in the reader's words */}
      {problem.length > 0 && (
        <section className="bg-paper py-20 sm:py-28">
          <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-charcoal max-lg:max-h-[560px]">
              <Photo src={pain.src} alt={pain.alt} sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-6">
              {s.problemTitle && <h2 className="display text-[38px] leading-[0.95] text-charcoal sm:text-[52px]">{s.problemTitle}</h2>}
              <div className="flex flex-col gap-5 text-[19px] leading-relaxed text-steel">
                {problem.map((p, i) => (
                  <p key={i} className={i === problem.length - 1 && problem.length > 1 ? "font-semibold text-charcoal" : undefined}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 4. What's different */}
      {compare.length > 0 && <Comparison rows={compare} left={s.compareLeft || "The usual way"} />}

      {/* 5. Benefits */}
      {outcomes.length > 0 && (
        <BenefitList items={outcomes} photo={win} title={s.outcomesTitle || "What you get"}>
          <div>
            <Button href="#start" size="lg">{cta} <Arrow /></Button>
          </div>
        </BenefitList>
      )}

      {/* 6. A client in their own words */}
      <QuoteBand goal={product.goal} photo={again} />

      {/* 7. How it works */}
      {steps.length > 0 && (
        <section className="bg-paper py-20 sm:py-28">
          <Container className="flex flex-col gap-12">
            <h2 className="display text-[38px] leading-[0.95] text-charcoal sm:text-[52px]">How it works</h2>
            <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
              {steps.map((st, i) => (
                <li key={st.title} className="flex flex-col gap-3 border-t-2 border-blue pt-6">
                  <span className="display text-[64px] leading-none text-blue/30">{i + 1}</span>
                  <p className="display text-[28px] leading-[0.95] text-charcoal">{st.title}</p>
                  {st.text && <p className="text-[17px] leading-relaxed text-steel">{st.text}</p>}
                </li>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* 8. What's included */}
      {included.length > 0 && (
        <section className="bg-off-white py-20 sm:py-28">
          <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-6">
              <h2 className="display text-[38px] leading-[0.95] text-charcoal sm:text-[52px]">What&apos;s included</h2>
              <ul className="flex flex-col divide-y divide-line border-y border-line">
                {included.map((item) => (
                  <li key={item} className="flex gap-4 py-4 text-[18px] text-charcoal">
                    <Check className="mt-1.5 text-blue" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6 self-start rounded-[6px] bg-charcoal p-8 text-off-white">
              <p className="eyebrow text-blue-pale">{product.title}</p>
              <PriceTag product={product} dark />
              <Button href="#start" size="lg" className="w-full">{cta} <Arrow /></Button>
            </div>
          </Container>
        </section>
      )}

      {/* 9. Who you'll work with */}
      <CoachBand />

      {/* 10. Close */}
      <CloseSection product={product} title={s.closeTitle || `Start ${product.title}`} text={s.outcomeAgain} cta={cta} />
      <ProofBar />
    </>
  );
}

/* ───────────────────────── Landing page ───────────────────────── */

export function LandingPage({ product }: { product: PublicProduct }) {
  const l = product.landing_page;
  const s = product.sales_page;
  const cta = l.cta || s.cta || "Get started";
  const outcomes = parsePairs(s.outcomes);
  const results = resultsByGoal[product.goal] ?? [];

  return (
    <>
      {/* Above the fold: headline, subheadline, form */}
      <section className="relative isolate overflow-hidden bg-charcoal text-off-white">
        <Photo src={heroImage(product)} alt="" preload sizes="100vw" className="-z-20 object-cover object-[65%_35%] opacity-60" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,16,28,0.96)_0%,rgba(9,16,28,0.86)_50%,rgba(9,16,28,0.6)_100%)] max-lg:bg-[rgba(9,16,28,0.86)]" />
        <Container className="grid items-center gap-10 pb-16 pt-28 sm:pt-32 lg:min-h-[min(100svh,960px)] lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
          <div className="flex flex-col gap-5">
            {s.callout && <p className="eyebrow text-blue-pale">{s.callout}</p>}
            <h1 className="display max-w-[18ch] text-[40px] leading-[0.95] sm:text-[52px] lg:text-[60px]">{l.headline || s.headline || product.title}</h1>
            {(l.subheadline || s.subheadline) && <p className="max-w-[48ch] text-[18px] leading-relaxed text-mist">{l.subheadline || s.subheadline}</p>}
            <ProofLine />
          </div>
          <div id="form" className="scroll-mt-24 rounded-[6px] border border-line-dark bg-charcoal/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
            <p className="display mb-1 text-[30px] leading-none">{l.formTitle || s.closeTitle || `Start ${product.title}`}</p>
            <PriceTag product={product} dark />
            <div className="mt-5">
              <OfferForm product={product} pageType="landing" cta={cta} />
            </div>
          </div>
        </Container>
      </section>

      {/* Results and reviews first */}
      {results.length > 0 && (
        <section aria-label="Client results" className="bg-off-white pt-12 sm:pt-16">
          <Container className="grid gap-3 md:grid-cols-3">
            {results.slice(0, 3).map((r) => (
              <ResultCard key={r.name} result={r} className="border border-line shadow-none" />
            ))}
          </Container>
        </section>
      )}
      <ReviewsRow goal={product.goal} count={4} />

      {/* Benefits */}
      {outcomes.length > 0 && (
        <BenefitList items={outcomes} photo={photos(product).win} title={s.outcomesTitle || "What you get"}>
          <div>
            <Button href="#form" size="lg">{cta} <Arrow /></Button>
          </div>
        </BenefitList>
      )}

      <CoachBand />
      <ProofBar />
    </>
  );
}
