import type { Category } from "./types";

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

/** Main menu, mirroring the original: All Category · Mobile Phones ▾ · Accessories ▾ · Mobile Internet */
export function buildNav(categories: Category[]): NavItem[] {
  const group = (g: Category["group"]) =>
    categories.filter((c) => c.group === g).map((c) => ({ label: c.name, href: `/product-category/${c.slug}/` }));
  const mobile = group("mobile-phones");
  const accessories = group("accessories");
  return [
    { label: "All Category", href: "/shop/" },
    { label: "Mobile Phones", href: "/shop/?group=mobile-phones", children: mobile },
    { label: "Accessories", href: "/shop/?group=accessories", children: accessories },
    { label: "Mobile Internet", href: "/product-category/mobile-internet/" },
  ];
}

export const topLinks = [
  { label: "Tracking Package", href: "/tracking/" },
  { label: "FAQ", href: "/faq/" },
  { label: "About Us", href: "/about-us/" },
  { label: "Contact Us", href: "/contact-us/" },
];

export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us/" },
  { label: "Bluetooth HeadPhones", href: "/product-category/bluetooth-headphones/" },
  { label: "Bluetooth Speakers", href: "/product-category/bluetooth-speakers/" },
  { label: "Smart Watches", href: "/product-category/smart-watches/" },
  { label: "Mobile Internet", href: "/product-category/mobile-internet/" },
  { label: "Contact Us", href: "/contact-us/" },
  { label: "Xbox", href: "/product-category/xbox/" },
  { label: "Fetch", href: "/product-category/fetch/" },
];
