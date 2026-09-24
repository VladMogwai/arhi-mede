import manifest from "@/generated/media.json";

/** Shape written by scripts/build-media.ts. */
type MediaEntry = { width: number; height: number; widths: number[] };

export type ResponsiveImage = {
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
};

/** Responsive sources for an image committed to public/media (see scripts/build-media.ts). */
export function mediaImage(src: string): ResponsiveImage {
  const entry = (manifest as Record<string, MediaEntry>)[src];
  if (!entry) return { src };
  const variants = entry.widths.map((width) => `${src.replace(/\.\w+$/, `-${width}.webp`)} ${width}w`);
  return {
    src,
    srcSet: [...variants, `${src} ${entry.width}w`].join(", "),
    width: entry.width,
    height: entry.height,
  };
}
