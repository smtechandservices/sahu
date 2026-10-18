import { useEffect, useRef } from "react";

// Scroll speed in pixels per second — constant no matter how many items there are.
const SPEED = 60;
// Make each half of the track at least this many items so short lists still fill the screen.
const MIN_ITEMS_PER_HALF = 8;

/**
 * For use with the `.animate-marquee` class, which moves the track by -50%.
 * Returns a ref for the track and the items to render (the list repeated, then doubled,
 * so the second half lines up with the first and the loop is seamless).
 */
export function useMarquee(list) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.animationDuration = `${track.scrollWidth / 2 / SPEED}s`;
  }, [list]);

  if (list.length === 0) return { trackRef, items: [] };

  const half = Array.from({ length: Math.ceil(MIN_ITEMS_PER_HALF / list.length) }, () => list).flat();
  return { trackRef, items: [...half, ...half] };
}
