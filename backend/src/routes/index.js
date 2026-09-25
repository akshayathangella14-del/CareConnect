const express = require('express');
const env = require('../config/env');
const { getDatabaseStatus } = require('../config/database');
const { analyticsController, reviewController } = require('../controllers/business.controller');
const authRoutes = require('./v1/auth.routes');
const categoryRoutes = require('./v1/category.routes');
const skillRoutes = require('./v1/skill.routes');
const pricingRoutes = require('./v1/pricing.routes');
const providerRoutes = require('./v1/provider.routes');
const availabilityRoutes = require('./v1/availability.routes');
const serviceRequestRoutes = require('./v1/serviceRequest.routes');
const quoteRoutes = require('./v1/quote.routes');
const bookingRoutes = require('./v1/booking.routes');
const invoiceRoutes = require('./v1/invoice.routes');
const reviewRoutes = require('./v1/review.routes');
const disputeRoutes = require('./v1/dispute.routes');
const notificationRoutes = require('./v1/notification.routes');
const auditRoutes = require('./v1/audit.routes');
const analyticsRoutes = require('./v1/analytics.routes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: env.app.name,
      version: env.app.apiVersion,
      environment: env.app.nodeEnv,
      process: 'running',
      database: getDatabaseStatus(),
      timestamp: new Date().toISOString(),
    },
  });
});

router.get('/stats', analyticsController.publicStats);
router.get('/testimonials', reviewController.list);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/skills', skillRoutes);
router.use('/pricing-rules', pricingRoutes);
router.use('/providers', providerRoutes);
router.use('/availability', availabilityRoutes);
router.use('/service-requests', serviceRequestRoutes);
router.use('/quotes', quoteRoutes);
router.use('/bookings', bookingRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/reviews', reviewRoutes);
router.use('/disputes', disputeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
