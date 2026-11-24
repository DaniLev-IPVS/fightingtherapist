import Image, { getImageProps } from "next/image";
import Link from "next/link";
import {
  goals,
  instagram,
  press,
  pressLogos,
  reels,
  reviewImages,
  reviews,
  serviceCards,
  site,
  stats,
  type Review,
} from "@/content/site";
import { Arrow, Button, Container, Eyebrow, SectionHeading, Stars, cn } from "@/components/ui";
import { Scroller } from "@/components/scroller";
import { HeroShow, type HeroCard } from "@/components/hero-show";
import { CountUp } from "@/components/count-up";

/* ───────────────────────── Hero ───────────────────────── */

const heroAlt =
  "Zack Benbouchta with arms crossed in a dark training studio, with kettlebells and a heavy bag behind him";

const SLIDES = [
  { key: "rehab", src: "/images/hero/slide-rehab.jpg", alt: "A therapist taping an athlete's shoulder" },
  { key: "training", src: "/images/hero/slide-training.jpg", alt: "A woman pushing a heavy sled across gym turf" },
  { key: "nutrition", src: "/images/hero/slide-nutrition.jpg", alt: "Meal prep containers, a food scale and a meal plan" },
];

/** Mobile: photo across the top 78% fading into the copy. Desktop: full bleed behind the copy. */
const slideImg =
  "absolute inset-x-0 top-0 h-[78svh] w-full object-cover [mask-image:linear-gradient(to_bottom,#000_70%,transparent)] md:inset-0 md:h-full md:[mask-image:none]";

export function Hero() {
  // Art direction: the wide studio shot from md up, the matching portrait on phones (the wide one goes soft there).
  const {
    props: { srcSet: wideSrcSet },
  } = getImageProps({ alt: heroAlt, src: "/images/hero/zack-studio.jpg", width: 2000, height: 857, quality: 85, sizes: "100vw" });
  const {
    props: { srcSet: portraitSrcSet, ...imgProps },
  } = getImageProps({
    alt: heroAlt,
    src: "/images/hero/zack-studio-portrait.jpg",
    width: 1072,
    height: 1856,
    quality: 85,
    sizes: "100vw",
  });

  const backgrounds = [
    <picture key="zack">
      <source media="(min-width: 768px)" srcSet={wideSrcSet} sizes="100vw" />
      <img
        {...imgProps}
        srcSet={portraitSrcSet}
        alt={heroAlt}
        fetchPriority="high"
        loading="eager"
        className={cn(slideImg, "object-[50%_0%] md:object-[72%_25%]")}
      />
    </picture>,
    ...SLIDES.map((s) => {
      const { props } = getImageProps({ alt: s.alt, src: s.src, width: 1792, height: 1008, quality: 85, sizes: "100vw" });
      // eslint-disable-next-line @next/next/no-img-element -- getImageProps output, same as the Zack slide
      return <img key={s.key} {...props} alt={s.alt} className={cn(slideImg, "object-[68%_50%] md:object-[62%_50%]")} />;
    }),
  ];

  const cards: HeroCard[] = serviceCards.map((c) => ({
    key: c.key,
    label: c.label,
    title: c.title,
    href: `/programs#${c.key}`,
    image: c.images[0].src,
    alt: c.images[0].alt,
  }));

  return (
    <HeroShow backgrounds={backgrounds} cards={cards} eyebrow={["Online rehab", "Training", "Nutrition"]}>
      <h1 className="display text-[64px] leading-[0.88] sm:text-[96px] lg:text-[120px]">
        Fight-tested
        <br />
        coaching.
      </h1>
      <p className="max-w-[44ch] text-[19px] text-mist sm:text-[21px]">
        Get out of pain, get strong, get lean. A plan built around your body and your goal, coached by an athletic
        therapist who has been in the fight.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button href="/programs" size="lg">
          Find your program <Arrow />
        </Button>
        <Button href="/contact" size="lg" variant="ghost-light">
          Talk to Zack
        </Button>
      </div>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] uppercase tracking-[0.1em] text-steel-light">
        <span className="inline-flex items-center gap-1.5 text-off-white">
          <Stars className="text-[13px]" /> 5.0 from 69 reviews
        </span>
        <span aria-hidden="true">·</span>
        <span>CAT(C) athletic therapist</span>
        <span aria-hidden="true">·</span>
        <span>50+ fights</span>
      </p>
    </HeroShow>
  );
}

/* ───────────────────────── Proof bar ───────────────────────── */

