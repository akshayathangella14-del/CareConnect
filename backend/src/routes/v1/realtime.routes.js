const express = require('express');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../utils/access');
const realtimeHub = require('../../realtime/realtime.hub');

const router = express.Router();

/**
 * GET /api/v1/realtime/stream
 *
 * Opens a Server-Sent Events stream for the authenticated user.
 * Events:
 *   ready         → { userId, role, serverTime }
 *   notification  → { notification }               (personal)
 *   data:changed  → { tags[], resource, action, at } (cache invalidation)
 */
router.get('/stream', authenticate, (req, res) => {
  req.socket.setTimeout(0);
  req.socket.setNoDelay(true);
  req.socket.setKeepAlive(true);

  res.status(200);
  res.set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  // Tell the browser how long to wait before reconnecting after a drop.
  res.write('retry: 4000\n\n');

  const unsubscribe = realtimeHub.addClient(res, req.user);

  realtimeHub.writeEvent(res, 'ready', {
    userId: String(req.user._id),
    role: req.user.role,
    serverTime: new Date().toISOString(),
  });

  const cleanup = () => {
    unsubscribe();
  };

  req.on('close', cleanup);
  res.on('error', cleanup);
});

/**
 * GET /api/v1/realtime/stats — live connection counters (admin only).
 */
router.get('/stats', authenticate, (req, res) => {
  requireRole(req.user, ['ADMIN']);
  res.status(200).json({ success: true, data: realtimeHub.getStats() });
});

module.exports = router;
