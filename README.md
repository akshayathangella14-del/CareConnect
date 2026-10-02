# CareConnect - AI-Powered Home Services Platform

![CareConnect Banner](https://via.placeholder.com/1200x300/7C3AED/FFFFFF?text=CareConnect+-+Premium+Home+Services)

**CareConnect** is an enterprise-grade, intelligent home services booking platform designed to bridge the gap between customers and verified service professionals. Featuring an AI-powered matching algorithm, rigorous scope management, and real-time operational oversight, CareConnect sets a new standard for trust and transparency in the gig economy.

## 🌟 Key Differentiators & Premium Features

- **🛡️ ScopeGuard**: A robust, transparent workflow that handles mid-job scope changes. Providers can request price and task adjustments securely, requiring explicit customer approval before proceeding, eliminating offline cash disputes.
- **⏱️ ServiceTrace**: A verifiable, step-by-step event timeline for every booking. Customers can track when a provider is en route, arrived, and working, complete with photographic evidence in a secure **Proof Pack**.
- **🤖 Intelligent Matching**: Uses advanced AI to analyze natural-language service requests, categorized them instantly, and match them with the most qualified, verified professionals in the area.
- **📊 Real-Time Role Dashboards**: Five distinct user roles, each with a highly customized, real-time dashboard powered by active database metrics and operational queues.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Strict token-based CSS (`tokens.css`), responsive design, and Lucide React icons
- **Architecture**: Modular, feature-based directory structure with role-based routing

### Backend
- **Environment**: Node.js & Express.js
- **Database**: MongoDB & Mongoose (Atlas)
- **AI Integration**: Google Gemini API
- **Security**: JWT-based Authentication, strict Role-Based Access Control (RBAC)

---

## 👥 Five-Tier User Ecosystem

CareConnect operates on a strict Role-Based Access Control (RBAC) system, ensuring complete data security and targeted user experiences:

1. **Customer**: Submits requests, compares provider quotes, tracks active jobs via ServiceTrace, approves ScopeGuard requests, and leaves verified reviews.
2. **Service Provider**: Manages job leads, submits structured quotes, updates schedules, and uploads ServiceTrace evidence.
3. **Operations Manager**: Monitors SLA compliance, provider utilization, and verification queues in real-time.
4. **Support Agent**: Handles platform disputes through a dynamic priority queue and billing inquiries.
5. **Admin**: Oversees platform health, revenue summaries, conversion rates, and overarching system analytics.

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env variables (MongoDB, JWT Secret, Gemini API Key)
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL to your backend URL (e.g., http://localhost:5000/api/v1)
npm run dev
```

---

## 📊 Database Architecture

The platform relies on 14 meticulously structured MongoDB collections:
`User`, `ProviderProfile`, `ServiceCategory`, `Skill`, `AvailabilitySlot`, `PricingRule`, `ServiceRequest`, `Quote`, `Booking`, `Invoice`, `Payment`, `Review`, `Dispute`, `Notification`, and `AuditLog`.

---

## 📝 API Documentation (RESTful)

Base URL: `/api/v1`

- **Auth**: `/auth/register`, `/auth/login`, `/auth/me`
- **Service Requests**: `/service-requests`, `/service-requests/:id`
- **Quotes**: `/quotes`, `/quotes/:id/submit`, `/quotes/:id/accept`
- **Bookings**: `/bookings`, `/bookings/:id/service-trace`, `/bookings/:id/scope-changes`
- **Analytics**: `/analytics/summary` (Admin/Ops only)
- *And many more role-protected endpoints.*

---

## 🚀 Deployment Status

**Version**: 1.0.0 (Production Ready)

**Recent Integrations**:
- ✅ Fully dynamic Analytics and Operational Dashboards (100% real data)
- ✅ ServiceTrace and ScopeGuard UI refactoring for maximum visibility
- ✅ Dynamic Testimonial Engine fed by real `PUBLISHED` platform reviews
- ✅ Enterprise-grade UI/UX overhaul using predefined CSS tokens

---

## 📄 License
ISC License. All rights reserved.

---
*CareConnect is continually evolving. Core architecture is designed for immense scalability and real-time operations.*
