import { NextResponse } from "next/server";
import { validateLead, type LeadInput } from "@/lib/leads";

/**
 * Receives every form on the site.
 * STEP 5 TODO: save to the CRM database and notify Zack. Until then leads are
 * only logged, so don't point real traffic at forms before step 5 ships.
 */
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

  const lead = {
    name: body.name!.trim(),
    email: body.email!.trim().toLowerCase(),
    phone: body.phone?.trim() || null,
    goal: body.goal,
    message: body.message?.trim() || null,
    offer: body.offer ?? null,
    pageType: body.pageType ?? "other",
    attribution: body.attribution ?? null,
    userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    receivedAt: new Date().toISOString(),
  };

  console.info("[lead]", JSON.stringify(lead));

  return NextResponse.json({ ok: true });
}
