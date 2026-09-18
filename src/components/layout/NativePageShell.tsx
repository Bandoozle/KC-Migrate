import type { ReactNode } from "react";
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
      <SiteHeader transparent={transparentHeader} />
      {children}
      <SiteFooter />
    </div>
  );
}
