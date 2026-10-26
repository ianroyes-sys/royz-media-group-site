"use client";

import { useEffect } from "react";

/**
 * Mounted once. Watches every [data-reveal] element on the page and lets it
 * step forward as it enters view. Server components stay server components —
 * they just declare the attribute.
 *
 * Also drives the pointer spotlight on .spotlight sections.
 */
export function Reveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduced) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              (e.target as HTMLElement).dataset.reveal = "in";
              if (e.boundingClientRect.top > 80) e.target.animate(
                [{ opacity: .25, transform: "translateY(28px)" }, { opacity: 1, transform: "translateY(0)" }],
                { duration: 850, easing: "cubic-bezier(.16,1,.3,1)", fill: "none" },
              );
              io.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
      );
      document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

      // Spotlight follows the pointer across dark sections.
      const spots = Array.from(
        document.querySelectorAll<HTMLElement>(".spotlight"),
      );
      const onMove = (ev: PointerEvent) => {
        for (const s of spots) {
          const r = s.getBoundingClientRect();
          const inside =
            ev.clientY > r.top &&
            ev.clientY < r.bottom &&
            ev.clientX > r.left &&
            ev.clientX < r.right;
          s.style.setProperty("--spot-o", inside ? "1" : "0");
          if (inside) {
            s.style.setProperty("--spot-x", `${ev.clientX - r.left}px`);
            s.style.setProperty("--spot-y", `${ev.clientY - r.top}px`);
          }
        }
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      return () => {
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
      };
    }
  }, []);

  return <div className="reading-progress" aria-hidden="true" />;
}
