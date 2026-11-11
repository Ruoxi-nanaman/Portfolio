import { useEffect, useState } from "react";
import Moon3D from "./Moon3D.jsx";

/**
 * Full-screen loading overlay shown while the app initializes.
 *
 * Uses the same Moon3D visual as the Home hero so there is no duplicated Moon
 * implementation. It appears on top of the app and stays visible for a minimum
 * duration so the Moon can be appreciated, then fades out once the page has
 * finished loading.
 */
const FADE_MS = 600;
const MIN_VISIBLE_MS = 5000;

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState("show"); // 'show' -> 'hide'
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    let minTimer = 0;
    let fadeTimer = 0;
    let rafId = 0;
    const startedAt = Date.now();

    const beginHide = () => {
      setPhase("hide");
      fadeTimer = setTimeout(() => {
        setMounted(false);
        if (typeof onDone === "function") onDone();
      }, FADE_MS);
    };

    // Once the page is ready, wait out any remaining minimum display time
    // before starting the fade-out.
    const onReady = () => {
      const remaining = Math.max(MIN_VISIBLE_MS - (Date.now() - startedAt), 0);
      minTimer = setTimeout(beginHide, remaining);
    };

    if (document.readyState === "complete") {
      // Defer to the next paint so the overlay is visibly rendered first.
      rafId = requestAnimationFrame(() => requestAnimationFrame(onReady));
    } else {
      window.addEventListener("load", onReady, { once: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(minTimer);
      clearTimeout(fadeTimer);
      window.removeEventListener("load", onReady);
    };
  }, [onDone]);

  if (!mounted) return null;

  return (
    <div
      className={`loading-screen ${phase === "hide" ? "loading-screen--hidden" : ""}`}
      aria-hidden="true"
    >
      <div className="loading-screen__moon">
        <Moon3D interactive={false} autoRotateSpeed={0.4} className="h-full w-full" />
      </div>
      <div className="loading-screen__indicator" aria-label="Loading">
        <span className="loading-screen__dot" />
        <span className="loading-screen__dot" style={{ animationDelay: "0.15s" }} />
        <span className="loading-screen__dot" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}
