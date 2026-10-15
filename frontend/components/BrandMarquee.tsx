import Image from "next/image";
import { Stagger, StaggerItem } from "./motion";

/** Endless logo strip; logos pop in one by one the first time the strip scrolls into view. */
export function BrandMarquee({ logos }: { logos: { name: string; src: string }[] }) {
  const row = [...logos, ...logos];
  return (
    <Stagger gap={0.07} className="group relative overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <ul className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]" aria-label="Partner brands">
        {row.map((l, i) => (
          <StaggerItem
            as="li"
            variant="zoom"
            key={i}
            className="grid h-28 w-48 shrink-0 place-items-center rounded-2xl bg-white px-6 ring-1 ring-black/5 transition-[translate,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-xl hover:ring-amber/60 sm:h-32 sm:w-56"
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
      </ul>
    </Stagger>
  );
}
