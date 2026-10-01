# Toty Sport — Project Overview

Welcome to **Toty Sport**, a state-of-the-art, premium sportswear & football jerseys e-commerce platform. The website features an ultra-responsive shopping interface, fluid athletic animations, complete dark/light mode compatibility, and a fully integrated Firebase backend.

---

## 📁 Project Architecture & Directory Structure

The project is built on **Next.js 15 (App Router)** and follows a structured, clean, and modular folder layout:

```text
totysport/
├── app/                        # Next.js App Router root
│   ├── (admin)/                # Administrative routes (Dashboard, settings)
│   │   └── admin/              # Admin dashboard pages
│   ├── (store)/                # E-commerce store routes
│   │   ├── about/              # Brand story/about page
│   │   ├── checkout/           # Checkout & billing page
│   │   ├── contact/            # Customer support & social handles
│   │   ├── order-success/      # Post-purchase confirmation page
│   │   └── products/           # Dynamic product detail screens ([slug])
│   ├── api/                    # Serverless API routes (Authentication, Admin SDK)
│   ├── globals.css             # Root Tailwind styles & CSS theme variables
│   └── layout.tsx              # Root HTML wrapper with providers
│
├── components/                 # Reusable UI & Layout Components
│   ├── cart/                   # Shopping cart sidebar and logic drawer
│   ├── home/                   # Homepage components (Hero, Intro screen, collection)
│   ├── layout/                 # Main structure layout (Header, Footer)
│   ├── products/               # Product display items (Cards, Grid, details)
│   └── ui/                     # Generic reusable controls (Buttons, 3D Logo, spin)
│
├── features/                   # Core business logic providers & state hooks
│   ├── auth/                   # User authentication state (AuthProvider)
│   ├── cart/                   # Shopping cart state management (CartProvider)
│   └── theme/                  # Dark/light theme state machine (ThemeProvider)
│
├── hooks/                      # Custom React hooks (useScroll, etc.)
│   
├── lib/                        # Integrations & Utilities
│   ├── firebase/               # Firebase Client & Admin SDK initializers
│   ├── utils.ts                # Tailwind merge helper
│   └── validations/            # Zod validation schemas
│
├── public/                     # Static media assets (Logo, dynamic banners)
│
└── push_to_github.bat          # Automated deployment helper script
```

---

## 🚀 Key Design Philosophies

1. **Cinematic Football Match Intro**: A state-of-the-art 6.5s stadium experience with live loading counter, flickering floodlights, 3D SVG pitch drawing, animated flipping jersey with soft floor shadow, camera flashes, flying match ball, and an elegant net curtain split transition.
2. **Seamless Navigation**: Simplified into a clean single-page catalog directly under the header. No unnecessary clicks, filters, or page reloads. Direct cart access right from the header.
3. **Responsive Glassmorphism & High-Contrast Sport Aesthetics**: Adapts beautifully to mobile, desktop, and tablets. Deep black (`#0B0B0B`) combined with volt neon yellow (`#E6FF2E`) for an aggressive, luxury sportswear vibe.
4. **Instant Actionable Checkout**: Simplifies order placement into a single billing form that records orders on Firestore securely and automatically redirects upon completion.

