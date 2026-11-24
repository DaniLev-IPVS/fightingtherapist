import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProduct, listPublishedProducts } from "@/lib/products";
import { OfferPageFallback, SalesPage } from "@/components/offer-pages";

/** Published products are prerendered; new ones render on first visit and are then cached. */
export async function generateStaticParams() {
  const products = await listPublishedProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: "__none__" }];
}

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const product = await getPublishedProduct((await params).slug);
  if (!product) notFound();
  const description = product.sales_page.subheadline || product.summary || undefined;
  return {
    title: product.title,
    description,
    alternates: { canonical: `/programs/${product.slug}` },
    openGraph: { title: product.sales_page.headline || product.title, description, images: product.image ? [product.image] : undefined },
  };
}

export default function SalesRoute({ params }: PageProps<"/programs/[slug]">) {
  return (
    <Suspense fallback={<OfferPageFallback />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Pick<PageProps<"/programs/[slug]">, "params">) {
  const product = await getPublishedProduct((await params).slug);
  if (!product) notFound();
  return <SalesPage product={product} />;
}
