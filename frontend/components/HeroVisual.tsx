"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { BadgeCheck, Smartphone } from "lucide-react";
import { useRef } from "react";
import { Tilt } from "./motion";
import { MouseParallax, useMotionAllowed } from "./parallax";
import { ImageReveal } from "./AnimatedImage";

export function HeroVisual({ image }: { image: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Picture sinks and the badges lift away at different rates – three depths as the hero scrolls off.
  const y = useTransform(scrollYProgress, [0, 1], on ? [0, 140] : [0, 0]);
  const badgeUp = useTransform(scrollYProgress, [0, 1], on ? [0, -120] : [0, 0]);
  const badgeUpFast = useTransform(scrollYProgress, [0, 1], on ? [0, -220] : [0, 0]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative"
    >
      <div className="absolute -inset-6 animate-spin-slow rounded-[40px] bg-[conic-gradient(from_0deg,transparent,rgba(47,128,255,0.45),transparent_40%)] blur-2xl" />
      <MouseParallax strength={14} className="relative">
        <Tilt className="relative" max={5}>
          <motion.div style={{ y }} className="relative aspect-[4/3] overflow-hidden rounded-[32px] ring-1 ring-white/15 lg:aspect-[5/4]">
            <ImageReveal wipe="zoom" delay={0.25} blur={false}>
              <Image
                src={image}
                data-anim=""
                alt="Inside a Wolf store"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="animate-kenburns object-cover object-center"
              />
            </ImageReveal>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </motion.div>
        </Tilt>
      </MouseParallax>

      {/* Layers: pointer depth (outer) → scroll lift → entrance → idle float. Each owns its own transform. */}
      <MouseParallax strength={-36} className="absolute -bottom-6 -left-2 sm:-left-8">
        <motion.div style={{ y: badgeUp }}>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="glass flex animate-float items-center gap-3 rounded-2xl px-5 py-4 text-white">
              <span className="grid size-10 place-items-center rounded-xl bg-azure text-white">
                <BadgeCheck className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Telstra Partner</span>
                <span className="block text-xs text-slate">since 1991</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </MouseParallax>

      <MouseParallax strength={48} className="absolute top-6 -right-2 hidden sm:block lg:-right-6">
        <motion.div style={{ y: badgeUpFast }}>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="glass flex animate-float items-center gap-3 rounded-2xl px-5 py-4 text-white [animation-delay:-3s]">
              <span className="grid size-10 place-items-center rounded-xl bg-white text-ink">
                <Smartphone className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Latest devices</span>
                <span className="block text-xs text-slate">Apple · Samsung · Google</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </MouseParallax>
    </motion.div>
  );
}
