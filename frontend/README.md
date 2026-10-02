# CareConnect - Frontend Application

![CareConnect Frontend](https://via.placeholder.com/1200x200/7C3AED/FFFFFF?text=CareConnect+-+Frontend+Architecture)

The **CareConnect Frontend** is a state-of-the-art React application that powers a premium, AI-driven home services marketplace. Built with a focus on speed, strict design tokens, and real-time state management, it provides distinct, role-based experiences for Customers, Service Providers, Operations Managers, Support Agents, and Administrators.

## 🚀 Technical Architecture

- **Core Framework**: React 18 & Vite
- **State Management**: Redux Toolkit (Centralized Store)
- **API Communication**: RTK Query (Caching, Invalidations, Real-Time Polling)
- **Styling**: Native CSS Modules with strict CSS Variables (`tokens.css`) for a highly premium, maintainable design system.
- **Iconography**: Lucide React

## 🌟 Premium UX Features

- **Dynamic Role-Based Dashboards**: 100% data-driven dashboards pulling live metrics for each of the 5 user roles.
- **ScopeGuard UI**: Built-in approval components for handling mid-service price/scope changes directly within the booking view.
- **ServiceTrace Timeline**: Real-time event tracking UI and Proof Pack (photographic evidence) renderer.
- **Testimonial Engine**: Dynamically fetches and rotates 5-star published reviews from the live database.

## 📁 Directory Structure

```
frontend/
├── public/                 # Static assets (images, fonts, logos)
├── src/
│   ├── api/                # Base RTK Query configurations
│   ├── app/                # Redux store and routing setup
│   ├── components/         # Reusable UI primitives (Buttons, Cards, Modals)
│   ├── features/           # Redux slices and API endpoints by domain
│   ├── layouts/            # App shells and navigation wrappers
│   ├── pages/              # Top-level route components organized by role
│   └── styles/             # Global CSS and strict design tokens
└── package.json
```

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+
- Backend API running (see `../backend/README.md`)

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the `frontend` root:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 4. Run Development Server
```bash
npm run dev
```
The application will start at `http://localhost:3000`.

## 🎨 Design System

CareConnect utilizes a strict token-based design system ensuring visual consistency across all roles:
- **Primary**: Deep violets and rich gradients for a premium feel.
- **Typography**: Inter (Headers) & Poppins (Body) for excellent legibility.
- **Components**: Compound architecture (e.g., `Card.Header`, `Card.Body`) for maximum reusability.

---
*Built for the CareConnect ecosystem. Strict adherence to React best practices is required for all contributions.*
