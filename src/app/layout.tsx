import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import JsonLd from "@/components/JsonLd";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: `Rent A Car | ${process.env.NEXT_PUBLIC_SITE_NAME}`,
  description: "Car rental app with Next.js & Tailwind",
  icons: { icon: "/fav.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const SNAP_PIXEL_ID = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;
  const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

  /** ===== Global JSON-LD (site-wide) =====
   *  Keep only organization-level types here.
   *  Page-intent schemas go in each page.
   */
  const globalSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "CarRental",
      name: "TheDriveHub Dubai",
      url: "https://thedrivehub.com/",
      image: ["https://thedrivehub.com/og-image.jpg"],
      priceRange: "AED 500 - AED 5000",
      telephone: "+971564727007",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
      areaServed: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah"],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "The Drive Hub",
      url: "https://thedrivehub.com/",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://thedrivehub.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <html lang="en">
      <head>
        {/* === Your existing pixels (GA / Meta / Snap / TikTok) === */}
        {GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}

        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {SNAP_PIXEL_ID && (
          <Script id="snap-pixel" strategy="afterInteractive">
            {`
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){
              a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
              a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
              r.src=n;var u=t.getElementsByTagName(s)[0];
              u.parentNode.insertBefore(r,u);})(window,document,
              'https://sc-static.net/scevent.min.js');
              snaptr('init', '${SNAP_PIXEL_ID}');
              snaptr('track', 'PAGE_VIEW');
            `}
          </Script>
        )}

        {TIKTOK_PIXEL_ID && (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject = t;
                var ttq = w[t] = w[t] || [];
                ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
                ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } };
                for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
                ttq.load = function (e, n) {
                  var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
                  ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
                  ttq._t = ttq._t || {}; ttq._t[e] = +new Date; ttq._o = ttq._o || {}; ttq._o[e] = n || {};
                  var o = document.createElement("script"); o.type = "text/javascript"; o.async = true;
                  o.src = r + "?sdkid=" + e + "&lib=" + t;
                  var a = document.getElementsByTagName("script")[0]; a.parentNode.insertBefore(o, a);
                };
                ttq.load('${TIKTOK_PIXEL_ID}'); ttq.page();
              }(window, document, 'ttq');
            `}
          </Script>
        )}

        {/* === Global JSON-LD (array) === */}
        <JsonLd id="global-jsonld" data={globalSchemas} />
      </head>

      <body className={`${poppins.className} !bg-off-white mx-auto`}>
        <Providers>{children}</Providers>
        {/* ✅ REQUIRED FOR SONNER TOASTS */}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
