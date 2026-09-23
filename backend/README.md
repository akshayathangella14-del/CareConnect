# CareConnect Backend

Backend foundation for CareConnect, an AI-powered home services booking and operations platform. This backend is a single Node.js, Express.js, MongoDB, and Mongoose application with REST APIs versioned under `/api/v1`.

No business-domain features are implemented in this phase.

## Prerequisites

- Node.js 20 or newer
- npm
- Local MongoDB server for development

## Installation

```bash
npm install
```

## Environment Setup

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `.env` with local values. Never commit `.env` or real credentials.

Important variables:

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `CLIENT_ORIGINS`
- `CORS_CREDENTIALS`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

For local development, use a local MongoDB database named `careconnect`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/careconnect
```

MongoDB Compass can be used to inspect the local database, but the local MongoDB server must be running for live database connectivity.

JWT authentication uses bearer tokens. Set `JWT_SECRET` to a long random value in `.env`; never commit real secrets.

## Development Server

```bash
npm run dev
```

The default local port is `5000` when `PORT` is not set.

## Production Start

```bash
npm start
```

In production, `MONGODB_URI` and `CLIENT_ORIGINS` must be configured.

## Tests

```bash
npm test
```

Syntax checks:

```bash
npm run check
```

## Health Endpoint

```http
GET /api/v1/health
```

The health response confirms that the API process is running and returns only safe operational status. It does not expose credentials or connection strings.

## Authentication Endpoints

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/me
POST /api/v1/auth/logout
```

Logout is stateless for this JWT foundation. The client removes its stored bearer token; the server does not store or blacklist tokens in Phase 2.

## MongoDB Configuration

The application reads the database connection from `MONGODB_URI`. Use local MongoDB for normal development:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/careconnect
```

For deployment or remote testing later, a MongoDB Atlas URI can replace the local URI through the same `MONGODB_URI` variable. Do not hardcode database credentials in source files.

## Render Deployment Notes

- Set the root directory to `backend` when deploying this service from the monorepo.
- Use `npm install` as the build/install command.
- Use `npm start` as the start command.
- Configure `NODE_ENV=production`.
- Set `MONGODB_URI` to the deployment MongoDB connection string.
- Set `CLIENT_ORIGINS` to the deployed frontend origin.
- Keep secrets in Render environment variables.

## Security Reminder

Secrets, database credentials, and API keys must never be committed. Use `.env` locally and platform environment variables in deployment.
