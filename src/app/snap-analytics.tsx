"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackSnapEvent } from "@/lib/snappixel"; // ✅ correct import

export default function SnapAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    trackSnapEvent("PAGE_VIEW", { url }); // ✅ correct function name
  }, [pathname, searchParams]);

  return null;
}
