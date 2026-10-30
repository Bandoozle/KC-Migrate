import type { Metadata } from "next";
import { headers } from "next/headers";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";
import "@/styles/wordpress-compat.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kosick.com"),
  title: {
    default: "Kosick Communications",
    template: "%s",
  },
  description: "Kosick Communications",
};

/* Every route is native now; WordPress-rendered pages are no longer served. */
export default async function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = (await headers()).get("x-pathname") || "/";

  return (
    <html lang="en-US">
      <body className="kosick-native" suppressHydrationWarning>
        <JsonLd pathname={pathname} />
        {children}
      </body>
    </html>
  );
}
