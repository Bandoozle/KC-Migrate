import { cache } from "react";
import { getPageBySlug } from "@/lib/wordpress";
import { cleanText } from "@/lib/wordpress/shared";

export type ThanksContent = {
  title: string;
};

export const getThanksContent = cache(async (): Promise<ThanksContent> => {
  const page = await getPageBySlug("thanks");
  return {
    title: page ? cleanText(page.title.rendered) : "Thank you",
  };
});
