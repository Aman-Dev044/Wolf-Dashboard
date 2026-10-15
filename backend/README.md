# Wolf Backend (API)

REST API for the Wolf storefront, built with **Next.js 15 route handlers**, **MongoDB Atlas (Mongoose)**, **Zod** validation and **JWT** auth. It serves the product catalogue, site content (hero, stores, team, awards…), contact/newsletter forms, customer accounts and orders. No Docker is needed.

```
backend/
├─ app/api/…          route handlers (one folder per endpoint)
├─ lib/               db connection, auth (JWT), http helpers, validators, serializers
├─ models/            Mongoose models: Product, Category, User, Order, Contact, Subscriber, SiteContent
├─ data/              seed data scraped from the original site (products, categories, site copy)
├─ scripts/seed.ts    imports data/ into MongoDB and creates the admin user
└─ middleware.ts      CORS for /api/*
```

## Setup

Requires Node.js 20+ (tested on Node 24).

```bash
cd backend
npm install
npm run seed        # import catalogue + site content, create admin user
npm run dev         # http://localhost:4001
```

Production:

```bash
npm run build
npm run start       # http://localhost:4001
```

> **Port already in use?** If another app on your machine is using port 4000, run on another port
> (`npx next dev -p 4001` / `npx next start -p 4001`) and update `API_URL` and `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to match.

### Environment variables (`backend/.env`)

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string. The database name is part of the path (`…mongodb.net/wolf?…`). |
| `CORS_ORIGINS` | Comma-separated list of browser origins allowed to call the API (the frontend URL, e.g. `http://localhost:3001`). Use `*` to allow any. |
| `JWT_SECRET` | Secret used to sign login tokens. Use a long random string; changing it signs everyone out. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin account created by `npm run seed` (only if it doesn't exist yet). |
| `DELIVERY_FEE` | Flat delivery fee in AUD added to delivery orders (default `0`). |
| `FREE_DELIVERY_THRESHOLD` | Order subtotal at/above which delivery is free (`0` = no threshold). |

`.env` is git-ignored; `.env.example` documents the same keys without secrets.

### Seeding

```bash
npm run seed              # upsert products/categories/site content by slug – safe to re-run
npm run seed -- --fresh   # delete all products & categories first, then import
```

Re-running the seed keeps existing product-variation IDs stable (matched by their original WooCommerce id), so carts and past orders keep pointing at the right option. Orders, users, contacts and subscribers are never touched by the seed.

## Conventions

- All responses are JSON. Errors look like `{ "error": "message" }`; validation errors (HTTP 422) also include `issues: [{ path, message }]`.
- Status codes: `400` bad request / invalid id / malformed JSON, `401` not signed in, `403` not an admin, `404` not found, `409` duplicate, `422` validation failed.
- Documents are returned with `id` instead of `_id`. Prices are numbers in AUD (e.g. `2199` = $2,199.00).
- Auth: send `Authorization: Bearer <token>` (token from login/register, valid 7 days).

## Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | – | DB connectivity check |
| GET | `/api/site` | – | Site content (brand, hero, quick links, services, history, partners, team, awards, stores, hours, FAQ…) |
| PUT | `/api/site` | admin | Shallow-merge top-level site sections |
| GET | `/api/categories` | – | Categories that contain products, with `count` |
| GET | `/api/categories/:slug` | – | One category |
| GET | `/api/products` | – | Product list (filters below) |
| POST | `/api/products` | admin | Create product |
| GET | `/api/products/:slug` | – | Product + its categories + up to 8 related products |
| PUT | `/api/products/:slug` | admin | Update product (partial) |
| DELETE | `/api/products/:slug` | admin | Delete product |
| POST | `/api/contact` | – | Contact form |
| GET | `/api/contact` | admin | Latest 200 contact messages |
| POST | `/api/newsletter` | – | Newsletter signup (idempotent) |
| POST | `/api/auth/register` | – | Create customer account → `{ token, user }` |
| POST | `/api/auth/login` | – | Sign in → `{ token, user }` |
| GET | `/api/auth/me` | user | Current account |
| PATCH | `/api/auth/me` | user | Update `name` / `phone` |
| POST | `/api/orders` | optional | Place an order (linked to the account if a token is sent) |
| GET | `/api/orders` | user | My orders (admins get all orders) |
| POST | `/api/orders/track` | – | Look up an order by number + checkout email |
| PATCH | `/api/orders/:orderNumber` | admin | Change order status |

### `GET /api/products`

Query parameters (all optional):

| Param | Example | Notes |
| --- | --- | --- |
| `category` | `apple` or `apple,google,samsung` | One or more category slugs (comma list = any of) |
| `q` | `iphone` | Case-insensitive name search |
| `sort` | `default` · `latest` · `price-asc` · `price-desc` · `name-asc` · `name-desc` | |
| `min` / `max` | `500` / `1000` | Filter on the lowest price |
| `page` / `limit` | `2` / `12` | `limit` max 100 |
| `featured`, `inStock` | `1` | Boolean flags |
| `slugs` / `exclude` | `a,b` | Include / exclude specific slugs |

```json
{
  "items": [
    {
      "id": "6ad0c52b86afc57771d80ec2",
      "name": "iPhone 17 Pro Max",
      "slug": "iphone-17-pro-max",
      "type": "variable",
      "price": 2199, "priceMin": 2199, "priceMax": 3799, "currency": "AUD",
      "images": [{ "src": "/uploads/2026/07/front-1-1.png", "alt": "iPhone 17 Pro Max" }],
      "categories": ["apple"],
      "attributes": [{ "name": "Capacity", "options": ["256GB", "512GB", "1TB", "2TB"] }],
      "variations": [{ "id": "6ad0…21b7", "attributes": { "Capacity": "512GB" }, "price": 2599, "inStock": true }],
      "inStock": true
    }
  ],
  "total": 2, "page": 1, "pages": 1, "limit": 12
}
```

Image `src` paths are served by the **frontend** from `frontend/public/uploads/…`.

### `POST /api/contact`

```json
{ "name": "Jane Citizen", "email": "jane@example.com", "phone": "0400 000 000", "store": "Wolf Traralgon Store", "message": "Hi!" }
```
→ `201 { "message": "Thank you for your message. It has been sent." }`

### `POST /api/newsletter`

```json
{ "email": "jane@example.com" }
```
→ `201 { "message": "You're subscribed! …" }`

### `POST /api/auth/register` / `POST /api/auth/login`

```json
{ "name": "Jane Citizen", "email": "jane@example.com", "password": "at-least-8-chars", "phone": "0400000000" }
```
Login takes only `email` + `password`. Both return:
```json
{ "token": "eyJhbGciOi…", "user": { "id": "…", "name": "Jane Citizen", "email": "jane@example.com", "phone": "0400000000", "role": "customer" } }
```

### `POST /api/orders`

Prices are always recalculated from the database; the client only sends ids and quantities.

```json
{
  "customer": { "firstName": "Jane", "lastName": "Citizen", "email": "jane@example.com", "phone": "0400000000" },
  "fulfilment": {
    "method": "pickup",
    "store": "Wolf Traralgon",
    "preferredDate": "2026-10-20"
  },
  "items": [
    { "productId": "6ad0c52b86afc57771d80ec2", "variationId": "6ad0c52ba926746b6f2821b7", "quantity": 1 },
    { "productId": "6ad0c52b86afc57771d80e9b", "quantity": 2 }
  ],
  "paymentMethod": "pay-in-store",
  "notes": ""
}
```

- `fulfilment.method`: `pickup` (requires `store`) or `delivery` (requires `address: { line1, city, state, postcode }`).
- `variationId` is required for variable products.
- `paymentMethod`: `pay-in-store` (default) or `bank-transfer`.

→ `201` with the saved order, including `orderNumber` (e.g. `WLF-261015-AB12C`), `items[].lineTotal`, `subtotal`, `deliveryFee`, `total`, `status: "pending"` and `history`.

### `POST /api/orders/track`

```json
{ "orderNumber": "WLF-261015-AB12C", "email": "jane@example.com" }
```
→ the order, or `404` if number and email don't match.

### `PATCH /api/orders/:orderNumber` (admin)

```json
{ "status": "ready-for-pickup", "note": "Ready at the front counter" }
```
Statuses: `pending`, `processing`, `ready-for-pickup`, `shipped`, `completed`, `cancelled`. Each change is appended to `history`.

### `PUT /api/products/:slug` (admin)

Partial update, e.g. `{ "price": 85, "inStock": false }`. `priceMin`/`priceMax` are recalculated from variations automatically.

## Admin access

There is no admin UI yet; use the API directly:

```bash
TOKEN=$(curl -s -X POST http://localhost:4001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wolfstores.com.au","password":"<ADMIN_PASSWORD>"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -X PATCH http://localhost:4001/api/orders/WLF-261015-AB12C \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"processing"}'
```

Change `ADMIN_PASSWORD` in `.env` before seeding a production database. Registration via the API always creates `customer` accounts; admins only come from the seed (or by setting `role: "admin"` on a user in MongoDB).

## Data model

| Collection | Key fields |
| --- | --- |
| `products` | `name`, `slug` (unique), `type` (`simple`/`variable`), `price`, `priceMin`, `priceMax`, `images[{src,alt}]`, `categories[slug]`, `attributes[{name,options}]`, `variations[{_id,attributes,price,inStock}]`, `description`, `inStock`, `featured`, `sortOrder`, `published` |
| `categories` | `name`, `slug` (unique), `group` (`mobile-phones`/`accessories`/`other`), `image` |
| `users` | `name`, `email` (unique), `passwordHash` (bcrypt, never returned), `phone`, `role` |
| `orders` | `orderNumber` (unique), `user?`, `customer{firstName,lastName,email,phone}`, `fulfilment{method,store,preferredDate,address}`, `items[{product,name,image,variationId,variationLabel,price,quantity,lineTotal}]`, `subtotal`, `deliveryFee`, `total`, `paymentMethod`, `status`, `history[{status,at,note}]` |
| `contacts` | `name`, `email`, `phone`, `store`, `message`, `handled` |
| `subscribers` | `email` (unique) |
| `sitecontents` | `{ key: "site", data: {…} }` – all editable site copy (see `data/site.json`) |

## Not included yet

- Online card payments (orders are placed as *pay in store* or *bank transfer*).
- Transactional emails (order confirmation, contact form notification).
- An admin dashboard UI.
