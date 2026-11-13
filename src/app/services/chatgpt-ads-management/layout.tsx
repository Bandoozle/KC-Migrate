import type { ReactNode } from "react";
import { NativePageShell } from "@/components/layout/NativePageShell";

export default function ServiceNativeLayout({ children }: { children: ReactNode }) {
  return <NativePageShell>{children}</NativePageShell>;
}
