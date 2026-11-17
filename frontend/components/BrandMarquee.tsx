"use client";

import Image from "next/image";
import { Stagger, StaggerItem } from "./motion";
import { VelocityTrack } from "./parallax";

/**
 * Endless logo strip that speeds up, reverses and leans with the scroll; logos pop in one by one
 * the first time the strip scrolls into view. Hovering pauses it.
 */
export function BrandMarquee({ logos }: { logos: { name: string; src: string }[] }) {
  const row = [...logos, ...logos];
  return (
    <Stagger gap={0.07} className="relative overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      {/* Spacing is a per-item margin, not `gap`, so the doubled row loops seamlessly at exactly -50%. */}
      <VelocityTrack label="Partner brands">
        {row.map((l, i) => (
          <StaggerItem
            as="li"
            variant="zoom"
            key={i}
            className="mr-5 grid h-28 w-48 shrink-0 place-items-center rounded-2xl bg-white px-6 ring-1 ring-black/5 transition-[translate,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-xl hover:ring-amber/60 sm:h-32 sm:w-56"
          >
            <Image
              src={l.src}
              alt={i < logos.length ? `${l.name} logo` : ""}
              aria-hidden={i >= logos.length || undefined}
              width={160}
              height={70}
              data-anim=""
              className="max-h-16 w-auto object-contain grayscale transition-[filter,scale] duration-500 hover:scale-110 hover:grayscale-0"
            />
          </StaggerItem>
        ))}
      </VelocityTrack>
    </Stagger>
  );
}
