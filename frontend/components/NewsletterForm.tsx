"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/client-api";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ status: "idle" | "loading" | "done" | "error"; message?: string }>({ status: "idle" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: "loading" });
    try {
      const res = await api<{ message: string }>("/newsletter", { method: "POST", json: { email } });
      setState({ status: "done", message: res.message });
      setEmail("");
    } catch (err) {
      setState({ status: "error", message: (err as Error).message });
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto w-full max-w-xl" aria-label="Newsletter Form">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full flex-1 rounded-lg border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/70 transition focus:border-ink focus:ring-4 focus:ring-ink/10 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state.status === "loading"}
          className="inline-flex min-w-36 shrink-0 items-center justify-center rounded-lg bg-ink px-8 py-3 text-[15px] font-medium text-amber transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:shadow-lg disabled:pointer-events-none disabled:opacity-70"
        >
          {state.status === "loading" ? <Loader2 className="size-4 animate-spin" /> : "Subscribe"}
        </button>
      </div>
      {state.message && (
        <p role="status" className={`mt-3 text-sm font-medium ${state.status === "error" ? "text-red-900" : "text-ink"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
