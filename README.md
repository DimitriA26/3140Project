# NEXA — 3140Project E-Commerce Platform

A full-stack e-commerce application built for CISC 3140. Customers can browse
products, search/filter/sort the catalog, manage a cart, check out, and view
their order history. Admins can manage the product catalog and customer
orders from a protected dashboard.

## Team Members

- **Dimitri** — Backend (Express/Postgres API: auth, products, cart, orders,
  admin routes), repo consolidation
- **Ashley Mezi** — Database schema, shared frontend foundation (API client,
  auth context, cart context, route guards), cart/checkout UI
- **Muhammad Chaudhry** — Product discovery (search/filter/sort, backend
  route + frontend UI)
- **Heaven** — Order history feature
- **Tasnim** — Team planning / execution plan

## Status

Core functionality (Tier 1 + Tier 2) is implemented and has been tested
end-to-end against a real Postgres database: registration, login, browsing,
search/filter/sort, cart, checkout, order history, and the full admin
product/order management flow.

**Not yet done:** live deployment, automated tests, product image uploads,
payment integration.

## Technology Stack

- **Frontend:** Next.js (App Router), React, plain CSS / CSS Modules,
  lucide-react icons
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (`pg` driver)
- **Auth:** JWT (`jsonwebtoken`), password hashing with `bcryptjs`

## Application Architecture

```
Next.js frontend (frontEnd/)
        ↓  fetch, via lib/apiClient.js
Express REST API (backEnd/), mounted under /api/*
        ↓  pg connection pool (backEnd/config/database.js)
PostgreSQL (schema.sql / seed.sql)
```

The frontend never talks to Postgres directly. Every request goes through
`apiClient` → an Express route → a controller → the `pg` pool. Auth state
(`AuthContext`) and cart state (`CartContext`) are global React contexts
mounted once in `app/layout.js`; pages read from them with `useAuth()` /
`useCart()` instead of fetching independently.

## Local Installation

### 1. Clone and check out this branch

```bash
git clone https://github.com/DimitriA26/3140Project.git
cd 3140Project
git checkout consolidation
```

### 2. Set up PostgreSQL

Install PostgreSQL locally (or use a hosted instance like Neon/Supabase),
then create the database:

```bash
psql -U postgres -c "CREATE DATABASE ecommerce;"
```

### 3. Backend

```bash
cd backEnd
npm install
cp .env.example .env   # then edit DATABASE_URL/PORT/JWT_SECRET if needed
psql -U postgres -d ecommerce -f schema.sql
psql -U postgres -d ecommerce -f seed.sql
node server.js
```

Backend runs at `http://localhost:4000`. Check `http://localhost:4000/api/health`.

### 4. Frontend

In a second terminal:

```bash
cd frontEnd
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs at `http://localhost:3000`.

### Test accounts (from seed.sql)

| Role     | Email                  | Password      |
|----------|-------------------------|---------------|
| Customer | customer@example.com    | password123   |
| Admin    | admin@example.com       | admin123      |

## Environment Variables

**`backEnd/.env`** (see `backEnd/.env.example`):
- `PORT` — port the Express server listens on (default 4000)
- `DATABASE_URL` — Postgres connection string
- `JWT_SECRET` — secret used to sign auth tokens

**`frontEnd/.env.local`** (see `frontEnd/.env.example`):
- `NEXT_PUBLIC_API_BASE_URL` — where the frontend expects the backend (default `http://localhost:4000`)

No real secrets are committed. `.env` files are gitignored.

## API Documentation

All routes are mounted under `/api`.

**Auth** (`/api/auth`)
- `POST /register` — create an account
- `POST /login` — returns `{ token, user }`
- `GET /me` — current user (requires auth)

**Products** (`/api/products`)
- `GET /` — list products; query params: `search`, `category`, `minPrice`,
  `maxPrice`, `inStock`, `sort` (`name-asc|name-desc|price-asc|price-desc`),
  `page`, `limit`
- `GET /categories` — list categories
- `GET /:id` — single product
- `POST /`, `PUT /:id`, `DELETE /:id` — admin only

**Cart** (`/api/cart`, all require auth)
- `GET /` — current user's cart
- `POST /items` — add item
- `PUT /items/:itemId` — update quantity
- `DELETE /items/:itemId` — remove item

**Orders** (`/api/orders`, all require auth)
- `POST /` — checkout (total is calculated server-side from the cart, never
  trusts a frontend-supplied total)
- `GET /my-orders` — current user's orders
- `GET /:id` — one order (owner or admin only)

**Admin** (`/api/admin`, requires auth + admin role)
- `GET /orders` — all orders
- `GET /orders/:id` — one order (any customer's)
- `PATCH /orders/:id/status` — update order status

## Database Design

Tables: `users`, `categories`, `products`, `carts`, `cart_items`, `orders`,
`order_items`. All primary keys are auto-incrementing integers (`SERIAL`).

- A user has one cart and many orders.
- A cart has many cart items; each cart item references a product.
- An order has many order items, each capturing `price_at_purchase` so past
  orders stay accurate even if a product's price later changes.
- A product belongs to one category.

See `backEnd/schema.sql` for the full DDL and `backEnd/seed.sql` for seed data
(8 products across 5 categories, 2 test users).

## Vertical-Slice Examples

**Cart → Checkout**
- DB: `carts`, `cart_items`, `orders`, `order_items` tables
- API: `POST /api/cart/items`, `POST /api/orders` (`backEnd/controllers/cartController.js`, `orderController.js`)
- Frontend: `CartContext`, `frontEnd/app/cart/page.js`, `frontEnd/app/orders/[id]/page.js` (confirmation)
- Tested: manually, end-to-end in browser against live Postgres (register → add to cart → checkout → confirmation → order history)

**Admin Product Management**
- DB: `products`, `categories` tables
- API: `POST/PUT/DELETE /api/products/:id`, gated by `requireAuth` + `requireAdmin` middleware
- Frontend: `frontEnd/app/admin/products/*`, wrapped in `AdminRoute`
- Tested: manually — created, edited, and deleted a product as an admin account; confirmed a non-admin is blocked

## Known Issues

- No automated test suite yet.
- Not deployed live — local only so far.
- Admin order list filtering by status/date is client-requested but not
  implemented server-side (query params are accepted but ignored).
- No product image upload — products use external image URLs.

## Future Improvements

- Deploy (Vercel for frontend, Render/Railway for backend, Neon/Supabase for Postgres)
- Automated tests (backend route tests at minimum)
- Payment integration (Stripe test mode)
- Product image upload
