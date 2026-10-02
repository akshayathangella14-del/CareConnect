# CareConnect - Backend Service

![CareConnect Backend](https://via.placeholder.com/1200x200/7C3AED/FFFFFF?text=CareConnect+-+Backend+Architecture)

The **CareConnect Backend** is a robust, highly scalable Node.js and Express API powering the CareConnect home services ecosystem. Built on MongoDB, it provides comprehensive data modeling, stringent role-based access control, and seamless AI integration for intelligent service matching.

## 🚀 Technical Architecture

- **Core Framework**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Security**: JWT-based Authentication, Bcrypt password hashing
- **AI Integration**: Google Gemini API (Natural Language Processing for matching & quoting)
- **Role-Based Access Control (RBAC)**: Strict middleware enforcement for 5 distinct roles: `CUSTOMER`, `SERVICE_PROVIDER`, `OPERATIONS_MANAGER`, `SUPPORT_AGENT`, and `ADMIN`.

## 🌟 Core Domain Features

- **ServiceRequest & Matching Engine**: Parses natural language requests, extracts structured parameters, and assigns a confidence score to intelligently route leads to verified Service Providers.
- **ScopeGuard API**: Manages the strict state-machine workflow for mid-service scope changes. Includes multi-party approval tracking.
- **ServiceTrace & Proof Pack API**: Immutable logging of service timeline events (e.g., En Route, Arrived, Work Started) and encrypted storage endpoints for photographic evidence.
- **Aggregated Analytics Engine**: Advanced MongoDB aggregation pipelines powering real-time dashboards for Admin, Support, and Operations.

## 📁 Directory Structure

```
backend/
├── src/
│   ├── controllers/      # Route handlers and request parsing
│   ├── middleware/       # JWT Auth, Role Enforcement, Error Handlers
│   ├── models/           # Mongoose schemas (14 core collections)
│   ├── routes/v1/        # API route definitions
│   ├── services/         # Business logic (e.g., Gemini AI processing)
│   ├── utils/            # Helper functions and constants
│   └── app.js            # Express application setup
├── scripts/              # Database seeders and maintenance tools
├── tests/                # Test suites
└── package.json
```

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+
- Local MongoDB Server OR MongoDB Atlas connection URI

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend` root:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careconnect
CLIENT_ORIGINS=http://localhost:3000
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
The API will start at `http://localhost:5000/api/v1`.

### 5. Database Seeding (Optional)
To populate the database with realistic test data (Providers, Customers, Categories):
```bash
node scripts/seedCategories.js
node scripts/seedProviders.js
node scripts/seedUsers.js
```

## 🔐 Security & Access Control

All protected routes require a valid `Bearer` token in the `Authorization` header. Access is strictly governed by the `requireRole` middleware. Attempting to access an unauthorized endpoint will result in a `403 Forbidden` response.

---
*Built for the CareConnect ecosystem. Ensure all new models are properly indexed for performance.*
