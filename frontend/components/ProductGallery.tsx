"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useState } from "react";
import type { Image as Img } from "@/lib/types";

export function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const list = images.length ? images : [{ src: "/uploads/2026/07/dark-logo.png", alt: name }];
  const go = (d: number) => setI((v) => (v + d + list.length) % list.length);

  return (
    <div className="lg:sticky lg:top-24">
      <div
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
        onClick={() => setLightbox(true)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            drag={list.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          >
            <Image
              data-anim=""
              src={list[i].src}
              alt={list[i].alt || name}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 transition-transform duration-200"
              style={zoom ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-ink/80 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Expand className="size-4" />
        </span>
        {list.length > 1 && (
          <>
            <button type="button" aria-label="Previous image" onClick={(e) => (e.stopPropagation(), go(-1))} className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-lg transition hover:bg-amber lg:opacity-0 lg:group-hover:opacity-100">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" aria-label="Next image" onClick={(e) => (e.stopPropagation(), go(1))} className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-lg transition hover:bg-amber lg:opacity-0 lg:group-hover:opacity-100">
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {list.length > 1 && (
        <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
          {list.map((im, k) => (
            <motion.li key={im.src} className="shrink-0" initial={{ opacity: 0, y: 16, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3 + k * 0.07, type: "spring", stiffness: 260, damping: 20 }}>
              <button
                type="button"
                onClick={() => setI(k)}
                aria-label={`Show image ${k + 1}`}
                aria-current={k === i}
                className={`relative block size-20 overflow-hidden rounded-2xl bg-white ring-2 transition-all sm:size-24 ${k === i ? "ring-amber" : "ring-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image data-anim="" src={im.src} alt="" fill sizes="96px" className="object-contain p-1.5 transition-[scale] duration-500 hover:scale-110" />
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${name} images`}
            className="fixed inset-0 z-[120] grid place-items-center bg-black/90 p-4"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button type="button" aria-label="Close" className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-amber hover:text-ink">
              <X className="size-5" />
            </button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <Image data-anim="" src={list[i].src} alt={list[i].alt || name} fill sizes="100vw" className="object-contain" />
            </motion.div>
            {list.length > 1 && (
              <div className="absolute bottom-6 flex gap-3" onClick={(e) => e.stopPropagation()}>
                <button type="button" aria-label="Previous image" onClick={() => go(-1)} className="grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-amber hover:text-ink">
                  <ChevronLeft className="size-5" />
                </button>
                <span className="grid place-items-center px-3 text-sm text-white/80">
                  {i + 1} / {list.length}
                </span>
                <button type="button" aria-label="Next image" onClick={() => go(1)} className="grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-amber hover:text-ink">
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
