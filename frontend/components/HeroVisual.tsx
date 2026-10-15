"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { BadgeCheck, Smartphone } from "lucide-react";
import { useRef } from "react";
import { Tilt } from "./motion";
import { ImageReveal } from "./AnimatedImage";

export function HeroVisual({ image }: { image: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative"
    >
      <div className="absolute -inset-6 animate-spin-slow rounded-[40px] bg-[conic-gradient(from_0deg,transparent,rgba(252,173,56,0.45),transparent_40%)] blur-2xl" />
      <Tilt className="relative" max={5}>
        <motion.div style={{ y }} className="relative aspect-[4/3] overflow-hidden rounded-[32px] ring-1 ring-white/15 lg:aspect-[5/4]">
          <ImageReveal wipe="zoom" delay={0.25} blur={false}>
            <Image
              src={image}
              data-anim=""
              alt="Wolf team member giving a thumbs up in store"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="animate-kenburns object-cover object-[70%_center]"
            />
          </ImageReveal>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        </motion.div>
      </Tilt>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="glass absolute -bottom-6 -left-2 flex animate-float items-center gap-3 rounded-2xl px-5 py-4 text-white sm:-left-8"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-amber text-ink">
          <BadgeCheck className="size-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Telstra Partner</span>
          <span className="block text-xs text-slate">since 1991</span>
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        className="glass absolute top-6 -right-2 hidden animate-float items-center gap-3 rounded-2xl px-5 py-4 text-white [animation-delay:-3s] sm:flex lg:-right-6"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-white text-ink">
          <Smartphone className="size-5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Latest devices</span>
          <span className="block text-xs text-slate">Apple · Samsung · Google</span>
        </span>
      </motion.div>
    </motion.div>
  );
}
