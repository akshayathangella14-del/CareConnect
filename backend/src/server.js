const createApp = require('./app');
const env = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/database');
const logger = require('./utils/logger');

let server;

const startServer = async () => {
  await connectDatabase();

  const app = createApp();

  // Auto-seed Categories on startup to prevent empty dropdowns during testing
  try {
    const ServiceCategory = require('./models/ServiceCategory');
    const count = await ServiceCategory.countDocuments();
    if (count === 0) {
      logger.info('Auto-seeding default categories...');
      await ServiceCategory.insertMany([
        { name: 'Plumbing', slug: 'plumbing', description: 'Plumbing and water works' },
        { name: 'Electrical', slug: 'electrical', description: 'Electrical repairs' },
        { name: 'Appliance Repair', slug: 'appliance-repair', description: 'Fixing home appliances' },
        { name: 'Cleaning', slug: 'cleaning', description: 'Home cleaning' }
      ]);
    }
  } catch (err) {
    logger.error('Failed to auto-seed categories', err);
  }

  server = app.listen(env.app.port, () => {
    logger.info(`${env.app.name} listening on port ${env.app.port} in ${env.app.nodeEnv} mode.`);
  });

  return server;
};

const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully.`);

  if (server) {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    return;
  }

  await disconnectDatabase();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection.', error);
  shutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception.', error);
  shutdown('uncaughtException');
});

startServer().catch((error) => {
  logger.error('Server startup failed.', error);
  process.exit(1);
});
