import Image from "next/image";
import Link from "next/link";
import { goals, press, pressLogos, reviews, serviceCards, site, stats, type Review } from "@/content/site";
import { Arrow, Button, Container, Eyebrow, SectionHeading, Stars, cn } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";

/* ───────────────────────── Hero ───────────────────────── */

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-off-white">
      <Image
        src="/images/hero/home.jpg"
        alt="Zack Benbouchta with arms crossed in a training studio with a treatment table and heavy bag behind him"
        fill
        preload
        sizes="100vw"
        quality={85}
        className="-z-20 object-cover object-[72%_30%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,16,28,0.95)_0%,rgba(9,16,28,0.72)_38%,rgba(9,16,28,0.15)_68%,rgba(9,16,28,0)_100%)] max-md:bg-[linear-gradient(0deg,rgba(9,16,28,0.98)_0%,rgba(9,16,28,0.8)_45%,rgba(9,16,28,0.25)_80%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-charcoal to-transparent" />

      <Container className="flex min-h-[92svh] flex-col justify-end pb-10 pt-32 md:pb-14 md:pt-40">
        <div className="flex max-w-[620px] flex-col gap-6 max-md:mt-[38vh]">
          <p className="eyebrow text-blue-pale">Rehab · Training · Nutrition</p>
          <h1 className="display text-[64px] leading-[0.88] sm:text-[96px] lg:text-[120px]">
            Fight-tested
            <br />
            coaching.
          </h1>
          <p className="max-w-[46ch] text-[19px] text-mist sm:text-[21px]">
            Get out of pain, get strong and eat right, with a plan built by an athletic therapist who fights.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/programs" size="lg">
              Find your program <Arrow />
            </Button>
            <Button href="/results" size="lg" variant="ghost-light">
              See results
            </Button>
          </div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] uppercase tracking-[0.1em] text-steel-light">
            <span className="text-off-white">Zack Benbouchta</span>
            <span aria-hidden="true">·</span>
            <span>CAT(C)</span>
            <span aria-hidden="true">·</span>
            <span>50+ fights</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Stars className="text-[13px]" /> 5.0 from 69 reviews
            </span>
          </p>
        </div>

        <ServiceCards className="mt-12 md:mt-16" />
      </Container>
    </section>
  );
}

