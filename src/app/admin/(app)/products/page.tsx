import Link from "next/link";
import { closeLabel, formatPrice, kindLabel, landingPath, listProducts, salesPath } from "@/lib/products";
import { Card, PageHeader, Pill, btnPrimary, formatDate } from "@/components/admin/ui";
import { CopyLink } from "@/components/admin/copy-link";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  const products = await listProducts();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        intro="Coaching offers, PDFs and video lessons. Each gets a sales page and a landing page."
        actions={<Link href="/admin/products/new" className={btnPrimary}>Add product</Link>}
      />

      {products.length === 0 ? (
        <Card className="flex flex-col items-start gap-3">
          <p className="text-[15px] text-steel">No products yet. Add a coaching offer, PDF guide or video lesson and write its page text.</p>
          <Link href="/admin/products/new" className={btnPrimary}>Add the first product</Link>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((p) => (
            <li key={p.id}>
              <Card className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-1">
                  <Link href={`/admin/products/${p.id}`} className="text-[18px] font-bold text-charcoal hover:text-blue">
                    {p.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-steel">
                    <Pill tone={p.status}>{p.status === "published" ? "Published" : "Draft"}</Pill>
                    <span>{kindLabel(p.kind)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{closeLabel(p.close)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatPrice(p)}</span>
                    <span aria-hidden="true">·</span>
                    <span>Edited {formatDate(p.updated_at)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <CopyLink path={salesPath(p.slug)} label="Copy sales link" />
                  <CopyLink path={landingPath(p.slug)} label="Copy landing link" />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
