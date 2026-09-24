"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Photo, resolvePhoto, type PhotoSource } from "@/components/ui/Photo";

/** Time each photo stays on screen before the next one wipes in. */
const SLIDE_INTERVAL_MS = 5500;

type HeroSlideshowProps = {
  slides: PhotoSource[];
  exampleLabel: string;
  nextLabel: string;
};

type SlideState = "active" | "previous" | "idle";

/**
 * Endless hero slideshow, as on archidomo.fr: the next photo wipes up from the bottom while
 * settling from a slight zoom, and a preview in the lower right corner shows what comes next.
 * Pauses while the tab is hidden or the hero is scrolled away; no autoplay for reduced motion.
 */
export function HeroSlideshow({ slides, exampleLabel, nextLabel }: HeroSlideshowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [{ active, previous }, setPosition] = useState<{ active: number; previous: number | null }>({ active: 0, previous: null });

  const advance = useCallback(() => {
    setPosition(({ active }) => ({ active: (active + 1) % slides.length, previous: active }));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let heroVisible = true;
    const observer = new IntersectionObserver(([entry]) => (heroVisible = entry.isIntersecting));
    if (rootRef.current) observer.observe(rootRef.current);

    const timer = window.setInterval(() => {
      if (heroVisible && !document.hidden) advance();
    }, SLIDE_INTERVAL_MS);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [advance, slides.length]);

  const stateOf = (index: number, current: number, before: number | null): SlideState =>
    index === current ? "active" : index === before ? "previous" : "idle";
  // The preview always shows the slide after the active one; the one it showed before is now active.
  const upcoming = (active + 1) % slides.length;
  const previousUpcoming = previous === null ? null : active;

  return (
    <div ref={rootRef} className="absolute inset-0">
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((source, index) => (
          <div key={index} className="hero-slide absolute inset-0" data-state={stateOf(index, active, previous)}>
            <Photo
              source={source}
              alt=""
              exampleLabel={exampleLabel}
              priority={index === 0}
              className="h-full [&>figcaption]:top-[calc(var(--wordmark-height)+var(--nav-height)+0.75rem)] [&>figcaption]:right-3 [&>figcaption]:left-auto"
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <button
          type="button"
          onClick={advance}
          aria-label={nextLabel}
          className="intro-fade absolute right-[8%] -bottom-20 z-10 hidden aspect-video w-[34vw] max-w-[500px] cursor-pointer overflow-hidden bg-sand md:block"
        >
          {slides.map((source, index) => {
            const image = resolvePhoto(source);
            return (
              // eslint-disable-next-line @next/next/no-img-element -- static export: responsive sources are generated at build time
              <img
                key={index}
                src={image.src}
                srcSet={image.srcSet}
                sizes="34vw"
                alt=""
                loading="lazy"
                decoding="async"
                data-state={stateOf(index, upcoming, previousUpcoming)}
                className="hero-preview absolute inset-0 h-full w-full object-cover"
              />
            );
          })}
        </button>
      )}
    </div>
  );
}