export function ProofBar() {
  return (
    <section aria-label="As seen on" className="border-y border-line-dark bg-charcoal py-8 text-steel-light">
      <Container className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
        <p className="eyebrow shrink-0 text-[11px]">As seen on / fought for</p>
        {/* Endless strip of names; it stops on hover and sits still for reduced motion. */}
        <div className="marquee relative w-full min-w-0 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] md:max-w-[720px]">
          <ul className="marquee-track flex w-max items-center">
            {[...pressLogos, ...pressLogos].map((name, i) => (
              <li
                key={`${name}-${i}`}
                aria-hidden={i >= pressLogos.length}
                className="display whitespace-nowrap px-6 text-[22px] tracking-[0.04em] text-mist/80 sm:text-[26px]"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────── Testimonials ───────────────────────── */

export function ReviewCard({
  review,
  image,
  tone = "light",
  clamp = false,
}: {
  review: Review;
  image?: string;
  tone?: "light" | "dark";
  clamp?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <figure className={cn("flex h-full flex-col overflow-hidden rounded-[6px] border", dark ? "border-line-dark bg-charcoal-2" : "border-line bg-paper")}>
      {image && (
        <div className="relative aspect-[16/7] shrink-0 overflow-hidden bg-charcoal">
          <Image src={image} alt="" fill sizes="360px" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
          <span className="eyebrow absolute bottom-3 left-4 text-[10.5px] text-blue-pale">{review.tag}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <Stars className="text-[14px]" />
          {!image && <span className={cn("eyebrow text-[10.5px]", dark ? "text-blue-pale" : "text-blue")}>{review.tag}</span>}
        </div>
        <p className={cn("display text-[24px] leading-[0.95]", dark ? "text-off-white" : "text-charcoal")}>{review.headline}</p>
        <blockquote className={cn("flex-1 text-[15px] leading-relaxed", dark ? "text-mist" : "text-steel", clamp && "line-clamp-5")}>
          “{review.quote}”
        </blockquote>
        <figcaption className={cn("font-mono text-[11.5px] uppercase tracking-[0.12em]", dark ? "text-steel-light" : "text-charcoal")}>
          {review.name} · Google review
        </figcaption>
      </div>
    </figure>
  );
}

/** Pick a header image per review, alternating within each category. */
export function imageForReview(review: Review, index: number) {
  const list = reviewImages[review.tag];
  return list[index % list.length];
}

export function Testimonials() {
  const counts: Record<string, number> = {};
  return (
    <section className="bg-off-white py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Results" title={<>Real clients.<br />Real comebacks.</>} />
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
              <div key={r.name} className="w-[290px] shrink-0 snap-start sm:w-[330px]">
                <ReviewCard review={r} image={imageForReview(r, counts[r.tag])} clamp />
              </div>
            );
          })}
        </Scroller>
      </Container>
    </section>
  );
}

/* ───────────────────────── What brings you here ───────────────────────── */

/** Full-width image panels. On desktop the hovered (or focused) panel opens wide. */
export function Goals() {
  return (
    <section className="bg-charcoal py-20 text-off-white sm:py-28">
      <Container className="flex flex-col gap-10">
        <SectionHeading dark eyebrow="Pick your fight" title="What brings you here?" intro="Start with what you want. The plan gets built around it." />
        <div className="goal-panels flex flex-col gap-3 md:h-[580px] md:flex-row">
          {goals.map((g) => (
            <Link
              key={g.key}
              href={`/programs#${g.key}`}
              className="goal-panel group/panel relative flex h-[340px] overflow-hidden rounded-[6px] bg-charcoal-2 md:h-auto"
            >
              <Image src={g.image} alt={g.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover/panel:scale-[1.03]" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
              <div className="relative mt-auto flex w-full flex-col gap-3 p-6 md:p-7">
                <span className="eyebrow text-[11px] text-blue-pale">{g.title}</span>
                <span className="display text-[34px] leading-[0.92] sm:text-[38px]">{g.outcome}</span>
                <span className="goal-text max-w-[40ch] text-[15px] text-mist">
                  {g.text}
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-blue-pale">
                  See the program <Arrow />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────── Why it works (Zack as proof) ───────────────────────── */

export function StatsRow({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4", className)}>
      {stats.map((s) => (
        <div key={s.label} className={cn("flex flex-col gap-1 border-l-2 pl-4", dark ? "border-blue" : "border-blue")}>
          <dt className="sr-only">{s.label}</dt>
          <dd className={cn("display flex items-baseline gap-1.5 text-[34px] leading-none", dark ? "text-off-white" : "text-charcoal")}>
            <CountUp value={s.value} />
            {s.star && <Stars className="text-[13px]" label="stars" />}
          </dd>
          <dd className={cn("text-[13px]", dark ? "text-mist" : "text-steel")} aria-hidden="true">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function WhyItWorks() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="grid items-center gap-8 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr_auto] lg:gap-12">
          <div className="relative aspect-square w-[160px] overflow-hidden rounded-[6px] bg-charcoal md:w-full">
            <Image src="/images/zack/fight-punch.jpg" alt="Zack landing a punch during a Karate Combat fight" fill sizes="260px" className="object-cover object-[62%_center]" />
          </div>
          <div className="flex flex-col gap-3">
            <Eyebrow>Why it works</Eyebrow>
            <h2 className="display text-[36px] text-charcoal sm:text-[44px]">Studied it in the clinic. Proved it in the ring.</h2>
            <p className="max-w-[62ch] text-[16px] text-steel">
              Your coach is Zakaria “Zack” Benbouchta, a certified athletic therapist and a fighter with 50+ bouts,
              including Karate Combat. You get the science of rehab, strength and nutrition from someone who has lived
              the injuries, camps and weight cuts himself.
            </p>
          </div>
          <Link href="/about" className="inline-flex items-center gap-2 self-start font-mono text-[12px] uppercase tracking-[0.12em] text-blue hover:text-charcoal lg:self-center">
            Meet Zack <Arrow />
          </Link>
        </div>
        <StatsRow className="border-t border-line pt-8" />
      </Container>
    </section>
  );
}

/* ───────────────────────── Press ───────────────────────── */

export function Press({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <section className={cn("py-20 sm:py-28", dark ? "bg-charcoal" : "bg-off-white")}>
      <Container className="flex flex-col gap-10">
        <SectionHeading dark={dark} eyebrow="In the press" title="On camera and in the arena." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {press.map((p) => (
            <a
              key={p.href}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex flex-col overflow-hidden rounded-[6px] border transition-colors",
                dark ? "border-line-dark bg-charcoal-2 hover:border-blue" : "border-line bg-paper hover:border-charcoal",
              )}
            >
              <span className="relative block aspect-video overflow-hidden bg-charcoal">
                <Image src={p.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/80 text-white">
                    <svg viewBox="0 0 20 20" className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true"><path d="M5 3l12 7-12 7V3z" /></svg>
                  </span>
                </span>
              </span>
              <span className="flex flex-1 flex-col gap-2 p-5">
                <span className={cn("eyebrow text-[11px]", dark ? "text-blue-pale" : "text-blue")}>{p.outlet}</span>
                <span className={cn("text-[16px] font-semibold leading-snug", dark ? "text-off-white" : "text-charcoal")}>{p.title}</span>
                <span className={cn("mt-auto pt-2 font-mono text-[11px] uppercase tracking-[0.12em]", dark ? "text-steel-light" : "text-steel")}>{p.kind} ↗</span>
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────── Recently posted ───────────────────────── */

export function RecentlyPosted() {
  return (
    <section className="overflow-hidden bg-ink py-20 text-off-white sm:py-28">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14 [&>*]:min-w-0">
        <div className="flex flex-col gap-6">
          <Eyebrow className="text-blue-pale">Recently posted</Eyebrow>
          <h2 className="display text-[44px] sm:text-[56px]">Free advice, every week.</h2>
          <p className="text-[17px] text-mist">
            Short videos on pain, injuries, training and fight science. Learn something today, before you ever sign up.
          </p>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-[6px] border border-line-dark bg-charcoal-2 p-4 transition-colors hover:border-blue"
          >
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-blue">
              <Image src="/images/zack/fight-win.jpg" alt="" fill sizes="56px" className="object-cover object-[60%_20%]" />
            </span>
            <span className="flex flex-1 flex-col">
              <span className="font-semibold">{instagram.handle}</span>
              <span className="text-[13px] text-steel-light">{instagram.followers} followers · {instagram.posts} posts</span>
            </span>
            <span className="rounded-[4px] bg-blue px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em]">Follow</span>
          </a>
          <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] uppercase tracking-[0.12em] text-steel-light hover:text-white">
            Also on TikTok ↗
          </a>
        </div>
        <Scroller label="recent videos" tone="dark">
          {reels.map((r, i) => (
            <a
              key={r.href}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("group relative block aspect-[9/16] w-[200px] shrink-0 snap-start overflow-hidden rounded-[10px] bg-charcoal ring-1 ring-white/10 sm:w-[220px]", i % 2 === 1 && "md:mt-10")}
            >
              <Image src={r.image} alt="" fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-white">
                <svg viewBox="0 0 20 20" className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden="true"><path d="M5 3l12 7-12 7V3z" /></svg>
              </span>
              <span className="absolute inset-x-0 bottom-0 p-4 text-[15px] font-semibold leading-snug">{r.title}</span>
            </a>
          ))}
        </Scroller>
      </Container>
    </section>
  );
}

/* ───────────────────────── Talk to Zack ───────────────────────── */

export function TalkCta({ title = "Not sure where to start?" }: { title?: string }) {
  return (
    <section id="talk" className="relative isolate overflow-hidden bg-charcoal py-20 text-off-white sm:py-24">
      <Image src="/images/goals/strong.jpg" alt="" fill sizes="100vw" className="parallax-bg -z-20 object-cover object-center opacity-30" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="flex max-w-[640px] flex-col gap-4">
          <Eyebrow className="text-blue-pale">Talk to Zack</Eyebrow>
          <h2 className="display text-[48px] leading-[0.92] sm:text-[68px]">{title}</h2>
          <p className="text-[18px] text-mist">
            Tell Zack what you&apos;re dealing with and what you want. He reads every message himself and replies within
            24 hours.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" size="lg">Talk to Zack <Arrow /></Button>
          <Button href="/programs" size="lg" variant="ghost-light">See programs</Button>
        </div>
      </Container>
    </section>
  );
}
