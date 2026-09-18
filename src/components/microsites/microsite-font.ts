import { Montserrat } from "next/font/google";

/** Event/microsite display font (matches Kadence Montserrat on campaign pages). */
export const micrositeFont = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--microsite-font",
});
