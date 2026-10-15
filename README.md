# Wolf – Next.js storefront + API

A rebuild of the Wolf (Telstra Partner, Gippsland) WooCommerce site as two separate Next.js apps backed by MongoDB Atlas. It runs without Docker.

```
Wolf/
├── backend/    Next.js 15 API only (route handlers) + Mongoose → MongoDB   · port 4001
└── frontend/   Next.js 15 App Router storefront (Tailwind v4 + Motion)     · port 3001
```

All original content is carried over: the 76 products with variations and prices, the 18 categories, the stores, team, awards, history, partners and testimonial. The 240 original images and the history video are in `frontend/public/uploads/` at the same paths as the old site.

## Quick start

```bash
# 1. API
cd backend
npm install
npm run seed          # loads products, categories, site content and the admin user into MongoDB
npm run dev           # http://localhost:4001

# 2. Storefront (new terminal)
cd frontend
npm install
npm run dev           # http://localhost:3001
```

Production: run `npm run build && npm start` in each folder. Start the backend first, because the frontend pre-renders product and category pages from the API at build time.

## Environment

| File | Key | Purpose |
|---|---|---|
| `backend/.env` | `MONGODB_URI` | Atlas connection string (database `wolf`) |
| | `CORS_ORIGINS` | Storefront origin(s) allowed to call the API |
| | `JWT_SECRET` | Signs customer/admin login tokens |
| | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin account created by `npm run seed` |
| | `DELIVERY_FEE` / `FREE_DELIVERY_THRESHOLD` | Delivery pricing (AUD, default free) |
| `frontend/.env.local` | `API_URL` | API base for server rendering |
| | `NEXT_PUBLIC_API_URL` | API base for the browser (cart, forms, account) |
| | `NEXT_PUBLIC_SITE_URL` | Public URL used for canonical links, sitemap and Open Graph |

The `.env` files are git-ignored. The `.env.example` files are the templates.

## Design

- **Kept from the original:** Inter (plus Poppins in the dropdowns), the palette (black `#000`, amber `#FCAD38`, coral `#F64B4B`, mist `#F5F5F5`, graphite `#404040`, slate `#99A1AF`, navy `#161C2D`, muted `#525252`), the type scale (72px titles, 36px eyebrows, 28px hero lead, 18px product titles and 22px prices) and all images.
- **New:** a dark "midnight & amber" theme with glass panels, glow orbs, a bento layout, word-by-word heading reveals, scroll and stagger entrances, an animated tab pill, a brand marquee, counters, 3D tilt, parallax, cart and menu drawers, and image zoom with a lightbox. All motion respects the visitor's reduced-motion setting.

## SEO

- WordPress URLs are preserved (`/about-us/`, `/product/<slug>/`, `/product-category/<slug>/`, trailing slashes, `/?s=` search redirect).
- Pages have their own titles, descriptions, canonical links, Open Graph and Twitter cards.
- JSON-LD: Organization, WebSite with SearchAction, ElectronicsStore ×3 with opening hours, Product with Offer/AggregateOffer, BreadcrumbList and FAQPage.
- `sitemap.xml` (with image entries), `robots.txt` and a web manifest are generated.
- Cart, checkout, account and filtered or search listings are `noindex`.
- Images are served through `next/image` as AVIF/WebP, fonts are self-hosted, and pages use ISR (60s).

## Features

Shop with category, group, search, price and sort filters plus pagination. Product pages have a variation picker with live price and option availability. Cart drawer and cart page, wishlist, and checkout with in-store pickup or delivery plus a preferred date. Order confirmation, order tracking (order number + email), customer accounts with order history, a contact form saved to MongoDB, and newsletter signup.

Payments are recorded as "Pay in store" or "Direct bank transfer". No card gateway is wired up yet; Stripe can be added to `backend/app/api/orders`.
