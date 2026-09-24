import { mediaImage } from "@/lib/media";

/** How long the intro runs; after that the attribute is removed so client navigation never replays it. */
const INTRO_DURATION_MS = 3400;

/**
 * Runs while the HTML is parsed, before the hero paints, so there is no flash of the final state.
 * Skipped for reduced motion and after the first play in the session.
 */
const startIntroScript = `(function(){try{
var d=document.documentElement;
if(matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("intro-seen"))return;
sessionStorage.setItem("intro-seen","1");
d.dataset.intro="play";
setTimeout(function(){delete d.dataset.intro},${INTRO_DURATION_MS});
}catch(e){}})();`;

export function HeroIntroScript() {
  return <script dangerouslySetInnerHTML={{ __html: startIntroScript }} />;
}

/** Project photos that flash inside the small intro frame before it opens up to the hero. */
export function HeroIntroThumbs({ images }: { images: string[] }) {
  return (
    <div aria-hidden="true" className="intro-thumbs absolute inset-0">
      {images.map((src, index) => {
        const image = mediaImage(src);
        return (
          // eslint-disable-next-line @next/next/no-img-element -- decorative intro frames from the static media set
          <img
            key={src}
            src={image.src}
            srcSet={image.srcSet}
            sizes="30vw"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: images.length - index, animationDelay: `${0.45 + index * 0.3}s` }}
          />
        );
      })}
    </div>
  );
}
