import type { Metadata } from "next";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { InternalPageHero } from "@/components/sections/InternalPageHero";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | Kosick Communications" },
};

/** Native 404 with the site header and footer, like the Thank You page. */
export default function NotFound() {
  return (
    <NativePageShell>
      <main>
        <InternalPageHero
          plain
          eyebrow="404"
          titlePrimary="Page"
          titleSecondary="Not Found"
          description="Sorry, we couldn’t find that page. It may have moved, or the link may be out of date."
          primaryCTA={{ label: "Back to Home", href: "/" }}
          secondaryCTA={{ label: "Browse the Site Map", href: "/site-map/" }}
        />
      </main>
    </NativePageShell>
  );
}
