import {
  ContactBlock,
  Goals,
  Hero,
  HowItWorks,
  MeetZack,
  Press,
  ProofBar,
  SocialStrip,
  StatsBand,
  Testimonials,
} from "@/components/sections";
import { ProgramShelf } from "@/components/programs";

/** Section order approved in step 3, round 2. */
export default function Home() {
  return (
    <>
      <Hero />
      <ProofBar />
      <Testimonials />
      <Goals />
      <StatsBand />
      <MeetZack />
      <HowItWorks />
      <ProgramShelf />
      <Press />
      <SocialStrip />
      <ContactBlock />
    </>
  );
}
