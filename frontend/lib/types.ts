export type Image = { src: string; alt: string };

export type Variation = {
  id: string;
  attributes: Record<string, string>;
  price: number;
  regularPrice?: number;
  inStock: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  type: "simple" | "variable";
  sku: string;
  price: number;
  regularPrice?: number;
  priceMin: number;
  priceMax: number;
  currency: string;
  onSale: boolean;
  description: string;
  shortDescription: string;
  images: Image[];
  categories: string[];
  attributes: { name: string; options: string[] }[];
  variations: Variation[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  group: "mobile-phones" | "accessories" | "other";
  description: string;
  image: string;
  count: number;
};

export type ProductList = { items: Product[]; total: number; page: number; pages: number; limit: number };

export type Store = {
  slug: string;
  name: string;
  street: string;
  city: string;
  region: string;
  postcode: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  map: string;
};

export type TeamMember = { name: string; role: string; joined: string; email: string; image: string };

export type Site = {
  brand: {
    name: string;
    legalName: string;
    domain: string;
    tagline: string;
    logo: string;
    logoDark: string;
    foundingYear: number;
    founder: string;
    footerAbout: string;
    copyright: string;
  };
  hero: { eyebrow: string; title: string; text: string; cta: { label: string; href: string }; image: string };
  quickLinks: { label: string; href: string }[];
  trendingTabs: { label: string; category: string }[];
  about: { title: string; intro: string; origin: string; image: string; banner: string; whatWeDoImage: string };
  services: string[];
  store: { eyebrow: string; title: string; text: string; image: string };
  history: { title: string; text: string[]; image: string; video: string; milestones: { year: string; text: string }[] };
  cta: { text: string; label: string; href: string; image: string };
  partners: { title: string; text: string; logos: { name: string; src: string }[] };
  testimonials: { eyebrow: string; title: string; quote: string; name: string; role: string }[];
  team: { group: string; members: TeamMember[] }[];
  awards: { year: string; title: string }[];
  stores: Store[];
  contactStores: string[];
  tradingHours: { days: string; hours: string }[];
  publicHolidaysNote: string;
  social: { facebook: string; x: string; instagram: string; linkedin: string };
  newsletter: { title: string; text: string };
  questions: { title: string; text: string };
  deliveryNotice: string;
  faq: { q: string; a: string }[];
};

export type OrderItem = {
  product: string;
  slug: string;
  name: string;
  image: string;
  variationId: string | null;
  variationLabel: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  fulfilment: {
    method: "delivery" | "pickup";
    store: string;
    preferredDate: string;
    address?: { line1?: string; line2?: string; city?: string; state?: string; postcode?: string; country?: string };
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  paymentMethod: "pay-in-store" | "bank-transfer";
  status: string;
  notes: string;
  history: { status: string; at: string; note: string }[];
  createdAt: string;
};

export type User = { id: string; name: string; email: string; phone: string; role: "customer" | "admin" };
