import Image from "next/image";
import Link from "next/link";
import { offers, site } from "@/content/site";
import { Container } from "@/components/ui";

const socialLinks = [
  { href: site.social.instagram, label: "Instagram" },
  { href: site.social.tiktok, label: "TikTok" },
  { href: site.social.youtube, label: "YouTube" },
  { href: site.social.linkedin, label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="bg-ink pb-28 pt-16 text-mist md:pb-12">
      <Container className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Image src="/images/logo-light.png" alt="The Fighting Therapist" width={96} height={67} className="h-[56px] w-auto self-start" />
          <p className="max-w-[34ch] text-[15px]">
            Fight-tested rehab, training and nutrition from {site.person}, CAT(C) athletic therapist and fighter.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="eyebrow text-blue-pale">Programs</p>
          {offers.map((o) => (
            <Link key={o.key} href={`/programs#${o.key}`} className="text-[15px] hover:text-white">
              {o.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <p className="eyebrow text-blue-pale">Company</p>
          <Link href="/about" className="text-[15px] hover:text-white">About Zack</Link>
          <Link href="/results" className="text-[15px] hover:text-white">Results</Link>
          <Link href="/contact" className="text-[15px] hover:text-white">Contact</Link>
          <Link href="/privacy" className="text-[15px] hover:text-white">Privacy policy</Link>
        </div>

        <div className="flex flex-col gap-3">
          <p className="eyebrow text-blue-pale">Contact</p>
          <a href={`mailto:${site.email}`} className="text-[15px] hover:text-white">{site.email}</a>
          <a href={site.phoneHref} className="text-[15px] hover:text-white">{site.phone}</a>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] uppercase tracking-[0.12em] hover:text-white">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
      <Container className="mt-14 flex flex-col gap-2 border-t border-line-dark pt-6 text-[13px] text-steel-light sm:flex-row sm:justify-between">
        <p>© {site.name}. All rights reserved.</p>
        <p>Online coaching, wherever you train.</p>
      </Container>
    </footer>
  );
}
