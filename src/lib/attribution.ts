/**
 * Lead attribution: where a visitor came from.
 * First touch is kept for 90 days, last touch is updated on every visit that
 * carries campaign data. Both are attached to every form submission so the
 * CRM (step 5) can show "Instagram, link in bio" on each lead.
 */

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
] as const;

export type Touch = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>> & {
  referrer?: string;
  landing_page?: string;
  at?: string;
};

export type Attribution = { first?: Touch; last?: Touch };

const STORE_KEY = "ft_attribution";
const FIRST_TOUCH_DAYS = 90;

function read(): Attribution {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

function write(value: Attribution) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    /* storage blocked: attribution falls back to the current page only */
  }
}

/** Build a touch from the current URL and referrer. */
export function currentTouch(): Touch {
  const params = new URLSearchParams(window.location.search);
  const touch: Touch = {};
  for (const key of ATTRIBUTION_KEYS) {
    const v = params.get(key);
    if (v) touch[key] = v.slice(0, 200);
  }
  const ref = document.referrer;
  if (ref && !ref.startsWith(window.location.origin)) touch.referrer = ref.slice(0, 300);
  touch.landing_page = window.location.pathname;
  touch.at = new Date().toISOString();
  return touch;
}

function hasCampaignData(t: Touch) {
  return ATTRIBUTION_KEYS.some((k) => t[k]) || Boolean(t.referrer);
}

/** Called once per page load from <AttributionCapture />. */
export function recordVisit() {
  const now = currentTouch();
  const stored = read();
  const firstAge = stored.first?.at ? Date.now() - Date.parse(stored.first.at) : Infinity;
  const next: Attribution = { ...stored };
  if (!stored.first || firstAge > FIRST_TOUCH_DAYS * 86_400_000) next.first = now;
  if (hasCampaignData(now) || !stored.last) next.last = now;
  write(next);
}

/** Snapshot sent with every form. */
export function getAttribution(): Attribution & { page: string } {
  const stored = read();
  const fallback = currentTouch();
  return {
    first: stored.first ?? fallback,
    last: stored.last ?? fallback,
    page: window.location.pathname,
  };
}
