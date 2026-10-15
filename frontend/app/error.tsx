"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="grid min-h-[60vh] place-items-center bg-ink px-4 text-center text-white">
      <div>
        <h1 className="text-4xl font-semibold">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-slate">Please try again. If the problem continues, give your nearest Wolf store a call.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={reset} className="btn-amber">Try again</button>
          <Link href="/" className="btn-ghost">Home</Link>
        </div>
      </div>
    </section>
  );
}
