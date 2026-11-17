"use client";

import { ArrowRight, Loader2 } from "lucide-react";
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
    <form onSubmit={submit} className="w-full max-w-xl" aria-label="Newsletter Form">
      <div className="flex flex-col gap-3 rounded-full sm:flex-row sm:bg-ink sm:p-1.5 sm:ring-1 sm:ring-ink">
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
          className="field-dark rounded-full bg-ink sm:border-0 sm:bg-transparent sm:focus:ring-0"
        />
        <button type="submit" disabled={state.status === "loading"} className="btn-amber shrink-0 px-7 py-2.5 text-base">
          {state.status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <>Subscribe <ArrowRight className="size-4" /></>}
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
