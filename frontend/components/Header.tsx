"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, DollarSign, Globe, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "./StoreProvider";
import { money } from "@/lib/format";
import { topLinks, type NavItem } from "@/lib/nav";

export function Header({ nav, logo }: { nav: NavItem[]; logo: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount, subtotal, wishlist, setCartOpen, user, ready } = useStore();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 320 && y > prev && !mobileOpen);
  });

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/shop/?q=${encodeURIComponent(term)}` : "/shop/");
    setSearchOpen(false);
  };

  const isActive = (href: string) => href !== "/" && pathname.startsWith(href.split("?")[0]);

  return (
    <>
      {/* Top bar */}
      <div className="hidden bg-ink text-white md:block">
        <div className="container-wolf flex h-11 items-center justify-between text-[15px]">
          <ul className="flex items-center gap-6 text-white/80">
            <li className="flex items-center gap-2">
              <Globe className="size-4 text-amber" aria-hidden /> English
            </li>
            <li className="flex items-center gap-2">
              <DollarSign className="size-4 text-amber" aria-hidden /> Dollar (AUD)
            </li>
          </ul>
          <nav aria-label="Secondary">
            <ul className="flex items-center gap-8">
              {topLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 transition-colors hover:text-amber">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <motion.header
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
          scrolled ? "border-b border-white/10 bg-ink/80 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl" : "border-b border-white/5 bg-ink"
        }`}
      >
        <div className="container-wolf flex h-[76px] items-center gap-4 lg:gap-8">
          <button
            type="button"
            className="-ml-2 rounded-full p-2 text-white lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-6" />
          </button>

          <Link href="/" className="shrink-0" aria-label="Wolf – home">
            <Image src={logo} alt="Wolf Telstra Partner" width={190} height={40} priority className="h-8 w-auto sm:h-9" />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className={`relative flex items-center gap-1 py-6 text-base leading-none font-semibold capitalize transition-colors hover:text-amber ${
                      isActive(item.href) ? "text-amber" : "text-white"
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" aria-hidden />}
                    <span className="absolute inset-x-0 bottom-4 h-0.5 origin-left scale-x-0 rounded-full bg-amber transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                  {item.children && (
                    <div className="invisible absolute top-full left-1/2 w-64 -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="overflow-hidden rounded-2xl border border-white/10 bg-graphite/95 p-2 shadow-2xl backdrop-blur-xl">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="block rounded-xl px-4 py-3 font-poppins text-base text-white capitalize transition-colors hover:bg-amber hover:text-white"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
            <button
              type="button"
              aria-label="Search products"
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2.5 text-white transition-colors hover:text-amber"
            >
              <Search className="size-[22px]" />
            </button>
            <Link href="/wishlist/" aria-label={`Wishlist (${wishlist.length})`} className="relative hidden rounded-full p-2.5 text-white transition-colors hover:text-amber sm:block">
              <Heart className="size-[22px]" />
              {ready && wishlist.length > 0 && (
                <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-amber text-[10px] font-bold text-ink">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link href="/my-account/" aria-label={user ? `My account (${user.name})` : "My account"} className="rounded-full p-2.5 text-white transition-colors hover:text-amber">
              <User className="size-[22px]" />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${cartCount} items`}
              className="group ml-1 flex items-center gap-2.5 rounded-full border border-white/15 py-1.5 pr-1.5 pl-4 text-white transition-colors hover:border-amber"
            >
              <span className="hidden text-sm font-medium sm:inline">{money(ready ? subtotal : 0)}</span>
              <span className="relative grid size-9 place-items-center rounded-full bg-amber text-ink transition-transform group-hover:scale-105">
                <ShoppingBag className="size-[18px]" />
                <AnimatePresence>
                  {ready && cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-amber ring-2 ring-amber"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>
          </div>
        </div>

        {/* Search drawer */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10"
            >
              <form onSubmit={submitSearch} role="search" className="container-wolf flex items-center gap-3 py-4">
                <label htmlFor="site-search" className="sr-only">
                  Search
                </label>
                <input
                  id="site-search"
                  autoFocus
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search here"
                  className="field-dark rounded-full"
                />
                <button type="submit" className="btn-amber shrink-0 px-6 py-2 text-sm">
                  <Search className="size-4" /> Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              data-lenis-prevent
              className="fixed inset-y-0 left-0 z-[70] flex w-[86%] max-w-sm flex-col bg-ink text-white lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              aria-label="Mobile menu"
            >
              <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
                <Image src={logo} alt="Wolf" width={150} height={32} className="h-7 w-auto" />
                <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="rounded-full p-2">
                  <X className="size-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
                <MobileNav nav={nav} />
                <ul className="mt-6 border-t border-white/10 pt-4">
                  {[...topLinks, { label: "Wishlist", href: "/wishlist/" }, { label: "My Account", href: "/my-account/" }].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block rounded-xl px-4 py-3 text-white/80 hover:bg-white/5 hover:text-amber">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileNav({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="space-y-1">
      {nav.map((item) => (
        <li key={item.label}>
          {item.children ? (
            <>
              <button
                type="button"
                onClick={() => setOpen(open === item.label ? null : item.label)}
                aria-expanded={open === item.label}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-semibold hover:bg-white/5"
              >
                {item.label}
                <ChevronDown className={`size-5 transition-transform ${open === item.label ? "rotate-180 text-amber" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === item.label && (
                  <motion.ul initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden pl-4">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block rounded-xl px-4 py-2.5 font-poppins text-white/75 hover:text-amber">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </>
          ) : (
            <Link href={item.href} className="block rounded-xl px-4 py-3 text-base font-semibold hover:bg-white/5 hover:text-amber">
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
