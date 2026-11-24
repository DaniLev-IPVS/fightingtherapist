import Image from "next/image";
import Link from "next/link";
import { offers, type Offer } from "@/content/site";
import { Arrow, Button, Container, SectionHeading, cn } from "@/components/ui";

/** Homepage shelf, Jeff Nippard style: every offer side by side. */
export function ProgramShelf() {
  return (
    <section className="bg-charcoal py-24 text-off-white sm:py-32">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading dark eyebrow="Programs" title="Find your program." intro="All coaching is online, so you can work with Zack from anywhere." />
          <Link href="/programs" className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-blue-pale hover:text-white">
            View all <Arrow />
          </Link>
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {offers.slice(0, 4).map((o) => (
            <ProgramCard key={o.key} offer={o} />
          ))}
        </div>
        <p className="text-[15px] text-steel-light">
          Guides and video lessons you can buy and start today are coming soon.
        </p>
      </Container>
    </section>
  );
}

function ProgramCard({ offer }: { offer: Offer }) {
  return (
    <Link
      href={`/programs#${offer.key}`}
      className="group flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-[6px] border border-line-dark bg-charcoal-2 transition-colors hover:border-blue sm:w-[46%] lg:w-auto"
    >
      <span className="relative block aspect-[4/3] overflow-hidden">
        <Image src={offer.image} alt={offer.imageAlt} fill sizes="(min-width: 1024px) 25vw, 78vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </span>
      <span className="flex flex-1 flex-col gap-3 p-5">
        <span className="eyebrow text-[11px] text-blue-pale">Online coaching</span>
        <span className="display text-[28px] leading-[0.95]">{offer.name}</span>
        <span className="text-[15px] text-mist">{offer.tagline}</span>
        <span className="mt-auto inline-flex items-center gap-2 pt-3 font-mono text-[12px] uppercase tracking-[0.12em] text-blue-pale group-hover:text-white">
          Learn more <Arrow />
        </span>
      </span>
    </Link>
  );
}

/** Full offer block on /programs. Alternates image side. */
export function OfferBlock({ offer, index }: { offer: Offer; index: number }) {
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
            <Button href={`/contact?goal=${offer.key}`}>Apply for {offer.name}</Button>
          </div>
        </div>
      </div>
    </article>
  );
}
