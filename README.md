# CareConnect - AI-Powered Home Services Platform

An intelligent home services booking platform that connects customers with verified service providers using AI-powered matching and comprehensive workflow management.

## 🚀 Tech Stack

- **Frontend**: React 18, Redux Toolkit, RTK Query, Vite
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **AI**: Google Gemini API for intelligent service understanding
- **Authentication**: JWT-based with role-based access control
- **Deployment**: Render (Backend), Vercel (Frontend), MongoDB Atlas (Database)

## 📁 Project Structure

```
careconnect/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   └── package.json
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Redux features & API
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   └── styles/        # Global styles
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
CLIENT_ORIGINS=https://your-frontend-url.vercel.app
CORS_CREDENTIALS=false
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-2.5-flash
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
VITE_APP_NAME=CareConnect
```

## 🌐 Deployment URLs

- **Frontend**: [Your Vercel URL]
- **Backend**: [Your Render URL]
- **Database**: MongoDB Atlas

## 👥 User Roles

- **CUSTOMER**: Create service requests, view quotes, manage bookings
- **SERVICE_PROVIDER**: Receive requests, submit quotes, manage availability
- **OPERATIONS_MANAGER**: Verify providers, oversee operations
- **SUPPORT_AGENT**: Handle disputes and customer support
- **ADMIN**: Full system administration

## 🔐 Core Features

- **AI-Powered Service Understanding**: Intelligent analysis of service requests
- **Provider Matching**: Smart algorithm to match customers with verified providers
- **Quote Management**: Competitive quoting system with scope tracking
- **Booking Management**: Complete booking lifecycle with status tracking
- **ScopeGuard**: Change request workflow with evidence tracking
- **ServiceTrace**: Complete audit trail of service journey
- **Proof Pack**: Evidence capture and review system

## 📊 Database Schema

14 core collections:
- User, ProviderProfile, ServiceCategory, Skill, AvailabilitySlot, PricingRule
- ServiceRequest, Quote, Booking, Invoice, Review, Dispute, Notification, AuditLog

## 🚀 Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📝 API Documentation

Base URL: `/api/v1`

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Service Requests
- `POST /service-requests` - Create service request
- `GET /service-requests` - List service requests
- `GET /service-requests/:id` - Get service request details

### And many more...

## 🛠️ Development Status

**Current Version**: 1.0.0 (Beta)

**Implemented Features**:
- ✅ User authentication and authorization
- ✅ Service request creation with AI analysis
- ✅ Provider matching system
- ✅ Quote management
- ✅ Booking management
- ✅ ScopeMatch UI
- ✅ ScopeGuard workflow
- ✅ ServiceTrace dashboard
- ✅ Proof Pack evidence system
- ✅ AI confidence scoring
- ✅ Category-based service catalog

**In Progress**:
- 🔄 Complete 8-category service catalog
- 🔄 Enhanced analytics dashboard
- 🔄 Payment processing integration

## 📄 License

ISC

## 👨‍💻 Development Team

Built with AI assistance using Codex, Antigravity, Devin, and Cursor.

---

**Note**: This is a progressive deployment. Core features are live, with continuous improvements being deployed.
