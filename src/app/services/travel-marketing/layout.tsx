import type { ReactNode } from "react";
import { NativePageShell } from "@/components/layout/NativePageShell";

export default function TravelMarketingLayout({ children }: { children: ReactNode }) {
  return <NativePageShell>{children}</NativePageShell>;
}
