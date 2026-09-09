/**
 * Per-project assets, mapped from the files under public/projects-assets/.
 * `kind` controls the frame the UI draws:
 *   - "web" → browser window frame  (landscape shots)
 *   - "app" → phone frame           (portrait shots)
 *
 * Note: file paths are case-sensitive on production hosts — keep the exact
 * casing that exists on disk (e.g. "1.PNG").
 */
export type Shot = {
  src: string;
  kind: "web" | "app";
  caption?: string;
};

export type Doc = {
  src: string;
  label: string;
  /** Pre-rendered image of the document (used instead of an unreliable PDF embed). */
  image?: string;
};

const A = "/projects-assets";

export const screenshots: Record<string, Shot[]> = {
  groupygo: [
    { src: `${A}/groupygo/1.PNG`, kind: "app", caption: "On WhatsApp" },
    { src: `${A}/groupygo/2.PNG`, kind: "app" },
    { src: `${A}/groupygo/3.PNG`, kind: "app" },
  ],
  capmylead: [
    { src: `${A}/capmylead/1.jpeg`, kind: "app" },
    { src: `${A}/capmylead/2.jpeg`, kind: "app" },
    { src: `${A}/capmylead/3.jpeg`, kind: "app" },
  ],
  "prime-circle": [
    { src: `${A}/primecircle/website.png`, kind: "web", caption: "Curated landing page" },
    { src: `${A}/primecircle/mobile.png`, kind: "app", caption: "Mobile" },
  ],
  reputup: [{ src: `${A}/reputeup/1.png`, kind: "web" }],
  tradify: [{ src: `${A}/tradiify/1.png`, kind: "web", caption: "One of ~30 pages" }],
  aerobix: [
    { src: `${A}/aerobix/web.png`, kind: "web", caption: "Landing page" },
    { src: `${A}/aerobix/mobile.png`, kind: "app", caption: "Mobile" },
  ],
  "macro-bowls": [{ src: `${A}/macrobowls/2.png`, kind: "app" }],
  "one-chat": [],
};

/** Optional project logos (shown on the case-study header). */
export const logos: Record<string, string> = {
  groupygo: `${A}/groupygo/logo.jpg`,
  "prime-circle": `${A}/primecircle/logo.jpg`,
};

/** Optional embedded documents (e.g. brand-design PDFs). */
export const docs: Record<string, Doc[]> = {
  "macro-bowls": [
    {
      src: `${A}/macrobowls/macrobowls.pdf`,
      label: "Brand design",
      image: `${A}/macrobowls/brand/board.jpg`,
    },
  ],
};

/** How many placeholder frames to show when no images exist yet. */
export const placeholderPlan: Record<string, ("web" | "app")[]> = {
  "one-chat": ["app", "app"],
};

export function shotsFor(slug: string): Shot[] {
  return screenshots[slug] ?? [];
}
export function logoFor(slug: string): string | undefined {
  return logos[slug];
}
export function docsFor(slug: string): Doc[] {
  return docs[slug] ?? [];
}
