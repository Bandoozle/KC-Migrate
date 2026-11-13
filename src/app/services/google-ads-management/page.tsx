import type { Metadata } from "next";
import { GoogleAdsPage } from "@/components/sections/google-ads/GoogleAdsPage";
import { GOOGLE_ADS_FAQS, GOOGLE_ADS_PATH, GOOGLE_ADS_SEO } from "@/content/google-ads-page";
import { nativeServiceJsonLd, nativeServiceMetadata } from "@/lib/seo/native-service";

export function generateMetadata(): Metadata {
  return nativeServiceMetadata({ path: GOOGLE_ADS_PATH, ...GOOGLE_ADS_SEO });
}

export default function GoogleAdsManagementPage() {
  const jsonLd = nativeServiceJsonLd({
    path: GOOGLE_ADS_PATH,
    name: "Google Ads Management",
    description: GOOGLE_ADS_SEO.description,
    faqs: GOOGLE_ADS_FAQS,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <GoogleAdsPage />
    </>
  );
}
