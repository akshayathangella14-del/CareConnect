const path = require('path');
const dotenv = require('dotenv');

const envFilePath = path.resolve(__dirname, '../../.env');
const parsedEnv = dotenv.config({ path: envFilePath }).parsed || {};

const readEnv = (key, fallback = '') => {
  if (process.env[key] !== undefined && process.env[key] !== '') {
    return process.env[key];
  }

  if (parsedEnv[key] !== undefined && parsedEnv[key] !== '') {
    return parsedEnv[key];
  }

  return fallback;
};

const readPort = () => {
  // Prefer the app .env PORT so a machine-wide PORT (often 8080 on Windows)
  // cannot silently move the API away from the frontend proxy target.
  if (parsedEnv.PORT) {
    return parsedEnv.PORT;
  }

  return process.env.PORT || '5000';
};

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';
const isDevelopment = NODE_ENV === 'development';

const parsePort = (value) => {
  const port = Number.parseInt(value, 10);

  if (Number.isNaN(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a valid TCP port number.');
  }

  return port;
};

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === '') {
    return defaultValue;
  }

  return ['true', '1', 'yes'].includes(String(value).toLowerCase());
};

const parseOrigins = (value) => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const defaultClientOrigins = isProduction
  ? ''
  : 'http://localhost:3000,http://127.0.0.1:3000';
const jwtSecretPlaceholder = 'replace-with-a-long-random-secret';

const config = {
  app: {
    name: 'CareConnect API',
    apiVersion: 'v1',
    nodeEnv: NODE_ENV,
    port: parsePort(readPort()),
    isProduction,
    isDevelopment,
    isTest,
  },
  database: {
    uri: readEnv('MONGODB_URI'),
  },
  cors: {
    origins: parseOrigins(readEnv('CLIENT_ORIGINS', defaultClientOrigins)),
    credentials: parseBoolean(readEnv('CORS_CREDENTIALS'), false),
  },
  jwt: {
    secret: readEnv('JWT_SECRET'),
    expiresIn: readEnv('JWT_EXPIRES_IN', '1d'),
  },
  gemini: {
    apiKey: readEnv('GEMINI_API_KEY'),
    model: readEnv('GEMINI_MODEL', 'gemini-2.5-flash'),
  },
};

const validateConfig = () => {
  const missing = [];

  if (config.app.isProduction && !config.database.uri) {
    missing.push('MONGODB_URI');
  }

  if (config.app.isProduction && config.cors.origins.length === 0) {
    missing.push('CLIENT_ORIGINS');
  }

  if (
    config.app.isProduction
    && (!config.jwt.secret || config.jwt.secret === jwtSecretPlaceholder || config.jwt.secret.length < 32)
  ) {
    missing.push('JWT_SECRET');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

validateConfig();

module.exports = config;
