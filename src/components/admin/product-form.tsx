"use client";

import { useActionState, useState } from "react";
import { saveProduct } from "@/app/admin/actions";
import type { Product } from "@/lib/products";
import { Card, Field, btnPrimary, inputClass } from "./ui";

type FieldDef = { key: string; label: string; rows: number };

export function ProductForm({
  product,
  salesFields,
  landingFields,
  saved,
}: {
  product?: Product;
  salesFields: readonly FieldDef[];
  landingFields: readonly FieldDef[];
  saved?: boolean;
}) {
  const [state, action, pending] = useActionState(saveProduct, saved ? { ok: true } : undefined);
  const [access, setAccess] = useState<"free" | "paid">(product?.access ?? "paid");
  const err = (k: string) => state?.fieldErrors?.[k];
  const aria = (k: string) => (err(k) ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  return (
    <form action={action} className="flex flex-col gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <Card className="flex flex-col gap-5">
        <h2 className="text-[18px] font-bold">Basics</h2>
        <Field label="Title" htmlFor="title" error={err("title")}>
          <input id="title" name="title" defaultValue={product?.title} required className={inputClass} {...aria("title")} />
        </Field>
        <Field label="Link name" htmlFor="slug" hint="Used in the page address. Leave empty to build it from the title." error={err("slug")}>
          <input id="slug" name="slug" defaultValue={product?.slug} placeholder="knee-rehab-guide" className={inputClass} {...aria("slug")} />
        </Field>
        <Field label="Short description" htmlFor="summary" hint="One or two sentences for cards and previews.">
          <textarea id="summary" name="summary" rows={2} defaultValue={product?.summary ?? ""} className={inputClass} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1.5 text-[14px] font-semibold">Type</legend>
            {[
              ["pdf", "PDF guide"],
              ["lesson", "Video lesson"],
            ].map(([v, l]) => (
              <label key={v} className="flex items-center gap-2 text-[15px]">
                <input type="radio" name="kind" value={v} defaultChecked={(product?.kind ?? "pdf") === v} /> {l}
              </label>
            ))}
          </fieldset>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1.5 text-[14px] font-semibold">Free or paid</legend>
            {(["paid", "free"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-[15px]">
                <input type="radio" name="access" value={v} checked={access === v} onChange={() => setAccess(v)} />
                {v === "paid" ? "Paid" : "Free (visitors give their email to get it)"}
              </label>
            ))}
          </fieldset>
        </div>

        {access === "paid" && (
          <Field label="Price (CAD)" htmlFor="price" error={err("price")}>
            <input
              id="price"
              name="price"
              inputMode="decimal"
              defaultValue={product?.price_cents != null ? (product.price_cents / 100).toFixed(2) : ""}
              placeholder="29.00"
              className={`${inputClass} max-w-[160px]`}
              {...aria("price")}
            />
          </Field>
        )}

        <Field
          label="File or video link"
          htmlFor="file_url"
          hint="Link to the PDF or video for now. File uploads come with the storage setup."
          error={err("file_url")}
        >
          <input id="file_url" name="file_url" type="url" defaultValue={product?.file_url ?? ""} placeholder="https://" className={inputClass} {...aria("file_url")} />
        </Field>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-[14px] font-semibold">Visibility</legend>
          {[
            ["draft", "Draft (pages stay hidden)"],
            ["published", "Published (pages are live)"],
          ].map(([v, l]) => (
            <label key={v} className="flex items-center gap-2 text-[15px]">
              <input type="radio" name="status" value={v} defaultChecked={(product?.status ?? "draft") === v} /> {l}
            </label>
          ))}
        </fieldset>
      </Card>

      <TextBlocks title="Sales page" intro="The long page: dream outcome, who it's for, what's included, proof, then the close." prefix="sales" fields={salesFields} values={product?.sales_page} />
      <TextBlocks title="Landing page" intro="The short page: headline, subheadline and the form above the fold." prefix="landing" fields={landingFields} values={product?.landing_page} />

      <div className="sticky bottom-0 -mx-5 flex items-center gap-4 border-t border-line bg-off-white/95 px-5 py-4 backdrop-blur md:-mx-10 md:px-10">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
        <p aria-live="polite" className={`text-[14px] ${state?.error ? "text-red-700" : "text-steel"}`}>
          {state?.error ?? (state?.ok && !pending ? "Saved." : "")}
        </p>
      </div>
    </form>
  );
}

function TextBlocks({
  title,
  intro,
  prefix,
  fields,
  values,
}: {
  title: string;
  intro: string;
  prefix: string;
  fields: readonly FieldDef[];
  values?: Partial<Record<string, string>>;
}) {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] font-bold">{title}</h2>
        <p className="text-[14px] text-steel">{intro}</p>
      </div>
      {fields.map((f) => {
        const id = `${prefix}.${f.key}`;
        return (
          <Field key={id} label={f.label} htmlFor={id}>
            {f.rows === 1 ? (
              <input id={id} name={id} defaultValue={values?.[f.key] ?? ""} className={inputClass} />
            ) : (
              <textarea id={id} name={id} rows={f.rows} defaultValue={values?.[f.key] ?? ""} className={inputClass} />
            )}
          </Field>
        );
      })}
    </Card>
  );
}
