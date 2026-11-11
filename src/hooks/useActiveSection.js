import { useEffect, useState } from "react";

/**
 * Tracks which portfolio section is currently active.
 *
 * Uses scroll position rather than IntersectionObserver because tall sections
 * (especially Home) can cause the observer to report the wrong section during
 * smooth-scroll navigation. Instead we find the section whose top has most
 * recently crossed a trigger line near the top of the viewport.
 *
 * Also handles initial hash navigation so a URL like /#projects lands on the
 * correct section and reflects it in the navbar immediately.
 */
const NAVBAR_OFFSET = 96; // navbar height + small breathing room

export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionIds.length) return;

    const getOffset = (id) => {
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
    };

    const compute = () => {
      const trigger = window.scrollY + NAVBAR_OFFSET;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        if (getOffset(id) <= trigger) current = id;
      }
      // If we're at the very bottom, force the last section active.
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 4
      ) {
        current = sectionIds[sectionIds.length - 1];
      }
      setActiveId(current);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };

    // Initial hash handling: scroll into view then compute active state.
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      if (sectionIds.includes(id)) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
          window.scrollTo({ top, behavior: "auto" });
        }
      }
    }

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, [sectionIds.join(",")]);

  return activeId;
}
