import Link from "next/link";
import { LANDING_FIELDS, SALES_FIELDS } from "@/lib/products";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Add product" };

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/products" className="text-[14px] text-blue hover:underline">← Products</Link>
      <PageHeader title="Add product" intro="Saved as a draft until you publish it." />
      <ProductForm salesFields={SALES_FIELDS} landingFields={LANDING_FIELDS} />
    </div>
  );
}
