"use client";

import { useId } from "react";

/**
 * The mark, straight from the brand kit: a Helvetica Neue R with one cut,
 * where the leg breaks away and steps forward in blue.
 *
 * Brand rule R.02 — on dark grounds the R is white and the leg is the
 * brighter #2E52FF so the blue never goes muddy.
 */
export function Mark({
  className = "",
  body = "#FFFFFF",
  leg = "#2E52FF",
}: {
  className?: string;
  body?: string;
  leg?: string;
}) {
  // Unique per instance — two Marks on one page would otherwise collide
  // on clipPath ids and the cut would render on the wrong element.
  const uid = useId().replace(/:/g, "");
  const legClip = `leg-${uid}`;
  const bodyClip = `body-${uid}`;

  const R =
    "M10.64 0.00H58.40Q74.93 0.00 83.19 7.14Q91.46 14.29 91.46 27.03Q91.46 34.17 89.36 38.87Q87.25 43.56 84.45 46.43Q81.65 49.30 78.92 50.56Q76.19 51.82 74.93 52.24V52.52Q77.17 52.80 79.76 53.92Q82.35 55.04 84.59 57.49Q86.83 59.94 88.31 63.87Q89.78 67.79 89.78 73.67Q89.78 82.49 91.11 89.71Q92.44 96.92 95.24 100.00H76.47Q74.51 96.78 74.16 92.86Q73.81 88.94 73.81 85.29Q73.81 78.43 72.97 73.46Q72.13 68.49 69.89 65.20Q67.65 61.90 63.80 60.36Q59.94 58.82 53.92 58.82H28.15V100.00H10.64ZM28.15 45.52H56.86Q65.27 45.52 69.61 41.53Q73.95 37.54 73.95 29.55Q73.95 24.79 72.55 21.78Q71.15 18.77 68.70 17.09Q66.25 15.41 63.10 14.85Q59.94 14.29 56.58 14.29H28.15Z";

  return (
    <svg
      viewBox="-3 -3 105 107"
      className={className}
      role="img"
      aria-label="Royz Media Group"
    >
      <defs>
        <clipPath id={legClip}>
          <polygon points="53.2,67.9 91.2,43.9 131.2,163.9 43.2,207.9" />
        </clipPath>
        <clipPath id={bodyClip}>
          <path
            clipRule="evenodd"
            d="M-300,-50 H400 V250 H-300 Z M50.8,64.1 L88.8,40.1 L128.8,160.1 L40.8,204.1 Z"
          />
        </clipPath>
      </defs>
      <path d={R} fill={body} clipPath={`url(#${bodyClip})`} />
      <path d={R} fill={leg} clipPath={`url(#${legClip})`} />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="h-7 w-7 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-semibold tracking-[0.16em] text-chalk">
          ROYZ{" "}
        </span>
        <span className="mt-[3px] text-[8px] font-semibold tracking-[0.2em] text-muted">
          MEDIA GROUP
        </span>
      </span>
    </span>
  );
}
