import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AttributionCapture } from "@/components/attribution-capture";
import { ScrollEffects } from "@/components/scroll-effects";
import { StickyCta } from "@/components/sticky-cta";

/** Public site chrome. The admin lives outside this group and has its own layout. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-blue focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <StickyCta />
      <AttributionCapture />
      <ScrollEffects />
    </>
  );
}
