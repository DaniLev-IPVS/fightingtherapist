import type { Metadata, Viewport } from "next";
import { Saira_Condensed, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AttributionCapture } from "@/components/attribution-capture";
import { StickyCta } from "@/components/sticky-cta";

const saira = Saira_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-saira",
  display: "swap",
});
const source = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "The Fighting Therapist | Fight-tested rehab, training and nutrition",
    template: "%s | The Fighting Therapist",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: "/images/hero/zack-studio.jpg", width: 2000, height: 857, alt: "Zack Benbouchta, The Fighting Therapist" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#0e1a2b",
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.person,
  alternateName: "Zack Benbouchta",
  jobTitle: "Certified Athletic Therapist and fighter",
  url: site.url,
  email: site.email,
  sameAs: Object.values(site.social),
  worksFor: { "@type": "Organization", name: site.name, url: site.url },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${saira.variable} ${source.variable} ${jetbrains.variable}`}>
      <body>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
