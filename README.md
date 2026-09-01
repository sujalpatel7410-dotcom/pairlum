# Pairlum

A private, warm candlelight digital sanctuary for couples — memories, letters,
time-locked capsules, chapters, and reunions.

Pairlum is a static React/Vite single-page app. It has no server of its own;
shared data (memories, letters, the reunion plan, etc.) lives in a
[Supabase](https://supabase.com) project, and photo/video uploads go straight
from the browser to [Cloudinary](https://cloudinary.com).

## 1. Set up Supabase (accounts + shared data)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste in the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates every
   table, locks them down with row-level security so only the two paired
   partners can read/write their own space, and adds the `create_couple` /
   `join_couple` functions the sign-up flow uses.
3. Go to **Project Settings → API** and copy the **Project URL** and
   **anon public** key.
4. In **Authentication → Providers**, email/password sign-up is on by default.
   For a first deploy you may also want to turn off "Confirm email" under
   **Authentication → Sign In / Providers → Email** so partners can log in
   immediately after signing up (re-enable it once you're ready for real use).

## 2. Set up Cloudinary (photo/video uploads)

1. Create a free account at [cloudinary.com](https://cloudinary.com) and copy
   your **Cloud name** from the Dashboard.
2. Go to **Settings → Upload → Upload presets → Add upload preset**, set
   **Signing Mode** to **Unsigned**, and name it (e.g. `pairlum_unsigned`).

## 3. (Optional) Set up n8n for partner email notifications

See [`n8n/README.md`](n8n/README.md) — import
`n8n/pairlum-notifications.workflow.json`, activate it, and copy its webhook
URL.

## 4. Configure environment variables

Copy `.env.example` to `.env` and fill in the values from steps 1–3:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_N8N_WEBHOOK_URL=
```

Set the same variables in your hosting provider's dashboard for production
builds (Vercel/Netlify/Cloudflare Pages: Project Settings → Environment
Variables).

## Local development

```bash
bun install   # or npm install
bun run dev   # starts on http://localhost:3000
```

## Deploying

This is a static site — `bun run build` outputs a `dist/` folder that can be
served by any static host:

```bash
bun run build
```

Point your host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3+CloudFront,
etc.) at this repo with:

- **Build command:** `bun run build` (or `npm run build`)
- **Output directory:** `dist`
- **Environment variables:** as listed above

Because it's a single-page app, configure your host to fall back to
`index.html` for unknown routes (Vercel/Netlify do this automatically for
Vite projects; other hosts may need an explicit SPA rewrite rule).

## How partners get paired

1. Each partner signs up with their own email/password.
2. The first partner picks **Create a new space**, which generates an invite
   code (visible from Settings once inside the app).
3. The second partner picks **Join with an invite code** and enters it.

From then on both accounts are linked to the same couple space via the
`couple_members` table, and every change either partner makes shows up for
the other in real time (Supabase Realtime).

## Notes on the "Drawer" PIN

The Drawer's PIN lock is a lightweight privacy gate, not real encryption — the
PIN is stored and checked client-side, so treat it as a "keep it from casual
glances" feature rather than a security boundary.
