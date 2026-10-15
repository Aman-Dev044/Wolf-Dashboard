"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

export function TrendingTabs({ tabs }: { tabs: { label: string; products: Product[] }[] }) {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <div>
      <div role="tablist" aria-label="Trending categories" className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            id={`trend-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`trend-panel-${i}`}
            onClick={() => setActive(i)}
            className={`relative shrink-0 rounded-full px-5 py-[13px] text-sm leading-[23px] font-medium tracking-[1px] capitalize transition-colors duration-300 ${
              active === i ? "text-ink" : "text-white/80 ring-1 ring-white/15 hover:text-amber hover:ring-amber/50"
            }`}
          >
            {active === i && (
              <motion.span layoutId="trend-pill" className="absolute inset-0 rounded-full bg-amber" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-12 min-h-[420px] sm:mt-[70px]" role="tabpanel" id={`trend-panel-${active}`} aria-labelledby={`trend-tab-${active}`}>
        <AnimatePresence mode="wait">
          <motion.ul
            key={current.label}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-[30px] xl:grid-cols-5"
          >
            {current.products.map((p) => (
              <motion.li
                key={p.id}
                variants={{ hidden: { opacity: 0, y: 40, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1 } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
