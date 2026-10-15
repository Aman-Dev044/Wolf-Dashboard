"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/client-api";

const empty = { name: "", email: "", phone: "", store: "", message: "" };

export function ContactForm({ stores }: { stores: string[] }) {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await api("/contact", { method: "POST", json: form });
      setStatus("done");
      setForm(empty);
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={submit} aria-label="Contact form" className="relative">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sr-only" htmlFor="c-name">Name</label>
        <input id="c-name" required value={form.name} onChange={set("name")} placeholder="Name*" autoComplete="name" className="field" />
        <label className="sr-only" htmlFor="c-email">Email</label>
        <input id="c-email" required type="email" value={form.email} onChange={set("email")} placeholder="Email*" autoComplete="email" className="field" />
        <label className="sr-only" htmlFor="c-phone">Phone number</label>
        <input id="c-phone" required type="tel" value={form.phone} onChange={set("phone")} placeholder="Phone number*" autoComplete="tel" className="field" />
        <label className="sr-only" htmlFor="c-store">Select Store</label>
        <select id="c-store" value={form.store} onChange={set("store")} className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23525252%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_1.1rem_center] bg-no-repeat">
          <option value="">Select Store</option>
          {stores.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="c-message">Message</label>
        <textarea id="c-message" rows={5} value={form.message} onChange={set("message")} placeholder="Message" className="field resize-y sm:col-span-2" />
      </div>
      <button type="submit" disabled={status === "loading"} className="btn-amber mt-6 w-full sm:w-auto">
        {status === "loading" ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />} Submit
      </button>
      <AnimatePresence>
        {status === "done" && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircle2 className="size-5" /> Thank you for your message. It has been sent.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="mt-4 text-sm font-medium text-coral">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
