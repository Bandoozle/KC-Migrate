import type { ReactNode } from "react";
import { NativePageShell } from "@/components/layout/NativePageShell";

export default function DentalMarketingLayout({ children }: { children: ReactNode }) {
  return <NativePageShell>{children}</NativePageShell>;
}
