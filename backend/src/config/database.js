const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const connectionStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

const getDatabaseStatus = () => connectionStates[mongoose.connection.readyState] || 'unknown';

const connectDatabase = async () => {
  if (!env.database.uri) {
    if (env.app.isProduction) {
      throw new Error('MONGODB_URI is required in production.');
    }

    logger.warn('MONGODB_URI is not configured. Starting without a database connection.');
    return mongoose.connection;
  }

  try {
    await mongoose.connect(env.database.uri, {
      serverSelectionTimeoutMS: 10000,
    });

    logger.info('MongoDB connection established.');
    return mongoose.connection;
  } catch (error) {
    logger.error('MongoDB connection failed.', error);
    throw error;
  }
};

const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed.');
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getDatabaseStatus,
};
