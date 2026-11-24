import type { Metadata } from "next";
import { site } from "@/content/site";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy policy",
  robots: { index: false },
};

// DRAFT: plain-language summary written for the rebuild. Have it reviewed before launch.
export default function PrivacyPage() {
  return (
    <section className="bg-paper pb-24 pt-36 sm:pt-44">
      <Container className="max-w-[760px]">
        <h1 className="display text-[56px] text-charcoal">Privacy policy</h1>
        <div className="mt-8 flex flex-col gap-5 text-[17px] text-steel [&_h2]:mt-6 [&_h2]:text-[28px] [&_h2]:text-charcoal">
          <p>This page explains what {site.name} collects when you use this site and how it is used.</p>
          <h2 className="display">What we collect</h2>
          <p>
            When you send a form, we collect what you enter: your name, email, phone number if you give it, your goal and
            your message. We also record how you found the site, such as the link or campaign you came from and the page
            you sent the form on.
          </p>
          <h2 className="display">How we use it</h2>
          <p>
            We use it to reply to you, to coach you if you become a client, and to understand which channels bring people
            to the site. We don&apos;t sell your information.
          </p>
          <h2 className="display">Your choices</h2>
          <p>
            To see, correct or delete what we hold about you, email{" "}
            <a href={`mailto:${site.email}`} className="text-blue underline">{site.email}</a>.
          </p>
        </div>
      </Container>
    </section>
  );
}
