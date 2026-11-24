import Image from "next/image";
import type { ReactNode } from "react";
import { offerImages, reviewsForGoal, site } from "@/content/site";
import { formatPrice, lines, type PublicProduct } from "@/lib/product-options";
import type { GoalValue } from "@/lib/leads";
import { LeadForm } from "@/components/lead-form";
import { Scroller } from "@/components/scroller";
import { ProofBar, ReviewCard, StatsRow, imageForReview } from "@/components/sections";
import { Arrow, Button, Container, Eyebrow, Stars, cn } from "@/components/ui";

/* Shared pieces for /programs/[slug] (sales page) and /go/[slug] (landing page). */

const eyebrowFor = (p: PublicProduct) =>
  p.kind === "coaching" ? p.title : `${p.kind === "pdf" ? "PDF guide" : "Video lesson"} · ${p.title}`;

const heroImage = (p: PublicProduct) => p.image || offerImages[p.goal]?.[0]?.src || "/images/zack/coaching-wide.jpg";
const photos = (p: PublicProduct) => offerImages[p.goal] ?? offerImages.other;

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
  const [sidePhoto, againPhoto] = photos(product);
  const outcomes = lines(s.outcomes).map((l) => {
    const i = l.indexOf(":");
    return i > 0 ? { title: l.slice(0, i).trim(), text: l.slice(i + 1).trim() } : { title: l, text: "" };
  });
  const whoFor = lines(s.whoFor);
  const included = lines(s.included);
  const reviews = reviewsForGoal(product.goal);
  const counts: Record<string, number> = {};

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
              <Photo src={sidePhoto.src} alt={sidePhoto.alt} sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-6">
              <Eyebrow>Who it&apos;s for</Eyebrow>
              <h2 className="display text-[44px] leading-[0.92] text-charcoal sm:text-[60px]">This is for you if…</h2>
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
        <section className="bg-charcoal py-20 text-off-white sm:py-28">
          <Container className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <Eyebrow className="text-blue-pale">What you get out of it</Eyebrow>
              <h2 className="display max-w-[18ch] text-[44px] leading-[0.92] sm:text-[64px]">What changes when you start.</h2>
            </div>
            <ol className="grid gap-x-12 gap-y-10 md:grid-cols-2">
              {outcomes.map((o, i) => (
                <li key={o.title} className="flex gap-5 border-t border-line-dark pt-6">
                  <span className="display text-[44px] leading-none text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-col gap-2">
                    <span className="display text-[30px] leading-[0.95]">{o.title}</span>
                    {o.text && <span className="text-[16px] text-mist">{o.text}</span>}
                  </span>
                </li>
              ))}
            </ol>
            <div>
              <Button href="#start" size="lg">{cta} <Arrow /></Button>
            </div>
          </Container>
        </section>
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
              counts[r.tag] = (counts[r.tag] ?? -1) + 1;
              return (
                <div key={r.name} className="w-[290px] shrink-0 snap-start sm:w-[340px]">
                  <ReviewCard review={r} image={imageForReview(r, counts[r.tag])} />
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
          <Photo src={againPhoto.src} alt="" sizes="100vw" className="-z-20 object-cover opacity-40" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
          <Container className="flex flex-col items-start gap-8">
            <p className="display max-w-[20ch] text-[40px] leading-[0.95] sm:text-[60px]">{s.outcomeAgain}</p>
            <Button href="#start" size="lg">{cta} <Arrow /></Button>
          </Container>
        </section>
      )}

      {/* 7. Close */}
      <CloseSection product={product} title={s.closeTitle || `Start ${product.title}`} cta={cta} pageType="sales" />
    </>
  );
}

function CloseSection({ product, title, cta, pageType }: { product: PublicProduct; title: string; cta: string; pageType: "sales" | "landing" }) {
  return (
    <section id="start" className="scroll-mt-20 bg-charcoal py-20 text-off-white sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <Eyebrow className="text-blue-pale">{product.title}</Eyebrow>
          <h2 className="display text-[44px] leading-[0.92] sm:text-[64px]">{title}</h2>
          <PriceTag product={product} dark />
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
  const counts: Record<string, number> = {};

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

      {/* Testimonials */}
      <section className="bg-off-white py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>Results</Eyebrow>
            <h2 className="display text-[40px] leading-[0.92] text-charcoal sm:text-[56px]">Real clients. Real comebacks.</h2>
          </div>
          <Scroller label="client reviews">
            {reviews.map((r) => {
              counts[r.tag] = (counts[r.tag] ?? -1) + 1;
              return (
                <div key={r.name} className="w-[290px] shrink-0 snap-start sm:w-[360px]">
                  <ReviewCard review={r} image={imageForReview(r, counts[r.tag])} />
                </div>
              );
            })}
          </Scroller>
        </Container>
      </section>

      {/* Proof */}
      <section className="bg-paper py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <div className="grid items-center gap-8 md:grid-cols-[200px_1fr_auto] md:gap-10">
            <div className="relative aspect-square w-[150px] overflow-hidden rounded-[6px] bg-charcoal md:w-full">
              <Image src="/images/zack/fight-punch.jpg" alt="Zack landing a punch during a Karate Combat fight" fill sizes="200px" className="object-cover object-[62%_center]" />
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
