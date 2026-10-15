"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

/** Reading-progress bar pinned to the top of the viewport + animated "back to top" button. */
export function ScrollExtras() {
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 600));

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[110] h-[3px] origin-left bg-gradient-to-r from-amber via-amber-soft to-coral"
        style={{ scaleX }}
      />
      <AnimatePresence>
        {show && (
          <motion.button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.4, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, y: 30 }}
            whileHover={{ y: -4, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="fixed right-5 bottom-5 z-[70] grid size-12 place-items-center rounded-full bg-amber text-ink shadow-[0_12px_30px_-8px_rgba(252,173,56,0.7)] ring-4 ring-ink/10"
          >
            <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 48 48" aria-hidden>
              <motion.circle cx="24" cy="24" r="22" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="2.5" style={{ pathLength: scrollYProgress }} />
            </svg>
            <ArrowUp className="relative size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
