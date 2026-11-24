"use client";

import { useState } from "react";
import { btnGhost } from "./ui";

const absolute = (path: string) => new URL(path, window.location.origin).toString();

/** Copies an absolute link built from the current origin. */
export function CopyLink({ path, label, className = btnGhost }: { path: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(absolute(path));
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.prompt("Copy this link:", absolute(path));
        }
      }}
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

const seg =
  "inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[11.5px] uppercase tracking-[0.1em] transition-colors";

/**
 * One public page of a product: its name, an Open button (new tab) and a Copy
 * button. Open is disabled for drafts, whose pages aren't live yet.
 */
export function PageLink({ path, label, live }: { path: string; label: string; live: boolean }) {
  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-[6px] border border-line bg-paper">
      <span className={`${seg} border-r border-line text-steel`}>{label}</span>
      {live ? (
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className={`${seg} border-r border-line text-blue hover:bg-blue-wash`}
          aria-label={`Open the ${label.toLowerCase()} in a new tab`}
        >
          Open
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
            <path d="M6 3h7v7M13 3L5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      ) : (
        <span className={`${seg} cursor-not-allowed border-r border-line text-steel/50`} title="Publish the product to open its pages">
          Open
        </span>
      )}
      <CopyLink path={path} label="Copy" className={`${seg} text-charcoal hover:bg-off-white`} />
    </div>
  );
}
