"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/attribution";

/** Stores UTM, click IDs and referrer on each visit. Renders nothing. */
export function AttributionCapture() {
  useEffect(() => {
    recordVisit();
  }, []);
  return null;
}
