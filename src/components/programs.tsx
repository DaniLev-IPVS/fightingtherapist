import Image from "next/image";
import Link from "next/link";
import { offers, type Offer } from "@/content/site";
import { Arrow, Button, Container, SectionHeading, cn } from "@/components/ui";

const steps = ["Pick your program", "Get a plan built for you", "Train with weekly check-ins"];

/**
 * Homepage programs: a bento of big image cards, with the three steps folded
 * into the header so "how it works" isn't a separate section.
 */
export function ProgramShelf() {
  const [lead, ...rest] = offers;
  return (
    <section className="bg-off-white py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Programs" title="Find your program." intro="Every program is coached online, so you can start this week from anywhere." />
          <ol className="flex flex-wrap gap-x-6 gap-y-3 lg:max-w-[520px] lg:justify-end">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2.5 text-[14px] font-semibold text-charcoal">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal font-mono text-[12px] text-off-white">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:h-[680px] lg:grid-cols-4 lg:grid-rows-2">
          <ProgramTile offer={lead} large className="sm:col-span-2 lg:row-span-2" />
          {rest.map((o) => (
            <ProgramTile key={o.key} offer={o} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProgramTile({ offer, large = false, className }: { offer: Offer; large?: boolean; className?: string }) {
  return (
    <Link
      href={`/programs#${offer.key}`}
      data-tilt
      className={cn("group relative flex min-h-[320px] overflow-hidden rounded-[6px] bg-charcoal text-off-white", large && "min-h-[440px]", className)}
    >
      <Image
        src={offer.image}
        alt={offer.imageAlt}
        fill
        sizes={large ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
      <span className="relative mt-auto flex w-full flex-col gap-2 p-5 sm:p-6">
        <span className="eyebrow text-[11px] text-blue-pale">{offer.name}</span>
        <span className={cn("display leading-[0.92]", large ? "text-[44px] sm:text-[56px]" : "text-[30px]")}>{offer.outcome}</span>
        {large && <span className="max-w-[44ch] text-[16px] text-mist">{offer.tagline} {offer.forWho}</span>}
        <span className="mt-1 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-blue-pale group-hover:text-white">
          See the program <Arrow />
        </span>
      </span>
    </Link>
  );
}

/** Full offer block on /programs. Alternates image side. */
export function OfferBlock({ offer, index, href }: { offer: Offer; index: number; href?: string }) {
  const flip = index % 2 === 1;
  return (
    <article id={offer.key} className="scroll-mt-28 border-t border-line py-16 first:border-t-0 sm:py-20">
      <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", flip && "lg:[&>*:first-child]:order-2")}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-charcoal">
          <Image src={offer.image} alt={offer.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col gap-5">
          <p className="eyebrow text-blue">Online coaching</p>
          <h2 className="display text-[44px] text-charcoal sm:text-[56px]">{offer.name}</h2>
          <p className="text-[22px] font-semibold leading-snug text-charcoal">{offer.tagline}</p>
          <p className="text-[17px] text-steel">
            <span className="font-semibold text-charcoal">For: </span>
            {offer.forWho}
          </p>
          <ul className="flex flex-col gap-2.5">
            {offer.includes.map((item) => (
              <li key={item} className="flex gap-3 text-[16px] text-charcoal">
                <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-blue" fill="none" aria-hidden="true">
                  <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-steel">{offer.terms}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            {href ? (
              <>
                <Button href={href}>See the full program <Arrow /></Button>
                <Button href={`/contact?goal=${offer.key}`} variant="ghost-dark">Apply now</Button>
              </>
            ) : (
              <Button href={`/contact?goal=${offer.key}`}>Apply for {offer.name}</Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
