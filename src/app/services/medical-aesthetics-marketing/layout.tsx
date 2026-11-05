import type { ReactNode } from "react";
import { NativePageShell } from "@/components/layout/NativePageShell";

export default function MedicalAestheticsMarketingLayout({ children }: { children: ReactNode }) {
  return <NativePageShell>{children}</NativePageShell>;
}
