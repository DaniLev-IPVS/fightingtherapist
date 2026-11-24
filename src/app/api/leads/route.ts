import { NextResponse } from "next/server";
import { validateLead, type LeadInput } from "@/lib/leads";
import { saveLead } from "@/lib/crm";
import { freeDownloadFor } from "@/lib/products";

/** Receives every form on the site and files it in the CRM. */
export async function POST(request: Request) {
  let body: Partial<LeadInput>;
  try {
    body = (await request.json()) as Partial<LeadInput>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend success so they move on.
  if (body.company) return NextResponse.json({ ok: true });

  const errors = validateLead(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  try {
    await saveLead(body as LeadInput, request.headers.get("user-agent"));
  } catch (error) {
    console.error("[lead] save failed", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our side. Please call or email Zack instead." },
      { status: 500 },
    );
  }

  // Free products: the file link goes back only after the email is saved.
  const download = typeof body.offer === "string" && body.offer ? await freeDownloadFor(body.offer).catch(() => null) : null;
  return NextResponse.json(download ? { ok: true, download } : { ok: true });
}
