"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import type { WallReview } from "@/content/site";
import { Stars, cn } from "@/components/ui";
import { CountUp } from "@/components/count-up";

type Tag = NonNullable<WallReview["tag"]>;

/** The chips finish the sentence "Show me people who came in for…". */
const FILTERS: { tag: Tag | null; label: string }[] = [
  { tag: null, label: "Anything" },
  { tag: "Rehab", label: "An injury" },
  { tag: "Training", label: "Training" },
  { tag: "Nutrition", label: "Nutrition" },
  { tag: "Fight camp", label: "A fight" },
];

const WIDE = "(min-width: 1024px)";
const MID = "(min-width: 640px)";
const MOTION = "(prefers-reduced-motion: reduce)";
const watch = (queries: string[]) => (cb: () => void) => {
  const lists = queries.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", cb));
  return () => lists.forEach((l) => l.removeEventListener("change", cb));
};
const watchCols = watch([WIDE, MID]);
const watchMotion = watch([MOTION]);
const readCols = () => (window.matchMedia(WIDE).matches ? 3 : window.matchMedia(MID).matches ? 2 : 1);
const readMotion = () => window.matchMedia(MOTION).matches;

/** Seconds a column takes to move one card, so columns drift at slightly different speeds. */
const PACE = [9, 11.5, 10];

/**
 * Homepage reviews: the Google rating, chips to pick what you came for, and a
 * wall of every review drifting in columns. Hovering stops it, a click opens a
 * review in full with next/previous, and "See all" lays the whole wall out still
 * (that is also the keyboard route, since drifting cards are not tab stops).
 * A filter with only a few reviews is laid out still as well.
 */
