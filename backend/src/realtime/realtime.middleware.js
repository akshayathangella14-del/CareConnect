/**
 * Realtime change-feed middleware.
 *
 * Observes every successful mutating API call (POST/PUT/PATCH/DELETE → 2xx)
 * and, once the response has been sent, broadcasts a `data:changed` event
 * listing the entity tags that may now be stale. Connected clients map those
 * tags onto their RTK Query cache and transparently refetch only the queries
 * that are currently on screen.
 *
 * Because this hooks into the HTTP layer, *every* workflow transition
 * (quote accepted, booking en-route, invoice paid, dispute opened, provider
 * verified, review posted, …) becomes real-time without touching controllers.
 */
const realtimeHub = require('./realtime.hub');

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Entity tags affected by a mutation on each top-level API resource. */
const RESOURCE_TAGS = {
  'service-requests': ['ServiceRequest', 'Quote', 'Provider'],
  quotes: ['Quote', 'ServiceRequest', 'Booking'],
  bookings: ['Booking', 'ServiceRequest', 'Invoice', 'Quote', 'Availability'],
  invoices: ['Invoice', 'Booking', 'Payment'],
  payments: ['Payment', 'Invoice', 'Booking'],
  reviews: ['Review', 'Provider', 'Booking', 'Testimonial'],
  disputes: ['Dispute', 'Booking'],
  providers: ['Provider', 'User'],
  availability: ['Availability', 'Provider'],
  categories: ['Category'],
  skills: ['Skill'],
  'pricing-rules': ['PricingRule'],
};

/** Aggregates that should refresh whenever business data changes. */
const DASHBOARD_TAGS = ['Analytics', 'Stats', 'AuditLog'];

/** Auth sub-routes that change shared data (new users affect admin metrics). */
const AUTH_MUTATIONS = {
  register: ['User', 'Provider'],
  me: ['User', 'Provider'],
};

const parseSegments = (req) => {
  const path = (req.originalUrl || req.url || '').split('?')[0];
  // e.g. /api/v1/bookings/123/confirm → ['bookings', '123', 'confirm']
  const segments = path.split('/').filter(Boolean);
  const apiIndex = segments.findIndex((segment) => segment === 'api');
  return apiIndex >= 0 ? segments.slice(apiIndex + 2) : segments;
};

const resolveChange = (req) => {
  const [resource, ...rest] = parseSegments(req);
  if (!resource) return null;

  const action = rest.length ? rest[rest.length - 1] : req.method.toLowerCase();

  if (resource === 'notifications') {
    return { scope: 'user', resource, action, tags: ['Notification'] };
  }

  if (resource === 'auth') {
    const tags = AUTH_MUTATIONS[rest[0]];
    return tags ? { scope: 'all', resource, action, tags: [...tags, ...DASHBOARD_TAGS] } : null;
  }

  const tags = RESOURCE_TAGS[resource];
  if (!tags) return null;

  return { scope: 'all', resource, action, tags: [...tags, ...DASHBOARD_TAGS] };
};

const realtimeChangeFeed = (req, res, next) => {
  if (!MUTATING_METHODS.has(req.method)) {
    return next();
  }

  res.on('finish', () => {
    if (res.statusCode < 200 || res.statusCode >= 400) return;

    const change = resolveChange(req);
    if (!change) return;

    const payload = {
      tags: change.tags,
      resource: change.resource,
      action: change.action,
      actorId: req.user?._id ? String(req.user._id) : null,
      at: new Date().toISOString(),
    };

    if (change.scope === 'user') {
      // Read-state changes are private: only sync the actor's other tabs/devices.
      if (req.user?._id) realtimeHub.emitToUser(req.user._id, 'data:changed', payload);
      return;
    }

    realtimeHub.broadcast('data:changed', payload);
  });

  return next();
};

module.exports = {
  realtimeChangeFeed,
  resolveChange,
};
