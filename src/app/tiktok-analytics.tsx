"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TikTokAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.ttq !== "undefined") {
      window.ttq.page();
    }
  }, [pathname]);

  return null;
}
