"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, LogOut, Package, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/components/StoreProvider";
import { OrderSummary, statusLabel } from "@/components/OrderSummary";
import { api } from "@/lib/client-api";
import { money } from "@/lib/format";
import type { Order, User } from "@/lib/types";

export function AccountView() {
  const { user, ready, logout } = useStore();
  if (!ready) return <div className="h-80 animate-pulse rounded-[24px] bg-white" />;
  return user ? <Dashboard user={user} onLogout={logout} /> : <AuthForms />;
}

function AuthForms() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const { setSession } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ name: "", email: "", password: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api<{ token: string; user: User }>(`/auth/${mode}`, {
        method: "POST",
        json: mode === "login" ? { email: f.email, password: f.password } : f,
      });
      setSession(res.token, res.user);
      if (next?.startsWith("/")) router.push(next);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-lg rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-black/5 sm:p-10">
      <div className="relative grid grid-cols-2 rounded-full bg-mist p-1" role="tablist">
        {(["login", "register"] as const).map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setError(""); }} className="relative rounded-full py-2.5 text-sm font-semibold capitalize">
            {mode === m && <motion.span layoutId="auth-pill" className="absolute inset-0 rounded-full bg-ink" />}
            <span className={`relative ${mode === m ? "text-amber" : "text-heading"}`}>{m === "login" ? "Login" : "Register"}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.form key={mode} onSubmit={submit} initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mt-8 space-y-4">
          {mode === "register" && (
            <>
              <label className="block text-sm font-medium text-heading">Full name *<input required autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="field mt-1.5" /></label>
              <label className="block text-sm font-medium text-heading">Phone<input type="tel" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="field mt-1.5" /></label>
            </>
          )}
          <label className="block text-sm font-medium text-heading">Email address *<input required type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="field mt-1.5" /></label>
          <label className="block text-sm font-medium text-heading">
            Password *
            <input required type="password" minLength={mode === "register" ? 8 : 1} autoComplete={mode === "login" ? "current-password" : "new-password"} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} className="field mt-1.5" />
          </label>
          {error && <p role="alert" className="text-sm text-coral">{error}</p>}
          <button type="submit" disabled={busy} className="btn-amber w-full">
            {busy && <Loader2 className="size-5 animate-spin" />} {mode === "login" ? "Log in" : "Register"}
          </button>
        </motion.form>
      </AnimatePresence>
    </motion.div>
  );
}

function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Order[]>("/orders").then(setOrders).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <motion.aside initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="h-fit rounded-[24px] bg-ink p-7 text-white">
        <span className="grid size-16 place-items-center rounded-full bg-amber text-2xl font-bold text-ink">{user.name.charAt(0).toUpperCase()}</span>
        <p className="mt-4 text-xl font-semibold">Hello {user.name}</p>
        <p className="text-sm text-slate">{user.email}</p>
        {user.phone && <p className="text-sm text-slate">{user.phone}</p>}
        <button type="button" onClick={onLogout} className="btn-ghost mt-6 w-full"><LogOut className="size-4" /> Log out</button>
      </motion.aside>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="rounded-[24px] bg-white p-6 ring-1 ring-black/5 sm:p-8">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-heading"><Package className="size-6 text-amber" /> Orders</h2>
        {error && <p className="mt-4 text-coral">{error}</p>}
        {!orders && !error && <Loader2 className="mt-6 size-6 animate-spin text-amber" />}
        {orders && !orders.length && (
          <div className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-mist p-6">
            <UserRound className="size-8 text-amber" />
            <p className="text-muted">No order has been made yet.</p>
            <Link href="/shop/" className="btn-dark">Browse products</Link>
          </div>
        )}
        {orders && orders.length > 0 && (
          <ul className="mt-6 space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <button type="button" onClick={() => setOpen(open === o.id ? null : o.id)} aria-expanded={open === o.id} className="flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl bg-mist px-5 py-4 text-left text-sm hover:ring-1 hover:ring-amber">
                  <span className="font-semibold text-heading">{o.orderNumber}</span>
                  <span className="text-muted">{new Date(o.createdAt).toLocaleDateString("en-AU")}</span>
                  <span className="rounded-full bg-amber/15 px-3 py-1 text-xs font-semibold">{statusLabel(o.status)}</span>
                  <span className="font-semibold">{money(o.total)} for {o.items.reduce((n, i) => n + i.quantity, 0)} item(s)</span>
                </button>
                <AnimatePresence>
                  {open === o.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-3">
                      <OrderSummary order={o} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
