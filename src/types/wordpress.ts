export type WordPressRenderedField = {
  rendered: string;
  protected?: boolean;
};

type WordPressContentEntity = {
  id: number;
  slug: string;
  date: string;
  link: string;
  featured_media: number;
  title: WordPressRenderedField;
  content?: WordPressRenderedField;
  excerpt: WordPressRenderedField;
};

export type WordPressPage = WordPressContentEntity & {
  type?: "page";
  parent?: number;
  menu_order?: number;
};

export type WordPressPost = WordPressContentEntity & {
  type?: "post";
  categories?: number[];
  tags?: number[];
};

export type WordPressMediaSize = {
  file: string;
  width: number;
  height: number;
  mime_type?: string;
  source_url: string;
};

export type WordPressMedia = {
  id: number;
  slug: string;
  date: string;
  link: string;
  source_url: string;
  alt_text: string;
  mime_type: string;
  media_type: string;
  title: WordPressRenderedField;
  media_details?: {
    width?: number;
    height?: number;
    file?: string;
    sizes?: Record<string, WordPressMediaSize>;
  };
};
