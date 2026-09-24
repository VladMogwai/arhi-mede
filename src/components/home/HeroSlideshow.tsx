"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Photo, resolvePhoto, type PhotoSource } from "@/components/ui/Photo";

/** Time each photo stays on screen before the next one starts to wipe in. */
const SLIDE_INTERVAL_MS = 5000;
/** Longest transition in globals.css (.hero-slide img); no new slide starts before it ends. */
const TRANSITION_MS = 2800;

type HeroSlideshowProps = {
  slides: PhotoSource[];
  exampleLabel: string;
  nextLabel: string;
};

type SlideState = "active" | "previous" | "idle";

function stateOf(index: number, current: number, before: number | null): SlideState {
  return index === current ? "active" : index === before ? "previous" : "idle";
}

/** Resolves once the image is downloaded and decoded, so a slide never wipes in over an empty frame. */
async function imageReady(container: HTMLElement | null): Promise<void> {
  const image = container?.querySelector("img");
  if (!image) return;
  try {
    await image.decode();
  } catch {
    // A broken image should not stop the slideshow.
  }
}

/**
 * Endless hero slideshow, as on archidomo.fr: the next photo is uncovered from the bottom up
 * while settling from a slight zoom, and a preview in the lower right corner shows what comes next.
 * Pauses while the tab is hidden or the hero is scrolled away; no autoplay for reduced motion.
 */
export function HeroSlideshow({ slides, exampleLabel, nextLabel }: HeroSlideshowProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const busyRef = useRef(false);
  const [{ active, previous }, setPosition] = useState<{ active: number; previous: number | null }>({ active: 0, previous: null });
  // Mirrors `active` for the async advance(), which must not read a stale closure.
  const activeRef = useRef(0);

  const advance = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    const next = (activeRef.current + 1) % slides.length;
    await imageReady(slideRefs.current[next]);
    setPosition({ active: next, previous: activeRef.current });
    activeRef.current = next;
    window.setTimeout(() => (busyRef.current = false), TRANSITION_MS);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let heroVisible = true;
    const observer = new IntersectionObserver(([entry]) => (heroVisible = entry.isIntersecting));
    if (rootRef.current) observer.observe(rootRef.current);

    let timer: number;
    const scheduleNext = () => {
      timer = window.setTimeout(async () => {
        if (heroVisible && !document.hidden) await advance();
        scheduleNext();
      }, SLIDE_INTERVAL_MS);
    };
    scheduleNext();
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [advance, slides.length]);

  // The preview shows the slide after the active one; the one it showed before is now active.
  const upcoming = (active + 1) % slides.length;
  const previousUpcoming = previous === null ? null : active;

  return (
    <div ref={rootRef} className="absolute inset-0 bg-ink">
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((source, index) => (
          <div
            key={index}
            ref={(element) => {
              slideRefs.current[index] = element;
            }}
            className="hero-slide"
            data-state={stateOf(index, active, previous)}
          >
            <Photo
              source={source}
              alt=""
              exampleLabel={exampleLabel}
              priority={index === 0}
              eager
              placeholder="dark"
              className="[&>figcaption]:top-[calc(var(--wordmark-height)+var(--nav-height)+0.75rem)] [&>figcaption]:right-3 [&>figcaption]:left-auto"
            />
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <button
          type="button"
          onClick={() => void advance()}
          aria-label={nextLabel}
          className="intro-fade absolute right-[8%] -bottom-20 z-10 hidden aspect-video h-[min(19vw,26svh,281px)] cursor-pointer overflow-hidden bg-ink md:block"
        >
          {slides.map((source, index) => {
            const image = resolvePhoto(source);
            return (
              <span key={index} className="hero-preview" data-state={stateOf(index, upcoming, previousUpcoming)}>
                <span className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export: responsive sources are generated at build time */}
                  <img src={image.src} srcSet={image.srcSet} sizes="34vw" alt="" decoding="async" className="h-full w-full object-cover" />
                </span>
              </span>
            );
          })}
        </button>
      )}
    </div>
  );
}
