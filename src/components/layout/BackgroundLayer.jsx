import { useEffect, useRef } from "react";

/**
 * Shared continuous background environment for the entire page.
 *
 * Layers (back to front):
 *  1. Base charcoal/blue-black gradient — handled by body::before (stable).
 *  2. Drifting ambient blue glow (DOM) — slow autonomous drift + scroll parallax.
 *  3. Celestial starfield (canvas) — stars falling diagonally from the top-left
 *     toward the bottom-right (~35–45° below horizontal) with tapered light
 *     trails, cursor repulsion, twinkling, and depth via varied sizes/speeds.
 *  4. Cursor-following ambient light (canvas) — soft blue-white glow that trails
 *     the cursor with eased interpolation (independent of the star trails).
 *
 * The canvas is fixed to the viewport so it covers the whole scrollable page
 * without breaking during scroll. All star data lives in refs (not React state)
 * so the animation loop never triggers re-renders.
 *
 * Accessibility:
 *  - prefers-reduced-motion → canvas is skipped entirely; a static starfield
 *    remains via body::after and the ambient glow is frozen.
 *  - touch devices → no cursor interactions (no mousemove listener); only the
 *    ambient starfield animation runs.
 */

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const IS_TOUCH =
  typeof window !== "undefined" &&
  (window.matchMedia?.("(pointer: coarse)").matches ||
    "ontouchstart" in window);

/* ---- Star system configuration (tuned for subtlety) ---- */
const STAR_DENSITY = 0.00009; // stars per pixel of viewport area
const MAX_STARS = 160;
const MIN_STARS = 60;
const REPULSION_RADIUS = 140;
const REPULSION_STRENGTH = 90;
const RECYCLE_MARGIN = 60; // off-screen gap used when recycling at the edges
const MIN_ANGLE_DEG = 35; // diagonal direction, measured downward from horizontal
const MAX_ANGLE_DEG = 45;

function createStar(w, h, edge = false) {
  const layer = Math.random(); // 0 far → 1 near

  // Diagonal heading: 35–45° below horizontal, so both x and y increase
  // (top-left → bottom-right). Each star gets its own angle so the field
  // never moves in lockstep.
  const angle =
    ((MIN_ANGLE_DEG + Math.random() * (MAX_ANGLE_DEG - MIN_ANGLE_DEG)) *
      Math.PI) /
    180;
  const ux = Math.cos(angle); // unit direction
  const uy = Math.sin(angle);
  const speed = 0.35 + layer * 1.1; // magnitude (px/frame) — nearer = faster

  // Most stars keep a short, subtle streak; ~16% get noticeably longer, brighter
  // trails. Clamped so nothing reads as an exaggerated shooting star.
  const trailiness =
    Math.random() < 0.16 ? 1.4 + Math.random() * 0.4 : 0.5 + Math.random() * 0.45;
  const trailLen = Math.min(58, Math.max(4, (10 + layer * 34) * trailiness));

  // Recycled stars enter along the top / left boundaries; the initial fill is
  // spread across the viewport so the field is populated immediately.
  let x;
  let y;
  if (edge) {
    if (Math.random() < 0.5) {
      x = Math.random() * w; // from the top edge
      y = -RECYCLE_MARGIN - Math.random() * 40;
    } else {
      x = -RECYCLE_MARGIN - Math.random() * 40; // from the left edge
      y = Math.random() * h;
    }
  } else {
    x = Math.random() * w;
    y = Math.random() * h;
  }

  return {
    x,
    y,
    ux, // unit heading (used for the trailing direction)
    uy,
    vx: ux * speed, // velocity — both components positive
    vy: uy * speed,
    size: 0.6 + layer * 1.6,
    baseOpacity: 0.25 + layer * 0.6,
    twinkleSpeed: 0.5 + Math.random() * 1.5,
    twinklePhase: Math.random() * Math.PI * 2,
    trailLen,
    // repulsion displacement (eased back toward 0)
    dx: 0,
    dy: 0,
  };
}

