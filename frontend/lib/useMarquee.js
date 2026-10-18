import { useEffect, useRef, useState } from "react";

// Scroll speed in pixels per second — constant no matter how many items there are.
const SPEED = 60;

/**
 * For use with a marquee animation that moves the track by -50% (e.g. `.animate-marquee`).
 * Returns a ref for the track and the items to render: the list repeated until one half of
 * the track is at least as wide as its container, then doubled so the loop is seamless.
 * Re-measures on resize, so short lists fill any screen width.
 *
 * Space items with padding/margin on each item, not `gap`, or the loop jumps by half a gap.
 */
export function useMarquee(list) {
  const trackRef = useRef(null);
  const [copies, setCopies] = useState(1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || list.length === 0) return;

    const fit = () => {
      const half = track.scrollWidth / 2;
      const perCopy = half / copies;
      const viewport = track.parentElement?.clientWidth || window.innerWidth;
      if (perCopy > 0) {
        const needed = Math.max(1, Math.ceil(viewport / perCopy));
        if (needed !== copies) {
          setCopies(needed);
          return;
        }
      }
      track.style.animationDuration = `${half / SPEED}s`;
    };

    const observer = new ResizeObserver(fit);
    observer.observe(track);
    if (track.parentElement) observer.observe(track.parentElement);
    return () => observer.disconnect();
  }, [list, copies]);

  if (list.length === 0) return { trackRef, items: [] };

  const half = Array.from({ length: copies }, () => list).flat();
  return { trackRef, items: [...half, ...half] };
}
