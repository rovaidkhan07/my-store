# MobileHub — Premium Mobile Accessories E-Commerce Store

A production-ready full-stack e-commerce store built for a local mobile accessories business (Pakistan context, PKR currency, Cash on Delivery, Bank Transfer, and direct WhatsApp support).

---

## 🌟 Key Features

### 🛍️ Customer Storefront
- **Modern Homepage**: High-impact hero banner, category showcase, featured items, newest arrivals, and trust badges.
- **Dynamic Catalog (`/shop`)**: Server-side URL query filters for categories, brands, price ranges (PKR), stock availability, search keywords, and sorting.
- **Product Details Page (`/products/[slug]`)**:
  - Image gallery with thumbnail switching.
  - Interactive variant selector (Color, Length, Device Model) dynamically updating price, SKU, and stock count.
  - Accurate discount percentages (`% OFF`).
  - Stock indicators ("In Stock", "Only X left", "Out of Stock").
  - "Add to Cart" and "Buy Now" (direct to checkout).
  - **WhatsApp Direct Inquiry**: Pre-filled product name and SKU inquiry message.
  - Related accessories grid.
- **Persistent Shopping Cart (`/cart` & Slide-out Cart Drawer)**:
  - Synchronized with `localStorage`.
  - Free delivery progress bar (e.g. "Add Rs. 500 more for FREE Delivery!").
  - Quantity steppers & item removal.
- **Seamless 2-Step Checkout (`/checkout`)**:
  - Validated customer delivery form (Full Name, Phone number, City, Address, Notes).
  - Payment methods:
    1. **Cash on Delivery (COD)** — Doorstep payment across Pakistan.
    2. **Direct Bank Transfer** — Configured with Meezan Bank Ltd account details & WhatsApp slip submission instructions.
  - **Server-Authoritative Atomic Placement**: Verifies live database prices and stock, recalculates totals, decrements stock, and logs audit inventory transactions in a single transaction.
- **Order Confirmation (`/order-confirmation/[orderNumber]`)**: Full order breakdown, human-friendly order reference (`ORD-2026-XXXXXX`), bank transfer details, printable receipt.
- **Order Tracking (`/track-order`)**: Real-time shipment progress timeline (Placed ➔ Confirmed ➔ Processing ➔ Shipped ➔ Delivered).
- **Floating WhatsApp Support**: Instant customer support on all pages.

---

### 🛡️ Admin Management Dashboard (`/admin`)
- **Secure Authentication (`/admin/login`)**: Cookie-based JWT sessions with bcrypt password verification.
- **Business Overview**:
  - Real-time KPIs: Total Revenue, Today's Sales, Monthly Revenue, Pending Orders, Low Stock Alerts.
  - 7-Day Revenue & Order trends chart.
  - Orders by fulfillment status breakdown.
  - Recent orders table.
- **Product Management (`/admin/products`)**:
  - Full CRUD: Create, edit, search, filter by category.
  - Variant manager, multi-image URLs, stock threshold, featured toggle, soft-deactivation.
- **Category Management (`/admin/categories`)**:
  - Create, update, sort order, and active status toggles.
- **Order Management (`/admin/orders` & `/admin/orders/[id]`)**:
  - Filter by order status (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`) and payment status (`pending`, `paid`, `failed`, `refunded`).
  - Order details view, customer info, item snapshots, status changer with tracking note.
  - Automatic inventory restoration if an order is cancelled.
  - Direct WhatsApp customer messaging button.
- **Inventory & Stock Control (`/admin/inventory`)**:
  - Stock view with In Stock, Low Stock, and Out of Stock filters.
  - Manual Stock Adjustment modal with transaction type logging (`purchase`, `sale`, `adjustment`, `damaged`, `return`, `manual_update`) and mandatory reason notes.
- **Store Settings (`/admin/settings`)**:
  - Store identity, phone, WhatsApp business number, delivery fee, free delivery threshold, and bank transfer account settings.

---

## 🗄️ Database Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router with TypeScript & Tailwind CSS v4)
- **Database**: PostgreSQL (Prisma Postgres / Supabase / Postgres connection)
- **ORM**: Prisma ORM 7 with `@prisma/adapter-pg`
- **Validation**: Zod schema validation
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file (see `.env.example`):
```env
DATABASE_URL="postgresql://..."

NEXT_PUBLIC_STORE_NAME="MobileHub"
NEXT_PUBLIC_STORE_PHONE="+92 300 1234567"
NEXT_PUBLIC_STORE_WHATSAPP="923001234567"
NEXT_PUBLIC_STORE_EMAIL="support@mobilehub.pk"
NEXT_PUBLIC_STORE_ADDRESS="Shop 14, Hafeez Center / Techno City, Karachi, Pakistan"
NEXT_PUBLIC_CURRENCY="PKR"
NEXT_PUBLIC_CURRENCY_SYMBOL="Rs."
NEXT_PUBLIC_DEFAULT_DELIVERY_FEE="200"
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD="3000"

JWT_SECRET="your-secure-jwt-secret-key"
ADMIN_EMAIL="admin@mobilehub.pk"
ADMIN_PASSWORD="admin123@MobileHub"
```

### 3. Run Database Migrations & Seed
```bash
npx prisma migrate dev
npm run db:seed
```

### 4. Run E2E Automated Tests
```bash
npm test
```

### 5. Start the Application
```bash
# Development server
npm run dev

# Production build & start
npm run build
npm run start
```

---

## 🔑 Default Admin Credentials

- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@mobilehub.pk`
- **Password**: `admin123@MobileHub`
