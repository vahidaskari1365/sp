"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const INTRO_KEY = "termeh-cinema-intro";

/**
 * Site-wide animated film grain. A fixed, pointer-transparent noise layer
 * that gives every page a subtle 35mm texture.
 */
export function FilmGrain() {
  return <div aria-hidden className="film-grain" />;
}

/**
 * Thin gold progress bar pinned to the top edge, tied to scroll position —
 * the "film strip" that fills as the story advances.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.width = `${progress * 100}%`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={barRef} aria-hidden className="progress-cinema" />;
}

/**
 * Cinematic opening: dark curtains part after the brand mark fades in.
 * Plays once per browser session and is skipped entirely when the visitor
 * prefers reduced motion.
 */
export function CinemaIntro() {
  const [phase, setPhase] = useState<"hidden" | "playing" | "opening">("hidden");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem(INTRO_KEY)) return;

    document.body.style.overflow = "hidden";
    const playTimer = window.setTimeout(() => setPhase("playing"), 20);
    const openTimer = window.setTimeout(() => setPhase("opening"), 1500);
    const doneTimer = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      document.body.style.overflow = "";
      setPhase("hidden");
    }, 2600);

    return () => {
      window.clearTimeout(playTimer);
      window.clearTimeout(openTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      className="intro-overlay"
      data-open={phase === "opening" ? "true" : "false"}
    >
      <div className="intro-backdrop" />
      <div className="intro-curtain intro-curtain-left" />
      <div className="intro-curtain intro-curtain-right" />
      <div className="intro-letterbox" style={{ top: 0 }} />
      <div className="intro-letterbox" style={{ bottom: 0 }} />
      <div className="intro-content">
        <div className="relative mx-auto grid size-28 place-items-center">
          <span className="intro-ring" />
          <span className="intro-ring" style={{ animationDelay: "0.7s" }} />
          <span className="grid size-20 place-items-center rounded-full border border-gold/40 bg-night-soft/80 font-latin text-3xl text-gold backdrop-blur">
            T
          </span>
        </div>
        <p className="intro-mark mt-6 text-4xl font-black tracking-tight text-bone">ترمه</p>
        <p className="intro-mark mt-3 text-[11px] tracking-[0.5em] text-gold/90" style={{ animationDelay: "0.25s" }}>
          پوشاک معاصر ایرانی
        </p>
        <div className="intro-mark cine-line mx-auto mt-6 w-24" style={{ animationDelay: "0.45s" }} />
      </div>
    </div>
  );
}

/**
 * Scroll parallax wrapper. Translates its content against the scroll
 * direction at a given speed — the slow drift that separates foreground
 * from background in film photography.
 */
export function Parallax({
  children,
  className = "",
  speed = 0.12,
  maxShift = 90,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  maxShift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const offset = rect.top + rect.height / 2 - viewportCenter;
      const shift = Math.max(-maxShift, Math.min(maxShift, -offset * speed));
      node.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed, maxShift]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}

/** Slow-rising golden dust motes for hero and night sections. */
export function Dust({
  count = 7,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const motes = Array.from({ length: count }, (_, index) => {
    const size = 3 + ((index * 37) % 5);
    return {
      left: `${8 + ((index * 53) % 84)}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${11 + ((index * 29) % 12)}s`,
      animationDelay: `${(index * 2.3) % 11}s`,
    };
  });

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {motes.map((mote, index) => (
        <span key={index} className="dust" style={mote} />
      ))}
    </div>
  );
}
