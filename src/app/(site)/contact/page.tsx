import type { Metadata } from "next";
import { site } from "@/content/site";
import { LeadForm } from "@/components/lead-form";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell Zack about your injury or goal. He replies to every message himself, usually within 24 hours.",
};

export default function ContactPage() {
  return (
    <section className="bg-charcoal text-off-white">
      <Container className="grid gap-14 pb-24 pt-36 sm:pt-44 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <Eyebrow className="text-blue-pale">Contact</Eyebrow>
          <h1 className="display text-[56px] leading-[0.9] sm:text-[80px]">Tell Zack what&apos;s going on.</h1>
          <p className="max-w-[46ch] text-[19px] text-mist">
            Injury, goal, fight date, or just a question. Zack reads every message himself and replies within 24 hours,
            usually by email.
          </p>
          <dl className="mt-4 flex flex-col gap-4 text-[16px]">
            <div>
              <dt className="eyebrow text-[11px] text-steel-light">Email</dt>
              <dd><a href={`mailto:${site.email}`} className="text-off-white hover:text-blue-pale">{site.email}</a></dd>
            </div>
            <div>
              <dt className="eyebrow text-[11px] text-steel-light">Phone</dt>
              <dd><a href={site.phoneHref} className="text-off-white hover:text-blue-pale">{site.phone}</a></dd>
            </div>
            <div>
              <dt className="eyebrow text-[11px] text-steel-light">Where</dt>
              <dd className="text-mist">Online coaching, wherever you train</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-[6px] border border-line-dark bg-charcoal-2/60 p-6 sm:p-8">
          <LeadForm tone="dark" pageType="contact" submitLabel="Send to Zack" goalFromUrl />
        </div>
      </Container>
    </section>
  );
}
