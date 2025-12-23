"use client";

import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/ui/scrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProgressProvider } from "@bprogress/next/app";
import { useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { removeCatalogFilters } from "@/lib/slice/catalogFiltersSlice";
import { Toaster } from "sonner";
import { ComparisonProvider } from "@/contexts/ComparisionContext";

// ✅ Analytics components
import Analytics from "@/app/analytics"; // Google Analytics
import FacebookAnalytics from "@/app/fb-analytics"; // Facebook Pixel
import SnapAnalytics from "@/app/snap-analytics"; // Snapchat Pixel
import TikTokAnalytics from "@/app/tiktok-analytics"; // TikTok Pixel

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => { 
    if (!pathname.startsWith("/catalog")) {
      dispatch(removeCatalogFilters());
    }
  }, [pathname, dispatch]);

  return (
    <AuthProvider>
      <ComparisonProvider>
        <ProgressProvider
          height="4px"
          color="#09B4C6"
          options={{ showSpinner: false }}
          shallowRouting
        >
          {/* ✅ Wrap analytics in Suspense to fix Next.js hydration errors */}
          <Suspense fallback={null}>
            <Analytics />           {/* Google Analytics */}
            <FacebookAnalytics />   {/* Meta/Facebook Pixel */}
            <SnapAnalytics />       {/* Snapchat Pixel */}
            <TikTokAnalytics />     {/* TikTok Pixel */}
          </Suspense>

          {/* ✅ UI Components */}
          <Toaster />
          {children}

          <footer className="py-12 bg-white">
            <Footer />
          </footer>

          <ScrollToTopButton />
        </ProgressProvider>
      </ComparisonProvider>
    </AuthProvider>
  );
};

export default ClientLayout;
