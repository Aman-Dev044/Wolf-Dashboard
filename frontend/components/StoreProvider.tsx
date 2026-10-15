"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/client-api";
import type { User } from "@/lib/types";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variationId: string | null;
  variationLabel: string;
  quantity: number;
};

export type WishItem = { productId: string; slug: string; name: string; image: string; priceLabel: string };

type Toast = { id: number; message: string };

type StoreCtx = {
  ready: boolean;
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  addToCart: (line: Omit<CartLine, "key" | "quantity">, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  wishlist: WishItem[];
  toggleWish: (item: WishItem) => void;
  inWishlist: (productId: string) => boolean;
  user: User | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
  toasts: Toast[];
  notify: (message: string) => void;
};

const Ctx = createContext<StoreCtx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<WishItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setCart(load("wolf:cart", []));
    setWishlist(load("wolf:wishlist", []));
    setUser(load("wolf:user", null));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) save("wolf:cart", cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) save("wolf:wishlist", wishlist);
  }, [wishlist, ready]);

  // Validate a stored session once on load.
  useEffect(() => {
    if (!ready || !user) return;
    api<User>("/auth/me")
      .then((u) => {
        setUser(u);
        save("wolf:user", u);
      })
      .catch((e) => {
        if (e.status === 401) logout();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const notify = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addToCart = useCallback<StoreCtx["addToCart"]>(
    (line, qty = 1) => {
      const key = `${line.productId}:${line.variationId ?? ""}`;
      setCart((c) => {
        const existing = c.find((l) => l.key === key);
        if (existing) return c.map((l) => (l.key === key ? { ...l, quantity: Math.min(50, l.quantity + qty) } : l));
        return [...c, { ...line, key, quantity: qty }];
      });
      setCartOpen(true);
    },
    []
  );

  const updateQty = useCallback((key: string, qty: number) => {
    setCart((c) => c.map((l) => (l.key === key ? { ...l, quantity: Math.max(1, Math.min(50, qty)) } : l)));
  }, []);

  const removeLine = useCallback((key: string) => setCart((c) => c.filter((l) => l.key !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback(
    (item: WishItem) => {
      const has = wishlist.some((x) => x.productId === item.productId);
      setWishlist((w) => (has ? w.filter((x) => x.productId !== item.productId) : [...w, item]));
      notify(has ? `${item.name} removed from your wishlist` : `${item.name} added to your wishlist`);
    },
    [wishlist, notify]
  );

  const inWishlist = useCallback((id: string) => wishlist.some((w) => w.productId === id), [wishlist]);

  const setSession = useCallback((token: string, u: User) => {
    try {
      localStorage.setItem("wolf:token", token);
    } catch {}
    save("wolf:user", u);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("wolf:token");
      localStorage.removeItem("wolf:user");
    } catch {}
    setUser(null);
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      ready,
      cart,
      cartCount: cart.reduce((n, l) => n + l.quantity, 0),
      subtotal: Math.round(cart.reduce((s, l) => s + l.price * l.quantity, 0) * 100) / 100,
      addToCart,
      updateQty,
      removeLine,
      clearCart,
      cartOpen,
      setCartOpen,
      wishlist,
      toggleWish,
      inWishlist,
      user,
      setSession,
      logout,
      toasts,
      notify,
    }),
    [ready, cart, addToCart, updateQty, removeLine, clearCart, cartOpen, wishlist, toggleWish, inWishlist, user, setSession, logout, toasts, notify]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
