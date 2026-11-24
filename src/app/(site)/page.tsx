import { Goals, Hero, Press, ProofBar, RecentlyPosted, TalkCta, Testimonials, WhyItWorks } from "@/components/sections";
import { ProgramShelf } from "@/components/programs";

/** Section order from Daniel's round-3 notes: outcome first, Zack only as proof. */
export default function Home() {
  return (
    <>
      <Hero />
      <ProofBar />
      <Testimonials />
      <Goals />
      <WhyItWorks />
      <ProgramShelf />
      <Press />
      <RecentlyPosted />
      <TalkCta />
    </>
  );
}