/** Three cards that each cycle through their photos, like Jeff Nippard's product row. */
export function ServiceCards({ className }: { className?: string }) {
  return (
    <div className={cn("-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0", className)}>
      {serviceCards.map((card) => {
        const n = card.images.length;
        const cycle = n === 3 ? "animate-fade-3" : "animate-fade-2";
        const delays = n === 3 ? ["-1s", "2s", "5s"] : ["-0.5s", "2.5s"];
        return (
          <Link
            key={card.key}
            href={`/programs#${card.key}`}
            className="group relative block aspect-[4/5] w-[74%] shrink-0 snap-start overflow-hidden rounded-[6px] bg-charcoal-2 ring-1 ring-white/10 md:aspect-[4/3] md:w-auto lg:aspect-[16/11]"
          >
            {card.images.map((img, i) => (
              <Image
                key={img.src}
                src={img.src}
                alt={i === 0 ? img.alt : ""}
                fill
                sizes="(min-width: 768px) 33vw, 74vw"
                className={cn("object-cover transition-transform duration-700 group-hover:scale-[1.04]", cycle, i === 0 ? "opacity-100" : "opacity-0")}
                style={{ animationDelay: delays[i] }}
              />
            ))}
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
              <div className="flex flex-col gap-1">
                <span className="eyebrow text-[11px] text-blue-pale">{card.label}</span>
                <span className="display text-[26px] leading-[0.95] text-off-white sm:text-[30px]">{card.title}</span>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors group-hover:border-blue group-hover:bg-blue">
                <Arrow />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Proof bar ───────────────────────── */

export function ProofBar() {
  return (
    <section aria-label="As seen on" className="border-y border-line-dark bg-charcoal py-8 text-steel-light">
      <Container className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
        <p className="eyebrow shrink-0 text-[11px]">As seen on / fought for</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 md:justify-end">
          {pressLogos.map((name) => (
            <li key={name} className="display text-[22px] tracking-[0.04em] text-mist/80 sm:text-[26px]">
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ───────────────────────── Testimonials ───────────────────────── */

export function ReviewCard({ review, tone = "light", large = false }: { review: Review; tone?: "light" | "dark"; large?: boolean }) {
  const dark = tone === "dark";
  return (
    <figure
      className={cn(
        "flex h-full flex-col gap-4 rounded-[6px] border p-6 sm:p-7",
        dark ? "border-line-dark bg-charcoal-2" : "border-line bg-paper",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Stars className="text-[15px]" />
        <span className={cn("eyebrow text-[10.5px]", dark ? "text-blue-pale" : "text-blue")}>{review.tag}</span>
      </div>
      <p className={cn("display leading-[0.95]", large ? "text-[34px]" : "text-[26px]", dark ? "text-off-white" : "text-charcoal")}>
        {review.headline}
      </p>
      <blockquote className={cn("flex-1 text-[16px] leading-relaxed", dark ? "text-mist" : "text-steel")}>
        “{review.quote}”
      </blockquote>
      <figcaption className={cn("font-mono text-[12px] uppercase tracking-[0.12em]", dark ? "text-steel-light" : "text-charcoal")}>
        {review.name} · Google review
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const featured = reviews.filter((r) => r.featured);
  const more = reviews.filter((r) => !r.featured).slice(0, 6);
  return (
    <section className="bg-off-white py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
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
        <div className="grid gap-5 lg:grid-cols-3">
          {featured.map((r) => (
            <ReviewCard key={r.name} review={r} large />
          ))}
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:thin]">
          {more.map((r) => (
            <div key={r.name} className="w-[300px] shrink-0 snap-start sm:w-[360px]">
              <ReviewCard review={r} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────── What brings you here ───────────────────────── */

const goalIcons: Record<string, React.ReactNode> = {
  rehab: <path d="M12 4v16M4 12h16" strokeWidth="2.2" strokeLinecap="round" />,
  training: <path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12" strokeWidth="2" strokeLinecap="round" />,
  nutrition: <path d="M7 3v8a3 3 0 0 0 3 3v7M7 3v5M10 3v5M17 3c-2 2-3 4-3 7s1 4 3 4v7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  "fight-camp": <path d="M8 4h6a4 4 0 0 1 4 4v4a6 6 0 0 1-6 6H9a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2zM6 11h6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
};

export function Goals() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Pick your fight" title="What brings you here?" intro="Start with the problem. Zack builds the plan around it." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {goals.map((g) => (
            <Link
              key={g.key}
              href={`/programs#${g.key}`}
              className="group flex flex-col gap-6 rounded-[6px] border border-line bg-off-white p-6 transition-colors hover:border-charcoal hover:bg-charcoal"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-wash text-blue transition-colors group-hover:bg-blue group-hover:text-white">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" aria-hidden="true">
                  {goalIcons[g.key]}
                </svg>
              </span>
              <span className="flex flex-col gap-2">
                <span className="display text-[30px] leading-[0.95] text-charcoal transition-colors group-hover:text-off-white">{g.title}</span>
                <span className="text-[15px] text-steel transition-colors group-hover:text-mist">{g.text}</span>
              </span>
              <span className="mt-auto inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-blue group-hover:text-blue-pale">
                See the program <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────── Numbers ───────────────────────── */

export function StatsBand() {
  return (
    <section aria-label="Zack in numbers" className="bg-charcoal py-16 text-off-white sm:py-20">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 border-l-2 border-blue pl-5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="display flex items-baseline gap-2 text-[64px] leading-none sm:text-[84px]">
                {s.value}
                {s.star && <Stars className="text-[22px]" label="stars" />}
              </dd>
              <dd className="text-[15px] text-mist" aria-hidden="true">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ───────────────────────── Meet Zack ───────────────────────── */

export function MeetZack() {
  return (
    <section className="bg-off-white py-24 sm:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-charcoal sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src="/images/zack/fight-punch.jpg"
            alt="Zack landing a punch during a Karate Combat fight"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[60%_center]"
          />
          <div className="absolute bottom-0 left-0 m-4 rounded-[4px] bg-ink/85 px-4 py-3 backdrop-blur">
            <p className="eyebrow text-[10.5px] text-blue-pale">In the clinic and in the ring</p>
            <p className="display text-[22px] text-off-white">CAT(C) · 50+ fights</p>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <Eyebrow>Meet Zack</Eyebrow>
          <h2 className="display text-[44px] text-charcoal sm:text-[60px]">
            Studied it in the clinic.
            <br />
            <span className="text-blue">Proved it in the ring.</span>
          </h2>
          <div className="flex max-w-[58ch] flex-col gap-4 text-[18px] text-steel">
            <p>
              Zakaria “Zack” Benbouchta is a certified athletic therapist, CAT(C), with more than ten years treating and
              coaching athletes. He is also a fighter, with 50+ amateur and pro bouts, including Karate Combat.
            </p>
            <p>
              That mix is the method. He knows the science of rehab, strength and nutrition, and he has felt what a hard
              camp, a weight cut and an injury do to a body. Every plan treats performance and durability as equal goals.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button href="/about">His story</Button>
            <Button href="/programs" variant="ghost-dark">Work with Zack</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────── How it works ───────────────────────── */

const steps = [
  { title: "Pick your program", text: "Choose rehab, training, nutrition or fight camp, or tell Zack what's going on and he'll point you to the right one." },
  { title: "Get your plan", text: "Zack reviews your injury, goals, schedule and equipment, then builds a program for you. Not a template." },
  { title: "Train with check-ins", text: "Follow the plan on your phone. Zack checks in, answers questions and adjusts as you progress." },
];

export function HowItWorks() {
  return (
    <section className="bg-paper py-24 sm:py-32">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="How it works" title="Three steps. Then the work." />
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-4 rounded-[6px] border border-line bg-off-white p-7">
              <span className="font-mono text-[13px] text-blue">Step {i + 1}</span>
              <span className="display text-[32px] leading-[0.95] text-charcoal">{s.title}</span>
              <span className="text-[16px] text-steel">{s.text}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ───────────────────────── Press ───────────────────────── */

export function Press({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <section className={cn("py-24 sm:py-32", dark ? "bg-charcoal" : "bg-off-white")}>
      <Container className="flex flex-col gap-12">
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

/* ───────────────────────── Social strip ───────────────────────── */

const socialTiles = [
  { src: "/images/zack/treating.jpg", alt: "Zack treating a client", caption: "Resting your back injury isn't the best plan" },
  { src: "/images/zack/fight-kick.jpg", alt: "Zack throwing a head kick in a fight", caption: "Fight breakdown: the overhand right that finished Benn" },
  { src: "/images/zack/coaching-wide.jpg", alt: "Zack coaching a kettlebell press", caption: "Two types of pain every grappler should know" },
  { src: "/images/zack/fight-win.jpg", alt: "Zack with arms raised after a win", caption: "The two mistakes that keep injuries coming back" },
];

export function SocialStrip() {
  return (
    <section className="bg-paper py-24 sm:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="@the.fighting.therapist" title="Free advice, daily." intro="Short videos on pain, injuries, training and fight science. Follow along before you sign up." />
          <div className="flex gap-3">
            <Button href={site.social.instagram} variant="ghost-dark">Instagram</Button>
            <Button href={site.social.tiktok} variant="ghost-dark">TikTok</Button>
          </div>
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {socialTiles.map((t) => (
            <a key={t.src} href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[9/14] w-[62%] shrink-0 snap-start overflow-hidden rounded-[6px] bg-charcoal md:w-auto">
              <Image src={t.src} alt={t.alt} fill sizes="(min-width: 768px) 25vw, 62vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-4 text-[15px] font-semibold leading-snug text-off-white">{t.caption}</span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────────── Contact block ───────────────────────── */

export function ContactBlock({ title = "Not sure which program fits?", pageType = "home" as const }: { title?: string; pageType?: "home" | "programs" | "other" }) {
  return (
    <section id="contact" className="bg-charcoal py-24 text-off-white sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <Eyebrow className="text-blue-pale">Talk to Zack</Eyebrow>
          <h2 className="display text-[48px] sm:text-[64px]">{title}</h2>
          <p className="max-w-[46ch] text-[18px] text-mist">
            Tell Zack what you&apos;re dealing with. He reads every message himself and will point you to the right
            program, usually within 24 hours.
          </p>
          <div className="flex flex-col gap-2 text-[16px] text-mist">
            <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            <a href={site.phoneHref} className="hover:text-white">{site.phone}</a>
          </div>
        </div>
        <LeadForm tone="dark" pageType={pageType} submitLabel="Send to Zack" />
      </Container>
    </section>
  );
}
