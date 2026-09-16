import type { Metadata } from "next";
import { headers } from "next/headers";
import { getWordPressBodyClass } from "@/lib/wordpress-body-class";
import "./globals.css";
import "@/styles/wordpress-compat.css";

export const metadata: Metadata = {
  title: "Kosick Communications",
  description:
    "Next.js frontend for Kosick Communications, using the WordPress staging site as the content source.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = (await headers()).get("x-pathname") || "/";
  const bodyClass = await getWordPressBodyClass(pathname);

  return (
    <html lang="en-US">
      <body className={bodyClass} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
