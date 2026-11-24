import Link from "next/link";
import { notFound } from "next/navigation";
import { LANDING_FIELDS, SALES_FIELDS, getProduct, landingPath, salesPath } from "@/lib/products";
import { deleteProduct } from "@/app/admin/actions";
import { PageHeader, btnDanger } from "@/components/admin/ui";
import { PageLink } from "@/components/admin/copy-link";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/products" className="text-[14px] text-blue hover:underline">← Products</Link>
      <PageHeader
        title={product.title}
        intro={
          product.status === "published" ? (
            <>
              Live at{" "}
              <a href={salesPath(product.slug)} target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">sales page</a>
              {" "}and{" "}
              <a href={landingPath(product.slug)} target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">landing page</a>.
            </>
          ) : (
            "Draft: the pages stay hidden until you publish."
          )
        }
        actions={
          <>
            <PageLink path={salesPath(product.slug)} label="Sales page" live={product.status === "published"} />
            <PageLink path={landingPath(product.slug)} label="Landing page" live={product.status === "published"} />
          </>
        }
      />
      <ProductForm product={product} salesFields={SALES_FIELDS} landingFields={LANDING_FIELDS} saved={sp.saved === "1"} />
      <form action={deleteProduct} className="border-t border-line pt-6">
        <input type="hidden" name="id" value={product.id} />
        <button type="submit" className={btnDanger}>Delete product</button>
      </form>
    </div>
  );
}