export default function BackgroundLayer() {
  const ambientRef = useRef(null);
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const cursorRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, visible: false });
  const lightRef = useRef({ x: -9999, y: -9999, opacity: 0 });

  useEffect(() => {
    /* ---------- Ambient glow (DOM) — preserved, scroll-responsive ---------- */
    let rafId = 0;
    let scrollY = window.scrollY || 0;
    let scrollTarget = scrollY;

    const onScroll = () => {
      scrollTarget = window.scrollY || 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let start = performance.now();

    const tickAmbient = (now) => {
      const t = (now - start) / 1000;
      scrollY += (scrollTarget - scrollY) * 0.06;

      if (ambientRef.current) {
        const driftX = Math.sin(t * 0.08) * 80;
        const driftY = Math.cos(t * 0.06) * 60;
        ambientRef.current.style.transform = `translate3d(${
          driftX + scrollY * 0.02
        }px, ${driftY + scrollY * -0.015}px, 0)`;
      }
    };

    /* ---------- Canvas starfield + cursor light ---------- */
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // (Re)seed stars to match viewport size.
      const target = Math.min(
        MAX_STARS,
        Math.max(MIN_STARS, Math.floor(width * height * STAR_DENSITY)),
      );
      const stars = starsRef.current;
      if (stars.length === 0) {
        for (let i = 0; i < target; i++) stars.push(createStar(width, height));
      } else if (stars.length < target) {
        while (stars.length < target) stars.push(createStar(width, height));
      } else {
        stars.length = target;
      }
    };

    const drawStar = (s, t) => {
      const twinkle = 0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
      const opacity = Math.min(1, s.baseOpacity * twinkle);
      const x = s.x + s.dx;
      const y = s.y + s.dy;

      // Diagonal trail — extends backward toward the top-left (opposite the
      // heading) and is recomputed from the live head each frame, so it always
      // travels with the star and never floats on its own.
      const len = s.trailLen * (0.75 + twinkle * 0.25);
      if (len > 2) {
        const tailX = x - s.ux * len;
        const tailY = y - s.uy * len;

        // Soft glow: a faint, slightly wider round-cap line behind the streak.
        ctx.globalAlpha = 1;
        ctx.strokeStyle = `rgba(150, 190, 235, ${0.1 * opacity})`;
        ctx.lineWidth = Math.max(1.2, s.size * 1.6);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Tapered core streak: a thin triangle from the head (wide) to the tail
        // (a point), filled with a directional gradient — bright blue-white near
        // the head, fading to transparent toward the upper-left end.
        const px = -s.uy; // unit vector perpendicular to the heading
        const py = s.ux;
        const hw = Math.max(0.5, s.size * 0.6); // head half-width (thin)
        const gradient = ctx.createLinearGradient(x, y, tailX, tailY);
        gradient.addColorStop(0, `rgba(230, 240, 252, ${0.75 * opacity})`);
        gradient.addColorStop(0.25, `rgba(200, 222, 248, ${0.3 * opacity})`);
        gradient.addColorStop(1, "rgba(170, 198, 232, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x + px * hw, y + py * hw);
        ctx.lineTo(x - px * hw, y - py * hw);
        ctx.lineTo(tailX, tailY);
        ctx.closePath();
        ctx.fill();
      }

      // Star core (covers the head junction of the streak).
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#e2ecf9";
      ctx.beginPath();
      ctx.arc(x, y, s.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawLight = () => {
      const l = lightRef.current;
      if (l.opacity <= 0.01) return;
      const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, 220);
      g.addColorStop(0, `rgba(166, 196, 230, ${0.18 * l.opacity})`);
      g.addColorStop(0.3, `rgba(110, 168, 216, ${0.08 * l.opacity})`);
      g.addColorStop(1, "rgba(34, 62, 97, 0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(l.x, l.y, 220, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (now) => {
      if (!ctx) return;
      const t = now / 1000;

      // --- Ambient glow ---
      tickAmbient(now);

      // --- Clear canvas ---
      ctx.clearRect(0, 0, width, height);

      const cursor = cursorRef.current;
      const light = lightRef.current;

      // --- Cursor light easing ---
      if (!IS_TOUCH) {
        if (cursor.visible) {
          light.x += (cursor.x - light.x) * 0.08;
          light.y += (cursor.y - light.y) * 0.08;
          light.opacity += (1 - light.opacity) * 0.05;
        } else {
          light.opacity += (0 - light.opacity) * 0.05;
        }
      }

      const stars = starsRef.current;
      const repRadius2 = REPULSION_RADIUS * REPULSION_RADIUS;

      for (const s of stars) {
        // Diagonal drift: x and y both increase (top-left → bottom-right).
        s.x += s.vx;
        s.y += s.vy;

        // Recycle once the head has left the bottom or right boundary (the trail
        // only extends up-left behind the head) → re-enter along the top / left
        // so the diagonal flow stays continuous and seamless.
        if (
          s.x > width + RECYCLE_MARGIN ||
          s.y > height + RECYCLE_MARGIN
        ) {
          const respawn = createStar(width, height, true);
          Object.assign(s, respawn, { dx: 0, dy: 0 });
        }

        // --- Cursor repulsion ---
        if (!IS_TOUCH && cursor.visible) {
          const ddx = s.x - cursor.x;
          const ddy = s.y - cursor.y;
          const dist2 = ddx * ddx + ddy * ddy;
          if (dist2 < repRadius2 && dist2 > 0.0001) {
            const dist = Math.sqrt(dist2);
            const force =
              (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
            // accumulate displacement
            s.dx += (ddx / dist) * force * 0.04;
            s.dy += (ddy / dist) * force * 0.04;
          }
        }

        // Ease displacement back toward 0 (return to original trajectory).
        s.dx *= 0.92;
        s.dy *= 0.92;

        drawStar(s, t);
      }

      // --- Cursor light (drawn above stars) ---
      drawLight();

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(tick);
    };

    if (canvas && ctx && !REDUCED_MOTION) {
      resize();
      window.addEventListener("resize", resize);
      rafId = requestAnimationFrame(tick);
    }

    /* ---------- Cursor tracking ---------- */
    let mouseActive = false;
    const onMouseMove = (e) => {
      const c = cursorRef.current;
      c.x = e.clientX;
      c.y = e.clientY;
      c.visible = true;
      mouseActive = true;
    };
    const onMouseLeave = () => {
      cursorRef.current.visible = false;
    };
    const onMouseEnter = () => {
      if (mouseActive) cursorRef.current.visible = true;
    };

    if (!IS_TOUCH && !REDUCED_MOTION) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mouseenter", onMouseEnter);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      if (!IS_TOUCH) {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("mouseenter", onMouseEnter);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
    >
      {/* Drifting ambient blue glow (DOM, scroll-responsive) */}
      <div
        ref={ambientRef}
        className="bg-layer-ambient absolute left-1/2 top-1/3 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34,62,97,0.32) 0%, rgba(34,62,97,0.12) 40%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* Celestial starfield + cursor light (canvas) */}
      {!REDUCED_MOTION && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "transform" }}
        />
      )}
    </div>
  );
}
