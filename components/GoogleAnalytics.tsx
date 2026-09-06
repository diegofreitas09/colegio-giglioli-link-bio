"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "giglioli_cookie_consent";

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      setEnabled(window.localStorage.getItem(STORAGE_KEY) === "accepted");
    };

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setEnabled(detail === "accepted");
    };

    syncConsent();
    window.addEventListener("giglioli-cookie-consent", onConsent);
    return () => window.removeEventListener("giglioli-cookie-consent", onConsent);
  }, []);

  if (!measurementId || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
