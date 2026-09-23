const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const apiRoutes = require('./routes');
const notFoundHandler = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const AppError = require('./utils/AppError');

const createCorsOptions = () => ({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (env.cors.origins.includes(origin)) {
      return callback(null, true);
    }

    return callback(AppError.forbidden('Origin is not allowed by CORS policy.'));
  },
  credentials: env.cors.credentials,
});

const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors(createCorsOptions()));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'CareConnect API is running.',
      apiBase: `/api/${env.app.apiVersion}`,
    });
  });

  app.use(`/api/${env.app.apiVersion}`, apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;


