import type { Metadata } from "next";
import { ChatGptAdsPage } from "@/components/sections/chatgpt-ads/ChatGptAdsPage";
import { CHATGPT_ADS_FAQS, CHATGPT_ADS_PATH, CHATGPT_ADS_SEO } from "@/content/chatgpt-ads-page";
import { nativeServiceJsonLd, nativeServiceMetadata } from "@/lib/seo/native-service";

export function generateMetadata(): Metadata {
  return nativeServiceMetadata({ path: CHATGPT_ADS_PATH, ...CHATGPT_ADS_SEO });
}

export default function ChatGptAdsManagementPage() {
  const jsonLd = nativeServiceJsonLd({
    path: CHATGPT_ADS_PATH,
    name: "ChatGPT Ads Management",
    description: CHATGPT_ADS_SEO.description,
    faqs: CHATGPT_ADS_FAQS,
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ChatGptAdsPage />
    </>
  );
}
