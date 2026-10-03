/**
 * CareConnect Realtime Client
 *
 * A resilient Server-Sent Events client built on `fetch` + ReadableStream so
 * the JWT can be sent in the Authorization header (native EventSource cannot
 * set headers, which would force the token into the URL).
 *
 * Features
 *  - Exponential back-off with jitter on disconnects
 *  - Heartbeat watchdog: detects silently dead connections (sleep, Wi-Fi swap)
 *  - Immediate reconnect when the tab becomes visible / the device comes online
 *  - Stops permanently on 401/403 (session expired)
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const STREAM_URL = `${API_BASE.replace(/\/$/, '')}/realtime/stream`;

const WATCHDOG_TIMEOUT_MS = 60000; // server pings every 25s
const MIN_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;

const parseEventBlock = (block) => {
  let event = 'message';
  const dataLines = [];

  block.split(/\r?\n/).forEach((line) => {
    if (!line || line.startsWith(':')) return; // comment / heartbeat
    const separator = line.indexOf(':');
    const field = separator === -1 ? line : line.slice(0, separator);
    const value = separator === -1 ? '' : line.slice(separator + 1).replace(/^ /, '');

    if (field === 'event') event = value;
    else if (field === 'data') dataLines.push(value);
  });

  if (dataLines.length === 0) return null;

  try {
    return { event, data: JSON.parse(dataLines.join('\n')) };
  } catch {
    return { event, data: dataLines.join('\n') };
  }
};

/**
 * @param {object} options
 * @param {() => string|null} options.getToken
 * @param {(event: string, data: any) => void} options.onEvent
 * @param {(status: 'connecting'|'open'|'reconnecting'|'offline'|'closed') => void} [options.onStatus]
 * @param {() => void} [options.onUnauthorized]
 */
export function createRealtimeClient({ getToken, onEvent, onStatus, onUnauthorized }) {
  let controller = null;
  let stopped = true;
  let attempt = 0;
  let reconnectTimer = null;
  let watchdogTimer = null;

  const setStatus = (status) => onStatus?.(status);

  const clearTimers = () => {
    clearTimeout(reconnectTimer);
    clearTimeout(watchdogTimer);
    reconnectTimer = null;
    watchdogTimer = null;
  };

  const armWatchdog = () => {
    clearTimeout(watchdogTimer);
    watchdogTimer = setTimeout(() => {
      // No bytes (not even a heartbeat) for too long → connection is dead.
      controller?.abort();
    }, WATCHDOG_TIMEOUT_MS);
  };

  const scheduleReconnect = () => {
    if (stopped) return;
    clearTimers();
    const backoff = Math.min(MAX_BACKOFF_MS, MIN_BACKOFF_MS * 2 ** attempt);
    const delay = backoff / 2 + Math.random() * (backoff / 2);
    attempt += 1;
    setStatus(typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'reconnecting');
    reconnectTimer = setTimeout(connect, delay);
  };

  async function connect() {
    if (stopped) return;
    const token = getToken();
    if (!token) {
      stop();
      return;
    }

    controller?.abort();
    controller = new AbortController();
    setStatus(attempt === 0 ? 'connecting' : 'reconnecting');

    try {
      const response = await fetch(STREAM_URL, {
        method: 'GET',
        headers: {
          Accept: 'text/event-stream',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
        signal: controller.signal,
      });

      if (response.status === 401 || response.status === 403) {
        stop();
        onUnauthorized?.();
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error(`Realtime stream failed with status ${response.status}`);
      }

      attempt = 0;
      setStatus('open');
      armWatchdog();

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        armWatchdog();
        buffer += decoder.decode(value, { stream: true });

        const blocks = buffer.split(/\r?\n\r?\n/);
        buffer = blocks.pop() || '';
        blocks.forEach((block) => {
          const parsed = parseEventBlock(block);
          if (parsed) onEvent(parsed.event, parsed.data);
        });
      }
    } catch {
      if (stopped) return;
      // AbortError from watchdog or network failure → fall through to reconnect.
    }

    scheduleReconnect();
  }

  const handleVisibility = () => {
    if (document.visibilityState === 'visible' && !stopped && reconnectTimer) {
      attempt = 0;
      clearTimers();
      connect();
    }
  };

  const handleOnline = () => {
    if (!stopped) {
      attempt = 0;
      clearTimers();
      connect();
    }
  };

  const handleOffline = () => setStatus('offline');

  function start() {
    if (!stopped) return;
    stopped = false;
    attempt = 0;
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    connect();
  }

  function stop() {
    stopped = true;
    clearTimers();
    controller?.abort();
    controller = null;
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    setStatus('closed');
  }

  return { start, stop };
}
