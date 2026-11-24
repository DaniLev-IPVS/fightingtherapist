/** Works out the marketing channel a lead came from, for the CRM's "Source" column. */

export const SOURCES = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "google", label: "Google" },
  { value: "email", label: "Email" },
  { value: "referral", label: "Other website" },
  { value: "direct", label: "Direct" },
  { value: "other", label: "Other" },
] as const;

export type SourceValue = (typeof SOURCES)[number]["value"];

export type TouchLike = {
  utm_source?: string;
  utm_medium?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  referrer?: string;
};

const MATCHERS: [SourceValue, RegExp][] = [
  ["instagram", /instagram|^ig$|l\.instagram/i],
  ["tiktok", /tiktok/i],
  ["facebook", /facebook|^fb$|^meta$|fb\.com|m\.facebook/i],
  ["youtube", /youtube|youtu\.be|^yt$/i],
  ["google", /google|^gads$|^adwords$/i],
  ["email", /mail|newsletter|klaviyo|resend/i],
];

/** Click IDs win, then utm_source, then the referrer's host. */
export function sourceFromTouch(t: TouchLike | null | undefined): SourceValue {
  if (!t) return "direct";
  if (t.ttclid) return "tiktok";
  if (t.gclid) return "google";
  const utm = t.utm_source?.trim();
  if (utm) {
    for (const [value, re] of MATCHERS) if (re.test(utm)) return value;
    if (t.fbclid) return t.utm_medium && /ig|instagram/i.test(t.utm_medium) ? "instagram" : "facebook";
    return "other";
  }
  if (t.fbclid) return "facebook";
  if (t.referrer) {
    let host = "";
    try {
      host = new URL(t.referrer).hostname;
    } catch {
      return "referral";
    }
    for (const [value, re] of MATCHERS) if (re.test(host)) return value;
    return "referral";
  }
  return "direct";
}

export function sourceLabel(value: string) {
  return SOURCES.find((s) => s.value === value)?.label ?? value;
}
