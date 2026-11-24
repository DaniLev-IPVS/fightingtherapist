import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { listPublishedProducts, salesPath } from "@/lib/products";

/** Main pages plus every published sales page. Landing pages stay out (they're for ads and bio links). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = ["", "/programs", "/results", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
  const products = await listPublishedProducts();
  return [
    ...pages,
    ...products.map((p) => ({ url: `${site.url}${salesPath(p.slug)}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