export function ReviewWall({
  reviews,
  score,
  count,
  googleUrl,
  rating = true,
}: {
  reviews: WallReview[];
  score: string;
  count: string;
  googleUrl: string;
  /** False where the page already shows the Google rating (the Results hero). */
  rating?: boolean;
}) {
  const cols = useSyncExternalStore(watchCols, readCols, () => 3);
  const reduced = useSyncExternalStore(watchMotion, readMotion, () => false);
  const [filter, setFilter] = useState<Tag | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const root = useRef<HTMLDivElement>(null);
  const wall = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const list = filter ? reviews.filter((r) => r.tag === filter) : reviews;
  const few = list.length < cols * 4;
  const windowed = !expanded && !few;
  const drifting = windowed && !reduced;
  const columns = Array.from({ length: cols }, (_, c) =>
    list.map((review, index) => ({ review, index })).filter(({ index }) => index % cols === c),
  );
  const current = open === null ? null : list[open];

  // Stop the drift while the wall is scrolled away.
  useEffect(() => {
    const el = wall.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const step = (by: 1 | -1) => {
    setDir(by);
    setOpen((o) => (o === null ? o : (o + by + list.length) % list.length));
  };
  const pick = (tag: Tag | null) => {
    setOpen(null);
    setFilter(tag);
  };
  const collapse = () => {
    setExpanded(false);
    root.current?.scrollIntoView({ block: "start" });
  };

  const card = (review: WallReview, index: number, copy = false) => (
    <Card
      key={`${copy ? "copy-" : ""}${review.name}`}
      review={review}
      dark={index % 5 === 0}
      clamp={windowed}
      tabbable={!windowed}
      onOpen={() => {
        setDir(1);
        setOpen(index);
      }}
    />
  );

  return (
    <div ref={root} className="flex scroll-mt-28 flex-col gap-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="sr-only">Client reviews</h2>
        {rating && (
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-5 self-start"
          aria-label={`${score} out of 5 from ${count} Google reviews. Read them on Google.`}
        >
          <span className="display text-[92px] leading-[0.8] text-charcoal sm:text-[124px]">{score}</span>
          <span className="flex flex-col gap-2">
            <Stars className="text-[26px] sm:text-[30px]" />
            <span className="text-[17px] text-steel transition-colors group-hover:text-blue">
              from <CountUp value={count} /> Google reviews ↗
            </span>
          </span>
        </a>
        )}
        <div className={cn("flex flex-col gap-3", rating && "lg:items-end")}>
          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-steel">Show me people who came in for</p>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const on = f.tag === filter;
              const n = f.tag ? reviews.filter((r) => r.tag === f.tag).length : reviews.length;
              return (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(f.tag)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] font-semibold transition-colors",
                    on ? "border-charcoal bg-charcoal text-off-white" : "border-charcoal/20 text-charcoal hover:border-charcoal",
                  )}
                >
                  {f.label}
                  <span className={cn("font-mono text-[11px] tabular-nums", on ? "text-blue-pale" : "text-steel")}>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative" data-no-reveal>
        <div
          ref={wall}
          className={cn("review-wall", windowed && "is-windowed")}
          data-paused={stopped || offscreen || open !== null ? "" : undefined}
        >
          <div key={`${filter}-${cols}-${windowed}`} className="wall-swap grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map((items, c) => (
              // Before hydration the server's three columns show as one or two on smaller screens.
              <div key={c} className={cn(c === 1 && "hidden sm:block", c === 2 && "hidden lg:block")}>
                <div
                  className={cn("wall-track", drifting && "is-drifting")}
                  style={
                    {
                      "--wall-duration": `${Math.max(items.length, 3) * PACE[c]}s`,
                      animationDirection: c === 1 ? "reverse" : undefined,
                    } as CSSProperties
                  }
                >
                  <div className="flex flex-col gap-4 pb-4">{items.map(({ review, index }) => card(review, index))}</div>
                  {drifting && (
                    // A second copy makes the loop seamless; readers and the keyboard get the first one.
                    <div aria-hidden="true" className="flex flex-col gap-4 pb-4">
                      {items.map(({ review, index }) => card(review, index, true))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {windowed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-1">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-off-white shadow-[0_14px_30px_-12px_rgba(9,16,28,0.6)] transition-colors hover:bg-blue"
            >
              See all {list.length} at once
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {drifting && (
              <button
                type="button"
                onClick={() => setStopped((s) => !s)}
                aria-label={stopped ? "Start the reviews moving" : "Stop the reviews moving"}
                className="pointer-events-auto flex h-[46px] w-[46px] items-center justify-center rounded-full border border-charcoal/20 bg-paper text-charcoal shadow-[0_14px_30px_-12px_rgba(9,16,28,0.4)] transition-colors hover:border-charcoal"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
                  {stopped ? <path d="M6 4l10 6-10 6V4z" /> : <path d="M5 4h3.5v12H5zM11.5 4H15v12h-3.5z" />}
                </svg>
              </button>
            )}
          </div>
        )}
        {expanded && !few && (
          <div className="flex justify-center pt-8">
            <button
              type="button"
              onClick={collapse}
              className="inline-flex items-center gap-2 rounded-full border border-charcoal/30 px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-off-white"
            >
              Show fewer
              <svg viewBox="0 0 20 20" className="h-4 w-4 rotate-180" fill="none" aria-hidden="true">
                <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <dialog
        ref={dialog}
        aria-label="Client review"
        className="review-dialog m-auto w-[min(720px,calc(100vw-24px))] max-w-none overflow-hidden rounded-[8px] bg-paper p-0 text-charcoal shadow-2xl"
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close(); // a click on the backdrop
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {current && open !== null && (
          <div className="flex max-h-[calc(100svh-24px)] flex-col">
            <div className="flex items-center gap-4 bg-charcoal px-5 py-3 text-off-white sm:px-8">
              <span className="eyebrow text-[11px] text-blue-pale">{current.tag ?? "Google review"}</span>
              <span className="ml-auto font-mono text-[11px] tabular-nums tracking-[0.12em] text-steel-light" aria-live="polite">
                {open + 1} / {list.length}
              </span>
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                aria-label="Close"
                className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-off-white transition-colors hover:bg-white/10"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div
              key={current.name}
              className="review-swap flex flex-col gap-5 overflow-y-auto px-5 py-7 sm:px-10 sm:py-10"
              style={{ "--swap-from": `${dir * 28}px` } as CSSProperties}
            >
              <Stars className="text-[20px]" />
              {current.headline && <p className="display text-[34px] leading-[0.95] sm:text-[48px]">{current.headline}</p>}
              <blockquote className={cn("leading-relaxed", current.headline ? "text-[18px] text-steel sm:text-[19px]" : "text-[22px] font-semibold sm:text-[26px]")}>
                “{current.quote}”
              </blockquote>
              <Byline review={current} />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-8">
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-blue hover:text-charcoal"
              >
                All {count} on Google ↗
              </a>
              <div className="flex gap-2">
                {([-1, 1] as const).map((by) => (
                  <button
                    key={by}
                    type="button"
                    onClick={() => step(by)}
                    aria-label={by === 1 ? "Next review" : "Previous review"}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-white"
                  >
                    <svg viewBox="0 0 20 20" className={cn("h-4 w-4", by === -1 && "rotate-180")} fill="none" aria-hidden="true">
                      <path d="M4 10h11m-4-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

function Byline({ review, dark = false }: { review: WallReview; dark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[16px] font-extrabold",
          dark ? "bg-charcoal-3 text-blue-pale" : "bg-blue-wash text-blue",
        )}
      >
        {review.name.charAt(0)}
      </span>
      <span className="flex flex-col leading-tight">
        <span className={cn("text-[14px] font-semibold", dark ? "text-off-white" : "text-charcoal")}>{review.name}</span>
        <span className={cn("font-mono text-[10.5px] uppercase tracking-[0.12em]", dark ? "text-steel-light" : "text-steel")}>Google review</span>
      </span>
    </span>
  );
}

function Card({
  review,
  dark,
  clamp,
  tabbable,
  onOpen,
}: {
  review: WallReview;
  dark: boolean;
  clamp: boolean;
  tabbable: boolean;
  onOpen: () => void;
}) {
  const short = !review.headline && review.quote.length <= 40;
  return (
    <button
      type="button"
      onClick={onOpen}
      tabIndex={tabbable ? 0 : -1}
      className={cn(
        "review-card group/card flex w-full cursor-pointer flex-col gap-3 rounded-[6px] border p-5 text-left",
        dark ? "border-line-dark bg-charcoal text-off-white hover:border-blue-bright" : "border-line bg-paper text-charcoal hover:border-blue",
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <Stars className="text-[13px]" />
        {review.tag && <span className={cn("eyebrow text-[10.5px]", dark ? "text-blue-pale" : "text-blue")}>{review.tag}</span>}
      </span>
      {review.headline && <span className="display text-[24px] leading-[0.95]">{review.headline}</span>}
      <span
        className={cn(
          review.headline && cn("text-[15px] leading-relaxed", dark ? "text-mist" : "text-steel", clamp && "line-clamp-6"),
          !review.headline && !short && "text-[18px] font-semibold leading-snug",
          short && "display text-[30px] leading-[0.95]",
        )}
      >
        “{review.quote}”
      </span>
      <span className="mt-1 flex items-center justify-between gap-3">
        <Byline review={review} dark={dark} />
        <span
          aria-hidden="true"
          className={cn(
            "font-mono text-[10.5px] uppercase tracking-[0.12em] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 group-focus-visible/card:opacity-100",
            dark ? "text-blue-pale" : "text-blue",
          )}
        >
          Read ↗
        </span>
      </span>
    </button>
  );
}
