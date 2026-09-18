import type { ReactNode } from "react";
import { Analytics } from "@/components/analytics/Analytics";
import { TrackedLinkDelegation } from "@/components/analytics/TrackedLink";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "@/styles/kosick-design-system.css";

type NativePageShellProps = {
  children: ReactNode;
  /** Homepage-style transparent header over a hero. */
  transparentHeader?: boolean;
};

export function NativePageShell({
  children,
  transparentHeader = false,
}: NativePageShellProps) {
  return (
    <div className="kosick-native-page">
      <Analytics />
      <TrackedLinkDelegation />
      <SiteHeader transparent={transparentHeader} />
      {children}
      <SiteFooter />
      <ChatWidget />
    </div>
  );
}
