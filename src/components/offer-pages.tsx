import Image from "next/image";
import type { ReactNode } from "react";
import { offerImages, reviewsForGoal, site } from "@/content/site";
import { formatPrice, lines, type PublicProduct } from "@/lib/product-options";
import type { GoalValue } from "@/lib/leads";
import { LeadForm } from "@/components/lead-form";
import { Scroller } from "@/components/scroller";
import { ProofBar, ReviewCard, StatsRow } from "@/components/sections";
import { Arrow, Button, Container, Eyebrow, Stars, cn } from "@/components/ui";

/* Shared pieces for /programs/[slug] (sales page) and /go/[slug] (landing page). */

const eyebrowFor = (p: PublicProduct) =>
  p.kind === "coaching" ? p.title : `${p.kind === "pdf" ? "PDF guide" : "Video lesson"} · ${p.title}`;

const photos = (p: PublicProduct) => offerImages[p.goal] ?? offerImages.other;
const heroImage = (p: PublicProduct) => p.image || photos(p).win.src;

/** Dream outcome points: "Short bold line: one sentence" per line. */
function parseOutcomes(text?: string) {
  return lines(text).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? { title: l.slice(0, i).trim(), text: l.slice(i + 1).trim() } : { title: l, text: "" };
  });
}
type Outcome = ReturnType<typeof parseOutcomes>[number];

