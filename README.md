# Reliaa — Furniture Showcase Website

A modern, contemporary website to showcase the Reliaa furniture collection
(sofas, chairs and more). It is a **showcase site, not a shop** — there are no
prices, carts or checkout. Product images are added through a private admin
panel.

Built with **Next.js (App Router)**, **TypeScript** and **Tailwind CSS**.

---

## Features

- **Public site**
  - Modern hero with a crossfading **image slideshow** and soft scroll-reveal
    animations throughout.
  - `/collection` — a filterable gallery; each piece links to its own page.
  - `/product/[id]` — **product detail pages** with a multi-image gallery,
    full description, an "enquire" button and related pieces.
  - `/projects` & `/projects/[id]` — a **Projects gallery** showing furniture
    styled in real spaces (title, location, type and a photo gallery).
  - `/contact` — a **contact / enquiry form**; "Enquire" buttons pre-fill the
    piece being asked about.
- **Admin panel** (`/admin`) — tabbed interface:
  - **Products** — add a product with one or more images, name, description and
    category; delete products.
  - **Projects** — publish a project with a set of photos; delete projects.
  - **Categories** — add, rename, delete (deleting a category removes its
    products and images too).
  - **Inbox** — read enquiries from the contact form, mark read/unread, delete.
    Unread count shows on the tab.
  - Username + password login.
- **Storage that works locally and in the cloud**
  - Locally: images and data are saved to your computer (`/public/uploads` and
    `/data/products.json`). No setup needed.
  - In production: automatically uses **Cloudinary** (free, image-optimized,
    25 GB) for images and data.

---

## Running it on your computer

1. Install dependencies (first time only):
   ```bash
   npm install
   ```
2. The file `.env.local` already contains development settings:
   - Username: `admin`
   - Password: `reliaa123`

   **Change these before going live.**
3. Start the site:
   ```bash
   npm run dev
   ```
4. Open:
   - Website → http://localhost:3000
   - Admin → http://localhost:3000/admin

---

## Putting it online (Vercel + Cloudinary)

Images (and the small data file) are stored on **Cloudinary** — a free,
image-optimized cloud store (25 GB, no time limit). You set this up once.

**Step 1 — Get your Cloudinary key (free):**

1. Sign up at [cloudinary.com](https://cloudinary.com) (free, no card).
2. On the **Dashboard**, find the **API environment variable**. It looks like:
   ```
   CLOUDINARY_URL=cloudinary://123456789:abcdEFGHijkl@your-cloud-name
   ```
   Copy that whole value (everything after `CLOUDINARY_URL=`).

**Step 2 — Deploy to Vercel:**

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), click **Add New → Project**, and
   import the repository.
3. Open **Settings → Environment Variables** and add:
   | Name | Value |
   | --- | --- |
   | `CLOUDINARY_URL` | the value you copied from Cloudinary |
   | `ADMIN_USERNAME` | your chosen admin username |
   | `ADMIN_PASSWORD` | a strong password |
   | `SESSION_SECRET` | a long random string (run `openssl rand -base64 32`) |
4. Click **Deploy**. Your site is live, and your admin panel is at
   `https://your-site.vercel.app/admin`. Every image you upload there is stored
   on Cloudinary and optimized automatically.

> When `CLOUDINARY_URL` is present (as on Vercel after the steps above), the site
> stores everything in the cloud. Locally, where it is absent, it uses your disk
> — so you can develop and preview without any accounts.

---

## Environment variables

See [`.env.example`](.env.example) for the full list and explanations:

- `ADMIN_USERNAME`, `ADMIN_PASSWORD` — admin login.
- `SESSION_SECRET` — signs the login cookie (keep it secret).
- `CLOUDINARY_URL` — your Cloudinary key; set it on Vercel, leave blank locally.

---

## Project structure

```
app/
  page.tsx              Home page (hero slideshow, featured, projects teaser)
  collection/           Filterable collection gallery
  product/[id]/         Product detail pages (multi-image gallery)
  projects/             Projects gallery + detail pages
  contact/              Contact / enquiry form
  admin/                Admin login + tabbed dashboard
  api/                  Auth, products, projects, categories, messages
components/             Header, footer, galleries, slideshow, admin dashboard
lib/
  store.ts             Storage layer (Cloudinary + local fallback)
  auth.ts              Cookie-based admin authentication
  validate.ts          Shared image-upload validation
  types.ts, seed.ts    Data shapes and default categories
middleware.ts          Protects /admin routes
```
