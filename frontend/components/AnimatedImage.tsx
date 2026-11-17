"use client";

import Image, { type ImageProps } from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Wipe = "up" | "down" | "left" | "right" | "zoom" | "fade";

const clips: Record<Wipe, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  zoom: "inset(12% 12% 12% 12%)",
  fade: "inset(0% 0% 0% 0%)",
};

type RevealProps = {
  children: React.ReactNode;
  /** Classes for the observed wrapper. Defaults to filling the positioned parent. */
  className?: string;
  wipe?: Wipe;
  delay?: number;
  duration?: number;
  /** Moves the picture slightly against the scroll direction. */
  parallax?: boolean;
  /** Blur-in while revealing. */
  blur?: boolean;
};

/**
 * Scroll-in reveal for pictures: a clip-path wipe on the (always visible, observed) wrapper,
 * plus a scale-down / de-blur on the inner layer. Hover zoom is left to the image itself.
 */
export function ImageReveal({ children, className = "absolute inset-0", wipe = "up", delay = 0, duration = 1.2, parallax = false, blur = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Scroll-bound styles bypass MotionConfig's reducedMotion, so honour it here.
  const y = useTransform(scrollYProgress, [0, 1], parallax && !reduce ? ["-8%", "8%"] : ["0%", "0%"]);

  const outer: Variants = {
    hidden: { clipPath: clips[wipe], opacity: wipe === "fade" ? 0 : 1 },
    show: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, transition: { duration, delay, ease: EASE } },
  };
  const rest = parallax ? 1.18 : 1;
  const inner: Variants = {
    hidden: { scale: rest + 0.15, filter: blur ? "blur(10px)" : "blur(0px)" },
    show: { scale: rest, filter: "blur(0px)", transition: { duration: duration + 0.3, delay, ease: EASE } },
  };

  // The observed element must stay unclipped: Chrome's IntersectionObserver honours the target's own
  // clip-path, so a fully wiped element would never count as "in view". The clip lives one level down.
  return (
    <motion.div
      ref={ref}
      className={`group/img ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div className="absolute inset-0 overflow-hidden" variants={outer}>
        <motion.div className="absolute inset-0" variants={inner} style={{ y }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

type AnimatedImageProps = ImageProps & {
  wrapperClassName?: string;
  wipe?: Wipe;
  delay?: number;
  parallax?: boolean;
  blur?: boolean;
  /** Zoom the picture on hover (default true). */
  hoverZoom?: boolean;
  /** Slow, endless Ken Burns pan/zoom – for banners and backgrounds. */
  kenBurns?: boolean;
};

/** next/image (fill mode) with reveal-on-scroll, optional parallax, hover zoom and Ken Burns. */
export function AnimatedImage({
  wrapperClassName,
  wipe,
  delay,
  parallax,
  blur,
  hoverZoom = true,
  kenBurns = false,
  className = "",
  alt,
  ...props
}: AnimatedImageProps) {
  return (
    <ImageReveal className={wrapperClassName} wipe={wipe} delay={delay} parallax={parallax} blur={blur}>
      <Image
        {...props}
        alt={alt}
        fill
        data-anim=""
        className={`${className} ${kenBurns ? "animate-kenburns" : ""} ${
          hoverZoom ? "transition-[scale] duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/img:scale-[1.07]" : ""
        }`}
      />
    </ImageReveal>
  );
}
