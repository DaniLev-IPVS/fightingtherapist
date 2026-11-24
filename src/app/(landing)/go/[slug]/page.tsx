import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProduct, listPublishedProducts } from "@/lib/products";
import { OfferPageFallback, LandingPage } from "@/components/offer-pages";

export async function generateStaticParams() {
  const products = await listPublishedProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "__none__" }];
}

export async function generateMetadata({ params }: PageProps<"/go/[slug]">): Promise<Metadata> {
  const product = await getPublishedProduct((await params).slug);
  if (!product) notFound();
  const l = product.landing_page;
  return {
    title: product.title,
    description: l.subheadline || product.summary || undefined,
    // Ad and bio traffic only: the sales page is the one search engines should find.
    alternates: { canonical: `/programs/${product.slug}` },
    robots: { index: false, follow: true },
  };
}

export default function LandingRoute({ params }: PageProps<"/go/[slug]">) {
  return (
    <Suspense fallback={<OfferPageFallback />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Pick<PageProps<"/go/[slug]">, "params">) {
  const product = await getPublishedProduct((await params).slug);
  if (!product) notFound();
  return <LandingPage product={product} />;
}
