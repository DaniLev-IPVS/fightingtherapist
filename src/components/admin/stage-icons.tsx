import type { StageIcon as IconName } from "@/lib/pipeline";
import { stageOf } from "@/lib/pipeline";

/**
 * Gym-equipment icon per pipeline stage. The weight gets heavier as a lead moves
 * toward Closed: jump rope, kettlebell, dumbbell, loaded bar, then a full deadlift.
 */
export function StageIcon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function StageGlyph({ stage, className }: { stage: string; className?: string }) {
  return <StageIcon name={stageOf(stage).icon} className={className} />;
}

const s = { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;
const f = { fill: "currentColor" } as const;

const ICONS: Record<IconName, React.ReactNode> = {
  // Jump rope: warm-up.
  rope: (
    <>
      <rect x="7" y="6" width="6" height="14" rx="3" {...f} />
      <rect x="35" y="6" width="6" height="14" rx="3" {...f} />
      <path d="M10 20c0 26 28 26 28 0" strokeWidth="2.5" {...s} />
    </>
  ),
  // Rest timer: waiting to try again.
  timer: (
    <>
      <circle cx="24" cy="27" r="14" strokeWidth="3.5" {...s} />
      <path d="M20 6h8M24 6v7M24 27l6-6M36 14l3-3" strokeWidth="3.5" {...s} />
    </>
  ),
  kettlebell: (
    <>
      <path d="M10.5 24C8 9 40 9 37.5 24" strokeWidth="5" {...s} />
      <circle cx="24" cy="30" r="14.5" {...f} />
      <rect x="14" y="40" width="20" height="4" rx="1.5" {...f} />
    </>
  ),
  dumbbell: (
    <>
      <rect x="15" y="21.5" width="18" height="5" rx="1.5" {...f} />
      <rect x="8" y="12" width="7" height="24" rx="2" {...f} />
      <rect x="33" y="12" width="7" height="24" rx="2" {...f} />
      <rect x="4" y="18" width="4" height="12" rx="1.5" {...f} />
      <rect x="40" y="18" width="4" height="12" rx="1.5" {...f} />
    </>
  ),
  // Barbell with two plates a side.
  bar: (
    <>
      <rect x="1" y="22.5" width="46" height="3" rx="1.5" {...f} />
      <rect x="7" y="8" width="5" height="32" rx="1.5" {...f} />
      <rect x="12.5" y="13" width="4" height="22" rx="1.5" {...f} />
      <rect x="36" y="8" width="5" height="32" rx="1.5" {...f} />
      <rect x="31.5" y="13" width="4" height="22" rx="1.5" {...f} />
    </>
  ),
  // Fully loaded deadlift bar: four plates a side, near the floor line.
  deadlift: (
    <>
      <rect x="0" y="27" width="48" height="3" rx="1.5" {...f} />
      <rect x="3" y="6" width="4.5" height="42" rx="1.5" {...f} />
      <rect x="8.2" y="6" width="4.5" height="42" rx="1.5" {...f} />
      <rect x="13.4" y="10" width="3.6" height="34" rx="1.5" {...f} />
      <rect x="17.6" y="15" width="2.6" height="24" rx="1" {...f} />
      <rect x="40.5" y="6" width="4.5" height="42" rx="1.5" {...f} />
      <rect x="35.3" y="6" width="4.5" height="42" rx="1.5" {...f} />
      <rect x="31" y="10" width="3.6" height="34" rx="1.5" {...f} />
      <rect x="27.8" y="15" width="2.6" height="24" rx="1" {...f} />
    </>
  ),
  bench: (
    <>
      <rect x="5" y="19" width="38" height="7" rx="3" {...f} />
      <path d="M11 26v12M37 26v12M7 38h8M33 38h8" strokeWidth="3.5" {...s} />
    </>
  ),
  shaker: (
    <>
      <path d="M17 6h14v6H17z" {...f} />
      <path d="M15 13h18l-2.5 29a2 2 0 0 1-2 1.8h-9a2 2 0 0 1-2-1.8L15 13z" strokeWidth="3" {...s} />
      <path d="M20 24h8M20.5 31h7" strokeWidth="3" {...s} />
    </>
  ),
  medal: (
    <>
      <path d="M14 4l7 15M34 4l-7 15" strokeWidth="4" {...s} />
      <circle cx="24" cy="31" r="12" {...f} />
      <path d="M24 24.5l2 4.2 4.6.6-3.3 3.2.8 4.5-4.1-2.2-4.1 2.2.8-4.5-3.3-3.2 4.6-.6z" fill="white" />
    </>
  ),
};
