import { NextResponse } from "next/server";
import { validateLead, type LeadInput } from "@/lib/leads";
import { saveLead } from "@/lib/crm";

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

  return NextResponse.json({ ok: true });
}
