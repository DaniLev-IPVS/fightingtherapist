import Image from "next/image";
import Link from "next/link";
import { AttributionCapture } from "@/components/attribution-capture";
import { ScrollEffects } from "@/components/scroll-effects";
import { site } from "@/content/site";

/** Landing pages: logo only, no menu, so the form is the one thing to do. */
export default function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="gutter mx-auto flex h-[72px] max-w-[1240px] items-center">
          <Link href="/" aria-label="The Fighting Therapist, home">
            <Image src="/images/logo-light.png" alt="The Fighting Therapist" width={96} height={67} className="h-[48px] w-auto" />
          </Link>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="bg-ink py-8 text-[13px] text-steel-light">
        <div className="gutter mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3">
          <p>© {site.name}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
          </div>
        </div>
      </footer>
      <AttributionCapture />
      <ScrollEffects />
    </>
  );
}
