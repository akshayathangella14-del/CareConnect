# CareConnect Frontend

**AI-Powered Home Services Booking & Operations Platform**

## Overview

CareConnect is a full-stack MERN application for home-service booking and operations. This directory contains the React frontend, built on a centralized design system called **Warm Precision**.

## Tech Stack

- **React 18** — UI library
- **Vite** — Build tool and dev server
- **React Router v6** — Client-side routing
- **Redux Toolkit** — State management
- **RTK Query** — API data fetching and caching
- **Lucide React** — Icon library
- **CSS Modules** — Component-scoped styling with centralized design tokens

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` and configure:

```
VITE_API_BASE_URL=/api/v1
```

The Vite development server proxies `/api` requests to the backend at `http://127.0.0.1:5000`.

### Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── api/                    # RTK Query API slices
│   │   └── apiSlice.js         # Base API configuration
│   ├── app/
│   │   ├── providers/          # React context providers
│   │   ├── router/             # Route definitions
│   │   └── store/              # Redux store configuration
│   ├── components/
│   │   ├── ui/                 # Core UI primitives
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Textarea/
│   │   │   ├── Badge/
│   │   │   ├── Card/
│   │   │   └── Divider/
│   │   ├── feedback/           # Feedback components
│   │   │   ├── Alert/
│   │   │   ├── EmptyState/
│   │   │   ├── Skeleton/
│   │   │   └── Spinner/
│   │   └── index.js            # Centralized exports
│   ├── layouts/
│   │   └── AppShell/           # Main application layout
│   ├── pages/
│   │   ├── HomePage.jsx        # Foundation landing
│   │   └── DesignSystemPage.jsx # Design system showcase
│   ├── styles/
│   │   ├── tokens.css          # Design tokens (FROZEN)
│   │   └── global.css          # Global styles and resets
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Entry point
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Design System — Warm Precision

The CareConnect design system is **frozen**. All future development must adhere to these tokens.

### Colors

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#0F5C5E` | Primary CTAs, active states, brand |
| `--color-primary-hover` | `#0B494B` | Primary hover state |
| `--color-primary-soft` | `#E7F3F2` | Soft primary backgrounds |
| `--color-accent` | `#D99A3D` | Sparingly — highlights, ratings |
| `--color-background` | `#F7F8F7` | Page background |
| `--color-surface` | `#FFFFFF` | Card/panel background |

### Typography

- **Font**: Inter (400, 500, 600, 700)
- **Scale**: Display (40px) → Caption (12px)
- **Responsive**: Headings reduce on mobile

### Spacing

4px base grid: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96`

### Radius

`4px, 6px, 10px, 14px, 20px, 999px (pill)`

### Shadows

Restrained: `none`, `subtle`, `overlay`

### Motion

`120ms (fast)`, `180ms (normal)`, `250ms (slow)` — respects `prefers-reduced-motion`

## Routes

| Path | Description |
|---|---|
| `/` | Home — Foundation landing placeholder |
| `/design-system` | Design system showcase (development) |

## Component Library

All components are accessible, responsive, and follow the Warm Precision design language:

- **Button** — primary, secondary, ghost, destructive variants
- **Input** — With label, error, helper text, icons
- **Textarea** — With character count and validation
- **Badge** — Semantic status indicators with dot option
- **Card** — Compound component (Header, Body, Footer)
- **Divider** — Horizontal/vertical with optional label
- **Alert** — Info, success, warning, error notifications
- **Skeleton** — Loading placeholders
- **EmptyState** — Empty view placeholder with CTA
- **Spinner** — Loading indicator in 4 sizes

## Accessibility

- Semantic HTML throughout
- Visible focus states (`:focus-visible`)
- ARIA labels on interactive elements
- `prefers-reduced-motion` respected
- Form inputs with proper labels and error associations
- Keyboard navigation support

## Important Notes

- **No dark mode** — Light theme only
- **No backend changes** — Backend is frozen
- **No secrets in frontend** — Only `VITE_API_BASE_URL`
- **Design system is frozen** — Do not modify tokens

## License

Private — CareConnect Capstone Project
