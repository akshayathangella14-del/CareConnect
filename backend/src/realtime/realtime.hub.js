/**
 * CareConnect Realtime Hub
 *
 * Lightweight, dependency-free Server-Sent Events (SSE) hub.
 *
 * Every authenticated browser tab keeps one long-lived HTTP stream open
 * (GET /api/v1/realtime/stream). The hub tracks those streams in memory and
 * pushes events to:
 *   - a specific user (personal notifications, read-state sync)
 *   - specific roles (e.g. support agents for new disputes)
 *   - every connected client (cache invalidation "data:changed" signals)
 *
 * Events never carry sensitive payloads to broadcast audiences — broadcasts only
 * contain entity *tags* (e.g. "Booking", "Quote"). Each client then refetches
 * through the normal, permission-checked REST API, so RBAC is always enforced.
 */
const logger = require('../utils/logger');

const HEARTBEAT_INTERVAL_MS = 25000;

/** @type {Map<number, { res: import('express').Response, userId: string, role: string }>} */
const clients = new Map();
let nextClientId = 1;
let heartbeatTimer = null;

const writeEvent = (res, event, data) => {
  try {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data ?? {})}\n\n`);
    if (typeof res.flush === 'function') res.flush();
    return true;
  } catch (error) {
    logger.warn('Realtime write failed.', error);
    return false;
  }
};

const startHeartbeat = () => {
  if (heartbeatTimer) return;

  heartbeatTimer = setInterval(() => {
    clients.forEach(({ res }, id) => {
      try {
        // SSE comment line keeps proxies (Render, Nginx, Cloudflare) from idling out.
        res.write(`: ping ${Date.now()}\n\n`);
      } catch {
        clients.delete(id);
      }
    });
  }, HEARTBEAT_INTERVAL_MS);

  if (typeof heartbeatTimer.unref === 'function') heartbeatTimer.unref();
};

const stopHeartbeatIfIdle = () => {
  if (clients.size === 0 && heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
};

/**
 * Registers a new SSE client. Returns an unsubscribe function.
 */
const addClient = (res, user) => {
  const id = nextClientId++;
  clients.set(id, {
    res,
    userId: String(user._id),
    role: user.role,
  });
  startHeartbeat();

  return () => {
    clients.delete(id);
    stopHeartbeatIfIdle();
  };
};

const emitToUser = (userId, event, data) => {
  if (!userId) return 0;
  const target = String(userId);
  let delivered = 0;
  clients.forEach((client) => {
    if (client.userId === target && writeEvent(client.res, event, data)) delivered += 1;
  });
  return delivered;
};

const emitToRoles = (roles, event, data) => {
  const roleSet = new Set(Array.isArray(roles) ? roles : [roles]);
  let delivered = 0;
  clients.forEach((client) => {
    if (roleSet.has(client.role) && writeEvent(client.res, event, data)) delivered += 1;
  });
  return delivered;
};

const broadcast = (event, data) => {
  let delivered = 0;
  clients.forEach((client) => {
    if (writeEvent(client.res, event, data)) delivered += 1;
  });
  return delivered;
};

const getStats = () => ({
  connections: clients.size,
  users: new Set([...clients.values()].map((client) => client.userId)).size,
});

/**
 * Gracefully ends every open stream (used during server shutdown so
 * `server.close()` is not blocked by long-lived connections).
 */
const closeAll = () => {
  clients.forEach(({ res }) => {
    try {
      res.end();
    } catch {
      // ignore
    }
  });
  clients.clear();
  stopHeartbeatIfIdle();
};

module.exports = {
  addClient,
  writeEvent,
  emitToUser,
  emitToRoles,
  broadcast,
  getStats,
  closeAll,
};
