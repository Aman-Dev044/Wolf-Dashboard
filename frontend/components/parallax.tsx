"use client";

import Lenis from "lenis";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Whether scroll/pointer-driven motion should run. <MotionConfig reducedMotion="user"> only tames
 * animations, not styles bound to scroll values, so every scroll effect checks this itself.
 * `desktopOnly` also skips small screens, where shifting layers would collide in single-column layouts.
 */
export function useMotionAllowed(desktopOnly = false) {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(!desktopOnly);
  useEffect(() => {
    if (!desktopOnly) return;
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [desktopOnly]);
  return !reduce && wide;
}

/** Lenis smooth scrolling for the whole page, so every scroll-linked layer glides instead of stepping. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -120 } });
    // The mobile menu locks the page with body overflow:hidden – pause Lenis while it does.
    const observer = new MutationObserver(() => (document.body.style.overflow === "hidden" ? lenis.stop() : lenis.start()));
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);
  return null;
}

type ParallaxProps = {
  children?: React.ReactNode;
  className?: string;
  /** Vertical depth. Positive rises faster than the page (foreground), negative lags behind (background). */
  speed?: number;
  /** Horizontal travel in px across the element's pass through the viewport. */
  x?: number;
  /** Degrees of rotation across the pass. */
  rotate?: number;
  desktopOnly?: boolean;
  style?: React.CSSProperties;
};

/** Moves its children at a different speed than the page while the element crosses the viewport. */
export function Parallax({ children, className, speed = 0.2, x = 0, rotate = 0, desktopOnly = false, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useMotionAllowed(desktopOnly);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const d = on ? speed * 200 : 0;
  const y = useTransform(scrollYProgress, [0, 1], [d, -d]);
  const tx = useTransform(scrollYProgress, [0, 1], on ? [x / 2, -x / 2] : [0, 0]);
  const rot = useTransform(scrollYProgress, [0, 1], on ? [-rotate / 2, rotate / 2] : [0, 0]);
  return (
    <motion.div ref={ref} className={className} style={{ ...style, y, x: tx, rotate: rot }}>
      {children}
    </motion.div>
  );
}

/**
 * Layer tied to the page scroll position – for heroes at the very top, where every layer should
 * start at rest and peel apart as soon as the visitor scrolls.
 */
export function ScrollLayer({
  children,
  className,
  speed = 0.3,
  fade = 0,
  scaleTo = 1,
}: {
  children?: React.ReactNode;
  className?: string;
  /** px moved per px scrolled. Positive drifts down (background), negative rises (foreground). */
  speed?: number;
  /** Scroll distance (px) over which the layer fades out; 0 keeps it opaque. */
  fade?: number;
  scaleTo?: number;
}) {
  const on = useMotionAllowed();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => (on ? Math.min(v, 1600) * speed : 0));
  const opacity = useTransform(scrollY, (v) => (on && fade ? Math.max(0, 1 - v / fade) : 1));
  const scale = useTransform(scrollY, (v) => (on ? 1 + (scaleTo - 1) * Math.min(1, v / 900) : 1));
  return (
    <motion.div className={className} style={{ y, opacity, scale }}>
      {children}
    </motion.div>
  );
}

