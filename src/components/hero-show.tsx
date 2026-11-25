"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Arrow, Button, Container, cn } from "@/components/ui";

export type HeroCard = { key: string; label: string; title: string; href: string; image: string; alt: string };
/** Words for one slide: its own headline, subheadline and main button. */
export type HeroCopy = { headline: string; sub: string; cta: { label: string; href: string } };

const DURATION = 6500;
const MOTION = "(prefers-reduced-motion: reduce)";
const prefersReduced = () => window.matchMedia(MOTION).matches;
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia(MOTION);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Homepage hero that cycles full-size through Zack, then each service card's scene.
 * The active card lights up with a progress bar; hovering a card (or tapping a
 * segment) shows its slide. A segment bar drives the timing, so pausing on hover
 * resumes exactly where it stopped.
 */
export function HeroShow({
  backgrounds,
  cards,
  copy,
  eyebrow,
  children,
}: {
  backgrounds: ReactNode[];
  cards: HeroCard[];
  copy: HeroCopy[];
  eyebrow: string[];
  /** The proof line under the buttons, the same on every slide. */
  children: ReactNode;
}) {
  const count = backgrounds.length;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  // Reduced motion starts paused; the visitor can still press play or switch by hand.
  const reduced = useSyncExternalStore(subscribeMotion, prefersReduced, () => false);
  const [toggled, setToggled] = useState<boolean | null>(null);
  const stopped = toggled ?? reduced;
  const [offscreen, setOffscreen] = useState(false);
  const section = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const lastTouch = useRef(0);

  // Pause while the hero is scrolled away or the tab is in the background.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    const vis = () => setOffscreen(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  // On phones the card row scrolls sideways: bring the active card into view unless the visitor is swiping it.
  useEffect(() => {
    const el = row.current;
    if (!el || active === 0 || el.scrollWidth <= el.clientWidth + 4) return;
    if (Date.now() - lastTouch.current < 8000) return;
    const card = el.children[active - 1] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - 20, behavior: "smooth" });
  }, [active]);

  const paused = hovering || stopped || offscreen;
  const next = () => setActive((a) => (a + 1) % count);
  const playState = { animationPlayState: paused ? "paused" : "running", animationDuration: `${DURATION}ms` } as const;

  return (
    <section ref={section} data-no-reveal className="relative isolate overflow-hidden bg-charcoal text-off-white">
      <div aria-hidden="true" className="hero-parallax absolute inset-0 -z-20">
        {backgrounds.map((bg, i) => (
          <div key={i} className={cn("hero-slide absolute inset-0", i === active ? "is-active" : "")}>
            {bg}
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,16,28,0.96)_0%,rgba(9,16,28,0.78)_36%,rgba(9,16,28,0.2)_64%,rgba(9,16,28,0)_100%)] max-md:bg-[linear-gradient(0deg,rgba(9,16,28,0.98)_0%,rgba(9,16,28,0.82)_48%,rgba(9,16,28,0.2)_82%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-t from-charcoal to-transparent" />

      <Container className="flex min-h-[94svh] flex-col justify-end pb-10 pt-32 md:pb-14 md:pt-40">
        <div className="hero-copy flex max-w-[720px] flex-col gap-6 max-md:mt-[34vh]">
          <p className="eyebrow flex flex-wrap gap-x-2 text-blue-pale">
            {eyebrow.map((word, i) => (
              <span key={word} className="contents">
                {i > 0 && <span aria-hidden="true">·</span>}
                <span className={cn("transition-colors duration-500", active === i + 1 && "text-white")}>{word}</span>
              </span>
            ))}
          </p>
          {/* Every slide's words sit in the same grid cell, so the block keeps the height of the longest and nothing jumps. */}
          <div className="grid">
            {copy.map((c, i) => {
              const on = i === active;
              const Heading = i === 0 ? "h1" : "p";
              return (
                <div
                  key={c.headline}
                  aria-hidden={!on}
                  className={cn(
                    "col-start-1 row-start-1 flex flex-col gap-6 transition-[opacity,transform] duration-700",
                    on ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
                  )}
                >
                  <Heading className="display text-[52px] leading-[0.9] sm:text-[80px] lg:text-[100px]">{c.headline}</Heading>
                  <p className="max-w-[46ch] text-[18px] text-mist sm:text-[20px]">{c.sub}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button href={c.cta.href} size="lg" tabIndex={on ? undefined : -1}>
                      {c.cta.label} <Arrow />
                    </Button>
                    <Button href="/contact" size="lg" variant="ghost-light" tabIndex={on ? undefined : -1}>
                      Talk to Zack
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          {children}
        </div>

        <div className="mt-12 flex flex-col gap-3 md:mt-16">
          {/* Story-style segments: one per slide, the active one fills over time. */}
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-1.5 md:max-w-[260px]">
              {backgrounds.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${i === 0 ? "Zack" : cards[i - 1]?.label}`}
                  aria-current={i === active}
                  className="group relative h-6 flex-1"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/20 group-hover:bg-white/35">
                    {i < active && <span className="absolute inset-0 bg-white/70" />}
                    {i === active && (
                      <span
                        key={`${active}-${stopped}`}
                        onAnimationEnd={next}
                        className={cn("absolute inset-0 origin-left bg-white", stopped ? "" : "animate-[hero-fill_linear_forwards]")}
                        style={stopped ? undefined : playState}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setToggled(!stopped)}
              aria-pressed={stopped}
              aria-label={stopped ? "Play the slideshow" : "Pause the slideshow"}
              className="grid h-8 w-8 place-items-center rounded-full border border-white/25 text-white hover:border-white/60"
            >
              {stopped ? (
                <svg viewBox="0 0 16 16" className="ml-0.5 h-3 w-3" fill="currentColor" aria-hidden="true"><path d="M4 2.5l9 5.5-9 5.5z" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden="true"><path d="M4 2h3v12H4zM9 2h3v12H9z" /></svg>
              )}
            </button>
          </div>

          <div
            ref={row}
            onPointerDown={() => (lastTouch.current = Date.now())}
            onTouchStart={() => (lastTouch.current = Date.now())}
            className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((card, i) => {
              const on = active === i + 1;
              return (
                <Link
                  key={card.key}
                  href={card.href}
                  onMouseEnter={() => {
                    setHovering(true);
                    setActive(i + 1);
                  }}
                  onMouseLeave={() => setHovering(false)}
                  onFocus={() => setActive(i + 1)}
                  className={cn(
                    "group relative block aspect-[4/5] w-[74%] shrink-0 snap-start overflow-hidden rounded-[8px] bg-charcoal-2 ring-1 transition-[transform,box-shadow] duration-500 md:aspect-[4/3] md:w-auto lg:aspect-[16/11]",
                    on ? "-translate-y-1 shadow-[0_18px_40px_rgba(10,143,214,0.25)] ring-2 ring-blue-bright" : "ring-white/10",
                  )}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 74vw"
                    className={cn("object-cover object-[74%_50%] transition-transform duration-700 group-hover:scale-[1.04] md:object-[70%_50%]", on && "scale-[1.04]")}
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                    <div className="flex flex-col gap-1">
                      <span className="eyebrow text-[11px] text-blue-pale">{card.label}</span>
                      <span className="display text-[26px] leading-[0.95] text-off-white sm:text-[30px]">{card.title}</span>
                    </div>
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-white transition-colors group-hover:border-blue group-hover:bg-blue",
                        on ? "border-blue bg-blue" : "border-white/30",
                      )}
                    >
                      <Arrow />
                    </span>
                  </div>
                  {on && (
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
                      <span
                        key={`${active}-${stopped}`}
                        className={cn("absolute inset-0 origin-left bg-blue-bright", stopped ? "" : "animate-[hero-fill_linear_forwards]")}
                        style={stopped ? undefined : playState}
                      />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
