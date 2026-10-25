<div align="center">

# 🕌 Qabiltoo

### **قـابـلـتـو** — A Premium Muslim Matrimonial Platform

*Nikah matchmaking with trust, dignity & privacy at its heart — not a dating app.*

[![CI/CD](https://github.com/OwaisKhan117/qabiltoo/actions/workflows/ci.yml/badge.svg)](https://github.com/OwaisKhan117/qabiltoo/actions/workflows/ci.yml)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![Bun](https://img.shields.io/badge/Bun-1-f472b6)
![License](https://img.shields.io/badge/license-Proprietary-0B5345)

**Emerald `#0B5345`** · **Gold `#D4AF37`** · **Ivory `#FBF7F0`**

[Features](#-features) · [Screenshots](#-screenshots) · [Quickstart](#-quickstart) · [Docker](#-docker) · [Architecture](#-architecture)

</div>

---

## ✨ About

**Qabiltoo** (قابلٹو — *"match / worthy of each other"*) is a demo-ready, full-stack prototype of a
**premium Muslim matrimonial platform** built for investor and early-user demos.

It is deliberately designed to feel like a **boutique matchmaking service**, not a swipe-based dating
app: halal-first language (`proposal`, `match`, `family`, `nikah`), guardian (**wali**) participation,
tiered identity verification, blurred-photo privacy until mutual interest, and a calm, dignified
visual language — deep emerald, warm gold, ivory, and girih geometric patterns rendered in 3D.

> Assalamu Alaikum — welcome to a beautiful, modern, and **safe** way to find your qabiltoo.

## 🚀 Features

| Module | Highlights |
| --- | --- |
| 🏠 **Landing** | 3D girih star background, parallax hero, animated counters, live activity ticker, success-story carousel |
| 📝 **Onboarding** | Multi-step flow with phone OTP, `myself / wakeel (family)` mode, live profile preview, ID-verification ceremony, golden-rays celebration |
| 🔍 **Discover** | Grid/list views, today's curated picks, instant faceted filters, **privacy-blurred photos with lock** until match |
| 👤 **Profiles** | Lightbox album, trust badges, wali card, dignified `Send Proposal` CTA |
| 💞 **Interests & Matches** | Mutual-accept unlock animation, gated "who viewed me" premium previews, toasts |
| 💬 **Realtime Chat** | Socket.io — typing indicators, read receipts, wali joins with a distinct badge, post-match video-call requests |
| 👴 **Guardian Dashboard** | Dedicated wali console with proposal approval queue & activity charts |
| 🛡️ **Trust Center** | Blue/Green/Gold verification tiers, animated Trust Score ring, Islamic etiquette guide |
| 💎 **Pricing** | Free / Silver / **Gold** / Platinum with live billing-cycle switcher & FAQ accordion |
| 📖 **Success Stories** | Masonry gallery with 3D flip-to-full-story cards |
| ☪️ **The Islamic Way** | Editorial page on our nikah-first philosophy with geometric art |
| ❓ **FAQ / About / Contact** | Full informational pages |
| ⚙️ **Admin Panel** | Live stats & charts, ID-verification approval queue, report moderation (warn/suspend/ban), content CMS |

## 🎨 Design System

- **Emerald** `#0B5345` — primary, trust
- **Warm Gold** `#D4AF37` — accents, CTAs, micro-glows
- **Ivory** `#FBF7F0` — canvas backgrounds
- **Rose-gold / blush** — premium-tier secondary accents
- Elegant serif display type with Arabic calligraphic accents (نكاح) reserved for hero moments
- Slow, graceful motion everywhere — trust over flash; static graceful degradation on low-end devices

## 📸 Screenshots

| | |
| --- | --- |
| ![Hero](public/images/hero-couple.png) | ![Hands](public/images/couple-hands.png) |

## ⚙️ Tech Stack

- **Framework** — Next.js 16 (App Router) + TypeScript 5
- **UI** — Tailwind CSS 4 + shadcn/ui (New York) + Lucide icons + Framer Motion + Three.js-style CSS 3D
- **Database** — Prisma ORM + SQLite (pre-seeded demo data)
- **Realtime** — Socket.io mini-service (typing, receipts, notifications, activity ticker)
- **Runtime** — Bun

## 🏃 Quickstart

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp .env.example .env

# 3. Create the database (schema + demo seed data)
bun run db:push
bun scripts/seed.ts

# 4. Start the web app (localhost:3000)
bun run dev

# 5. In a second terminal — start the realtime service (localhost:3003)
cd mini-services/qabiltoo-realtime && bun run dev
```

> The sandbox/preview gateway routes realtime traffic via `/?XTransformPort=3003` automatically.
> Self-hosting outside the gateway? Set `NEXT_PUBLIC_SOCKET_URL=http://localhost:3003` at build time.

## 🐳 Docker

```bash
# Build (CI also publishes ghcr.io/owaiskhan117/qabiltoo:latest on every push to main)
docker build -t qabiltoo .

# Run — web on :3000, realtime on :3003, pre-seeded demo database included
docker run -p 3000:3000 -p 3003:3003 qabiltoo
```

## 🏗️ Architecture

```
├── src/
│   ├── app/                    # Next.js App Router (UI views + /api routes)
│   │   ├── api/                # OTP, profiles, matches, chat, admin, activity…
│   │   └── page.tsx            # Single-shell experience (13 in-app views)
│   ├── components/qabiltoo/    # Feature components (landing, discover, chat, admin…)
│   └── lib/qabiltoo/           # Types, zustand store, socket client
├── mini-services/
│   └── qabiltoo-realtime/      # Socket.io service — port 3003
├── prisma/schema.prisma        # Profiles, matches, messages, verifications, reports…
├── scripts/seed.ts             # 20 diverse demo profiles + stories + verifications
├── Dockerfile                  # Web + realtime in one image
└── .github/workflows/ci.yml    # Lint → Build → Publish image to GHCR
```

## 🛡️ Product Values

1. **Nikah-first language** — proposals, matches, families. No swiping, no dating vocabulary.
2. **Privacy by default** — photos blurred until mutual interest; verification tiers you can *see*.
3. **Family involvement** — wali guardians get their own dashboard and a visible seat in conversations.
4. **Calm technology** — slow, elegant motion and a dignified tone worthy of the occasion.

## 📄 License

Proprietary — © 2026 Qabiltoo. All rights reserved.
Demo profiles, photos, and stories are AI-generated placeholders.