/** Follows the pointer with a spring – depth for floating badges and glow orbs. Desktop pointers only. */
export function MouseParallax({ children, className, strength = 24 }: { children?: React.ReactNode; className?: string; strength?: number }) {
  const on = useMotionAllowed(true);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 70, damping: 20, mass: 0.6 });
  const y = useSpring(my, { stiffness: 70, damping: 20, mass: 0.6 });
  useEffect(() => {
    if (!on) {
      mx.set(0);
      my.set(0);
      return;
    }
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * strength);
      my.set((e.clientY / window.innerHeight - 0.5) * strength);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [on, strength, mx, my]);
  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 50%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }: { children: React.ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const on = useMotionAllowed();
  const opacity = useTransform(progress, range, on ? [0.18, 1] : [1, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/** A line that draws itself as the visitor scrolls past it (timelines). */
export function ScrollLine({ className, track = "bg-white/15", fill = "bg-amber" }: { className?: string; track?: string; fill?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <div ref={ref} aria-hidden className={`${track} ${className ?? ""}`}>
      <motion.div className={`size-full origin-top ${fill}`} style={{ scaleY: on ? scaleY : 1 }} />
    </div>
  );
}

/** Grows a panel from slightly smaller to full size as it scrolls into view. */
export function ScrollZoom({ children, className, from = 0.86 }: { children: React.ReactNode; className?: string; from?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 30%"] });
  const scale = useTransform(scrollYProgress, [0, 1], on ? [from, 1] : [1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], on ? [0.3, 1] : [1, 1]);
  return (
    <motion.div ref={ref} className={className} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
}

/** Oversized outlined word that slides sideways behind a section as it scrolls. Decorative only. */
export function BackdropWord({ text, className = "", travel = 320, dark = true }: { text: string; className?: string; travel?: number; dark?: boolean }) {
  return (
    <Parallax x={travel} speed={0} className={`pointer-events-none absolute inset-x-0 select-none ${className}`}>
      <span aria-hidden className={`block text-center text-[clamp(5rem,16vw,16rem)] leading-none font-black tracking-tighter whitespace-nowrap uppercase ${dark ? "text-outline" : "text-outline-dark"}`}>
        {text}
      </span>
    </Parallax>
  );
}

/** Pulls its child toward the pointer while hovered (CTAs). */
export function Magnetic({ children, className = "", strength = 0.3 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useMotionAllowed(true);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 15, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 15, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (!on || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Endless horizontal strip whose speed and direction follow the scroll velocity, with a slight skew
 * while moving fast. Children must be the content duplicated twice (it loops at -50%).
 */
export function VelocityTrack({
  children,
  className = "",
  label,
  baseVelocity = -1.6,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  /** Percent of the track per second; negative runs leftwards. */
  baseVelocity?: number;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1200], [0, 4], { clamp: false });
  const skewX = useTransform(velocity, [-2500, 2500], reduce ? [0, 0] : [7, -7]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduce || paused.current) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    let move = dir.current * baseVelocity * (delta / 1000);
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  return (
    <motion.ul
      aria-label={label}
      className={`flex w-max ${className}`}
      style={{ x, skewX }}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      {children}
    </motion.ul>
  );
}

/** Amber ring that trails the mouse and swells over anything clickable. Fine pointers only. */
export function CursorGlow() {
  const on = useMotionAllowed(true);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 38, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 450, damping: 38, mass: 0.5 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!on) return;
    let shown = false;
    let over = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (!shown) setVisible((shown = true));
      const hit = !!(e.target as Element | null)?.closest?.("a, button, [role='button'], input, select, textarea, label, summary");
      if (hit !== over) setHover((over = hit));
    };
    const leave = () => setVisible((shown = false));
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [on, x, y]);

  if (!on) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[120] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber/80"
      style={{ x: sx, y: sy }}
      initial={false}
      animate={{
        width: hover ? 54 : 26,
        height: hover ? 54 : 26,
        opacity: visible ? 1 : 0,
        backgroundColor: hover ? "rgba(252,173,56,0.14)" : "rgba(252,173,56,0)",
      }}
      transition={{ duration: 0.35, ease: EASE }}
    />
  );
}

/** Re-runs a gentle entrance on every client-side navigation (used by app/template.tsx). */
let firstPaint = true;
export function PageTransition({ children }: { children: React.ReactNode }) {
  // The first server-rendered paint shows instantly; only later navigations animate in.
  const animateIn = !firstPaint;
  useEffect(() => {
    firstPaint = false;
  }, []);
  // Opacity + transform only: a lingering filter would turn this into the containing block for
  // fixed-position children such as the product lightbox.
  return (
    <motion.div initial={animateIn ? { opacity: 0, y: 32 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE }}>
      {children}
    </motion.div>
  );
}