/** next/image only optimizes local files; dashboard https links load as-is. */
function Photo({ src, alt, className, sizes, preload }: { src: string; alt: string; className?: string; sizes: string; preload?: boolean }) {
  return <Image src={src} alt={alt} fill sizes={sizes} preload={preload} unoptimized={src.startsWith("http")} className={className} />;
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-blue" fill="none" aria-hidden="true">
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckBadge({ size = "lg" }: { size?: "sm" | "lg" }) {
  return (
    <span aria-hidden="true" className={cn("flex shrink-0 items-center justify-center rounded-full bg-blue text-white", size === "lg" ? "h-11 w-11" : "h-6 w-6")}>
      <svg viewBox="0 0 20 20" className={size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5"} fill="none">
        <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** Compact benefit checklist: the outcome headlines only, for the hero and the close. */
function BenefitChecks({ items, className }: { items: Outcome[]; className?: string }) {
  if (!items.length) return null;
  return (
    <ul className={cn("grid gap-x-8 gap-y-3 sm:grid-cols-2", className)}>
      {items.map((o) => (
        <li key={o.title} className="flex items-center gap-3 text-[17px] font-semibold text-off-white">
          <CheckBadge size="sm" />
          {o.title}
        </li>
      ))}
    </ul>
  );
}

/**
 * The benefits as one big list, next to a photo of the result. No boxes or grid:
 * each benefit gets a full-width row with room to breathe.
 */
function BenefitList({
  items,
  photo,
  eyebrow,
  title,
  tone = "dark",
  children,
}: {
  items: Outcome[];
  photo: { src: string; alt: string };
  eyebrow: string;
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
          <div className="flex flex-col gap-4">
            <Eyebrow className={dark ? "text-blue-pale" : undefined}>{eyebrow}</Eyebrow>
            <h2 className="display text-[44px] leading-[0.92] sm:text-[64px]">{title}</h2>
          </div>
          <ul className={cn("flex flex-col border-b", dark ? "border-line-dark" : "border-line")}>
            {items.map((o) => (
              <li key={o.title} className={cn("flex gap-5 border-t py-7 sm:gap-6 sm:py-8", dark ? "border-line-dark" : "border-line")}>
                <CheckBadge />
                <div className="flex flex-col gap-2">
                  <p className="display text-[32px] leading-[0.95] sm:text-[42px]">{o.title}</p>
                  {o.text && <p className={cn("max-w-[52ch] text-[18px] leading-relaxed", dark ? "text-mist" : "text-steel")}>{o.text}</p>}
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

/* ───────────────────────── Sales page ───────────────────────── */

export function SalesPage({ product }: { product: PublicProduct }) {
  const s = product.sales_page;
  const cta = s.cta || "Get started";
  const { pain, win, again } = photos(product);
  const outcomes = parseOutcomes(s.outcomes);
  const whoFor = lines(s.whoFor);
  const included = lines(s.included);
  const reviews = reviewsForGoal(product.goal);

  return (
    <>
      {/* 1. Dream outcome */}
      <section className="relative isolate overflow-hidden bg-charcoal text-off-white">
        <Photo src={heroImage(product)} alt="" preload sizes="100vw" className="-z-20 object-cover object-[65%_35%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,16,28,0.96)_0%,rgba(9,16,28,0.8)_45%,rgba(9,16,28,0.25)_100%)] max-md:bg-[rgba(9,16,28,0.82)]" />
        <Container className="flex min-h-[86svh] flex-col justify-end gap-6 pb-16 pt-36 sm:pb-24">
          <p className="eyebrow text-blue-pale">{eyebrowFor(product)}</p>
          <h1 className="display max-w-[15ch] text-[54px] leading-[0.9] sm:text-[80px] lg:text-[100px]">{s.headline || product.title}</h1>
          {(s.subheadline || product.summary) && <p className="max-w-[54ch] text-[19px] text-mist sm:text-[21px]">{s.subheadline || product.summary}</p>}
          <BenefitChecks items={outcomes} className="max-w-[640px]" />
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button href="#start" size="lg">{cta} <Arrow /></Button>
          </div>
          <ProofLine />
        </Container>
      </section>

      {/* 2. Who it's for */}
      {whoFor.length > 0 && (
        <section className="bg-off-white py-20 sm:py-28">
          <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-charcoal sm:aspect-[4/3] lg:aspect-[4/5]">
              <Photo src={pain.src} alt={pain.alt} sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-6">
              <Eyebrow>Who it&apos;s for</Eyebrow>
              <h2 className="display text-[44px] leading-[0.92] text-charcoal sm:text-[60px]">Sound familiar?</h2>
              <ul className="flex flex-col divide-y divide-line border-y border-line">
                {whoFor.map((w) => (
                  <li key={w} className="flex gap-4 py-4 text-[18px] text-charcoal">
                    <span aria-hidden="true" className="mt-0.5 font-mono text-[14px] text-blue">→</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {/* 3. Dream outcome points */}
      {outcomes.length > 0 && (
        <BenefitList items={outcomes} photo={win} eyebrow="What you get out of it" title="What changes when you start.">
          <div>
            <Button href="#start" size="lg">{cta} <Arrow /></Button>
          </div>
        </BenefitList>
      )}

      {/* 4. What's included */}
      {included.length > 0 && (
        <section className="bg-paper py-20 sm:py-28">
          <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div className="flex flex-col gap-6">
              <Eyebrow>What&apos;s included</Eyebrow>
              <h2 className="display text-[44px] leading-[0.92] text-charcoal sm:text-[60px]">Everything you need, nothing you don&apos;t.</h2>
              <ul className="flex flex-col gap-4">
                {included.map((item) => (
                  <li key={item} className="flex gap-3 text-[18px] text-charcoal">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between gap-8 self-start rounded-[6px] bg-charcoal p-8 text-off-white">
              <div className="flex flex-col gap-3">
                <p className="eyebrow text-blue-pale">{product.title}</p>
                <PriceTag product={product} dark />
                {product.summary && <p className="text-[16px] text-mist">{product.summary}</p>}
              </div>
              <Button href="#start" size="lg" className="w-full">{cta} <Arrow /></Button>
            </div>
          </Container>
        </section>
      )}

      {/* 5. Proof */}
      <section className="bg-off-white py-20 sm:py-28">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="flex flex-col gap-4">
              <Eyebrow>Results</Eyebrow>
              <h2 className="display text-[44px] leading-[0.92] text-charcoal sm:text-[60px]">They did it. So can you.</h2>
            </div>
            <a
              href={site.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 self-start rounded-[6px] border border-line bg-paper px-5 py-4 transition-colors hover:border-blue md:self-auto"
            >
              <span className="display text-[44px] leading-none text-charcoal">5.0</span>
              <span className="flex flex-col gap-1">
                <Stars className="text-[16px]" />
                <span className="text-[14px] text-steel">69 Google reviews · read them all</span>
              </span>
            </a>
          </div>
          <Scroller label="client reviews">
            {reviews.map((r) => {
              return (
                <div key={r.name} className="w-[290px] shrink-0 snap-start sm:w-[340px]">
                  <ReviewCard review={r} />
                </div>
              );
            })}
          </Scroller>
          <StatsRow className="border-t border-line pt-8" />
        </Container>
      </section>
      <ProofBar />

      {/* 6. Dream outcome, again */}
      {s.outcomeAgain && (
        <section className="relative isolate overflow-hidden bg-charcoal py-24 text-off-white sm:py-32">
          <Photo src={again.src} alt="" sizes="100vw" className="-z-20 object-cover object-[70%_center]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/20 max-md:bg-charcoal/80" />
          <Container className="flex flex-col items-start gap-8">
            <p className="display max-w-[20ch] text-[40px] leading-[0.95] sm:text-[60px]">{s.outcomeAgain}</p>
            <Button href="#start" size="lg">{cta} <Arrow /></Button>
          </Container>
        </section>
      )}

      {/* 7. Close */}
      <CloseSection product={product} title={s.closeTitle || `Start ${product.title}`} cta={cta} pageType="sales" outcomes={outcomes} />
    </>
  );
}

function CloseSection({
  product,
  title,
  cta,
  pageType,
  outcomes,
}: {
  product: PublicProduct;
  title: string;
  cta: string;
  pageType: "sales" | "landing";
  outcomes: Outcome[];
}) {
  return (
    <section id="start" className="scroll-mt-20 bg-charcoal py-20 text-off-white sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Eyebrow className="text-blue-pale">{product.title}</Eyebrow>
          <h2 className="display text-[44px] leading-[0.92] sm:text-[64px]">{title}</h2>
          <PriceTag product={product} dark />
          <BenefitChecks items={outcomes} className="sm:grid-cols-1" />
          <CloseNote product={product} />
        </div>
        <div className="rounded-[6px] border border-line-dark bg-charcoal-2 p-6 sm:p-8">
          <OfferForm product={product} pageType={pageType} cta={cta} />
        </div>
      </Container>
    </section>
  );
}

function CloseNote({ product }: { product: PublicProduct }) {
  const text: ReactNode =
    product.close === "free"
      ? "Enter your name and email and the download opens right away."
      : "Send your details and Zack replies within 24 hours, usually by email. He reads every message himself.";
  return <p className="max-w-[46ch] text-[17px] text-mist">{text}</p>;
}

/* ───────────────────────── Landing page ───────────────────────── */

export function LandingPage({ product }: { product: PublicProduct }) {
  const l = product.landing_page;
  const s = product.sales_page;
  const cta = l.cta || s.cta || "Get started";
  const reviews = reviewsForGoal(product.goal, 3);
  const outcomes = parseOutcomes(s.outcomes);

  return (
    <>
      {/* Above the fold: headline, subheadline, form */}
      <section className="relative isolate overflow-hidden bg-charcoal text-off-white">
        <Photo src={heroImage(product)} alt="" preload sizes="100vw" className="-z-20 object-cover object-[65%_35%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,16,28,0.96)_0%,rgba(9,16,28,0.85)_50%,rgba(9,16,28,0.55)_100%)] max-lg:bg-[rgba(9,16,28,0.85)]" />
        <Container className="grid items-center gap-10 pb-16 pt-28 sm:pt-32 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
          <div className="flex flex-col gap-5">
            <p className="eyebrow text-blue-pale">{eyebrowFor(product)}</p>
            <h1 className="display text-[48px] leading-[0.9] sm:text-[72px] lg:text-[84px]">{l.headline || s.headline || product.title}</h1>
            {(l.subheadline || s.subheadline) && <p className="max-w-[48ch] text-[18px] text-mist sm:text-[20px]">{l.subheadline || s.subheadline}</p>}
            <BenefitChecks items={outcomes} className="max-lg:hidden" />
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

      {/* Benefits */}
      {outcomes.length > 0 && (
        <BenefitList items={outcomes} photo={photos(product).win} eyebrow="What you get" title="What changes when you start." tone="light">
          <div>
            <Button href="#form" size="lg">{cta} <Arrow /></Button>
          </div>
        </BenefitList>
      )}

      {/* Testimonials */}
      <section className="bg-paper py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>Results</Eyebrow>
            <h2 className="display text-[40px] leading-[0.92] text-charcoal sm:text-[56px]">Real clients. Real comebacks.</h2>
          </div>
          <Scroller label="client reviews">
            {reviews.map((r) => {
              return (
                <div key={r.name} className="w-[290px] shrink-0 snap-start sm:w-[360px]">
                  <ReviewCard review={r} />
                </div>
              );
            })}
          </Scroller>
        </Container>
      </section>

      {/* Proof */}
      <section className="bg-off-white py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <div className="grid items-center gap-8 md:grid-cols-[200px_1fr_auto] md:gap-10">
            <div className="relative aspect-square w-[150px] overflow-hidden rounded-[6px] bg-charcoal md:w-full">
              <Image src="/images/services/fight-1.jpg" alt="Zack celebrating a win in the Karate Combat pit" fill sizes="200px" className="object-cover object-[50%_20%]" />
            </div>
            <div className="flex flex-col gap-3">
              <Eyebrow>Your coach</Eyebrow>
              <p className="display text-[34px] leading-[0.95] text-charcoal sm:text-[42px]">Studied it in the clinic. Proved it in the ring.</p>
              <p className="max-w-[60ch] text-[16px] text-steel">
                Zakaria “Zack” Benbouchta is a certified athletic therapist and a fighter with 50+ bouts, including Karate
                Combat.
              </p>
            </div>
            <Button href="#form" size="lg" className="self-start md:self-center">{cta} <Arrow /></Button>
          </div>
          <StatsRow className="border-t border-line pt-8" />
        </Container>
      </section>
      <ProofBar />
    </>
  );
}
