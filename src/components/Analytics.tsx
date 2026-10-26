"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {trackEvent} from "@/lib/analytics";
export function Analytics() {
  const pathname = usePathname();
  useEffect(() => { trackEvent("page_view"); }, [pathname]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target = event.target as Element;
      const link = target.closest?.("a");
      if (link?.getAttribute("href")?.startsWith("/work/")) trackEvent("portfolio_viewed");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
