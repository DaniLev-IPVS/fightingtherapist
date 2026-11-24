import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui";

/** Dark band that opens every inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt = "",
  imagePosition = "70% 30%",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-off-white">
      {image && (
        <>
          <Image src={image} alt={imageAlt} fill preload sizes="100vw" className="-z-20 object-cover" style={{ objectPosition: imagePosition }} />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,16,28,0.95)_0%,rgba(9,16,28,0.75)_45%,rgba(9,16,28,0.2)_100%)] max-md:bg-[rgba(9,16,28,0.8)]" />
        </>
      )}
      <Container className="flex flex-col gap-6 pb-20 pt-36 sm:pb-24 sm:pt-44">
        <p className="eyebrow text-blue-pale">{eyebrow}</p>
        <h1 className="display max-w-[14ch] text-[56px] leading-[0.9] sm:text-[80px] lg:text-[96px]">{title}</h1>
        {intro && <p className="max-w-[52ch] text-[19px] text-mist">{intro}</p>}
        {children}
      </Container>
    </section>
  );
}
