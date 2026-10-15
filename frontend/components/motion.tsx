"use client";

import { animate, motion, useInView, useMotionValue, useTransform, type Variants } from "motion/react";
import { useEffect, useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Mirrors the entrance animations used on the original site (fadeInUp, fadeInLeft, fadeInRight, zoomIn, slideInUp).
const presets: Record<string, Variants> = {
  up: { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } },
  slide: { hidden: { opacity: 0, y: 90 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  blur: { hidden: { opacity: 0, filter: "blur(12px)", y: 20 }, show: { opacity: 1, filter: "blur(0px)", y: 0 } },
};

type RevealProps = {
  children: React.ReactNode;
  variant?: keyof typeof presets;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
};

export function Reveal({ children, variant = "up", delay = 0, duration = 0.8, className, as = "div" }: RevealProps) {
  const M = motion[as];
  return (
    <M
      className={className}
      variants={presets[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Staggers direct children that are wrapped in <StaggerItem>. */
export function Stagger({ children, className, gap = 0.08, as = "div" }: { children: React.ReactNode; className?: string; gap?: number; as?: "div" | "ul" | "ol" }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, variant = "up", as = "div" }: { children: React.ReactNode; className?: string; variant?: keyof typeof presets; as?: "div" | "li" }) {
  const M = motion[as];
  return (
    <M className={className} variants={presets[variant]} transition={{ duration: 0.7, ease: EASE }}>
      {children}
    </M>
  );
}

/** Splits a heading into words that rise in one after another. */
export function SplitWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  // Observe the visible wrapper: the words themselves start clipped, so they'd never register as "in view".
  // `className` (e.g. text-gradient) goes on every word: background-clip:text on the parent
  // doesn't paint children that are being transformed on their own layer.
  return (
    <motion.span
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block ${className ?? ""}`}
            variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Counts up to a number when scrolled into view. */
export function Counter({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => Math.round(v).toString() + suffix);
  useEffect(() => {
    if (inView) animate(value, to, { duration: 2, ease: EASE });
  }, [inView, to, value]);
  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
}

/** Subtle 3D tilt that follows the pointer. */
export function Tilt({ children, className, max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      }}
      onPointerLeave={() => {
        animate(rx, 0, { duration: 0.5 });
        animate(ry, 0, { duration: 0.5 });
      }}
    >
      {children}
    </motion.div>
  );
}
