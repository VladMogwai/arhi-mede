"use client";

import { useEffect, useRef, useState } from "react";

const MIN_THUMB_HEIGHT = 40;

type Thumb = { top: number; height: number; scrollable: boolean };

/**
 * Thin translucent page scrollbar drawn over the page for mouse/trackpad devices.
 * macOS overlay scrollbars ignore `scrollbar-color`, so the native one is hidden (globals.css)
 * and this one follows the page scroll. Difference blending keeps it visible on photos and paper.
 * Scrolling itself stays native; this bar only mirrors it and supports dragging and track clicks.
 */
export function PageScrollbar() {
  const [thumb, setThumb] = useState<Thumb>({ top: 0, height: 0, scrollable: false });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ pointerY: number; scrollY: number } | null>(null);

  useEffect(() => {
    const update = () => {
      const viewport = window.innerHeight;
      const content = document.documentElement.scrollHeight;
      const maxScroll = content - viewport;
      if (maxScroll <= 0) return setThumb({ top: 0, height: 0, scrollable: false });
      const height = Math.max(MIN_THUMB_HEIGHT, (viewport / content) * viewport);
      setThumb({ top: (window.scrollY / maxScroll) * (viewport - height), height, scrollable: true });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Content height changes as images load or the project filter changes.
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, []);

  /** Page pixels scrolled per pixel of thumb movement. */
  const scrollRatio = () => {
    const viewport = window.innerHeight;
    return (document.documentElement.scrollHeight - viewport) / (viewport - thumb.height);
  };

  const onThumbPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { pointerY: event.clientY, scrollY: window.scrollY };
    setDragging(true);
  };

  const onThumbPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const delta = (event.clientY - dragStart.current.pointerY) * scrollRatio();
    window.scrollTo({ top: dragStart.current.scrollY + delta, behavior: "instant" });
  };

  const onThumbPointerUp = () => {
    dragStart.current = null;
    setDragging(false);
  };

  /** Clicking the track pages up or down, like a native scrollbar. */
  const onTrackPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const direction = event.clientY < thumb.top ? -1 : 1;
    window.scrollBy({ top: direction * window.innerHeight * 0.9, behavior: "smooth" });
  };

  if (!thumb.scrollable) return null;

  return (
    <div
      aria-hidden="true"
      onPointerDown={onTrackPointerDown}
      className="page-scrollbar group fixed top-0 right-0 bottom-0 z-50 w-3 mix-blend-difference"
    >
      <div
        onPointerDown={onThumbPointerDown}
        onPointerMove={onThumbPointerMove}
        onPointerUp={onThumbPointerUp}
        onPointerCancel={onThumbPointerUp}
        style={{ height: thumb.height, transform: `translateY(${thumb.top}px)` }}
        className={`absolute top-0 right-0.5 cursor-grab bg-paper transition-[width,opacity] duration-200 active:cursor-grabbing ${
          dragging ? "w-1.5 opacity-80" : "w-[3px] opacity-45 group-hover:w-1.5 group-hover:opacity-70"
        }`}
      />
    </div>
  );
}
