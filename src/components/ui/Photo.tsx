import { pexelsSrcSet, pexelsUrl } from "@/config/placeholder-images";
import { mediaImage, type ResponsiveImage } from "@/lib/media";

/** A studio image committed to public/media, or a Pexels stand-in that is labelled as an example. */
export type PhotoSource = { kind: "media"; src: string } | { kind: "example"; pexelsId: number };

type PhotoProps = {
  source: PhotoSource;
  alt: string;
  /** The `sizes` attribute; the default fits a full-width image. */
  sizes?: string;
  /** Label for stand-in photos, e.g. "Foto exemplu". */
  exampleLabel: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function resolvePhoto(source: PhotoSource): ResponsiveImage {
  return source.kind === "media" ? mediaImage(source.src) : { src: pexelsUrl(source.pexelsId, 1280), srcSet: pexelsSrcSet(source.pexelsId) };
}

export function Photo({ source, alt, sizes = "100vw", exampleLabel, className = "", imageClassName = "", priority = false }: PhotoProps) {
  const image = resolvePhoto(source);

  return (
    <figure className={`relative overflow-hidden bg-sand ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export: responsive sources are generated at build time */}
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={`h-full w-full object-cover ${imageClassName}`}
      />
      {source.kind === "example" && (
        <figcaption className="caption absolute top-3 left-3 bg-paper/85 px-2 py-1 text-ink backdrop-blur-sm">{exampleLabel}</figcaption>
      )}
    </figure>
  );
}
