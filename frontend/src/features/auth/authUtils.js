/**
 * Helpers for CareConnect auth API envelopes and error payloads.
 */

export function extractAuthSession(result) {
  const payload =
    result?.data && (result.data.token || result.data.user)
      ? result.data
      : result;

  return {
    token: payload?.token || null,
    user: payload?.user || null,
  };
}

export function flattenFieldErrors(details) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    return {};
  }

  const next = {};
  Object.entries(details).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim()) {
      next[key] = value;
    } else if (value && typeof value.message === 'string') {
      next[key] = value.message;
    }
  });
  return next;
}

export function getAuthErrorMessage(err, fallback) {
  if (err?.status === 'FETCH_ERROR' || err?.status === 'TIMEOUT_ERROR') {
    return 'Cannot reach the CareConnect API. Start the backend and try again.';
  }

  if (err?.status === 'PARSING_ERROR') {
    return 'The server returned an unexpected response. Check that the API is running.';
  }

  const data = err?.data;
  const message =
    data?.error?.message ||
    data?.message ||
    (typeof data?.error === 'string' ? data.error : null);

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  if (typeof err?.error === 'string' && err.error.trim() && err.status !== 'CUSTOM_ERROR') {
    if (err.error.startsWith('TypeError') || err.error.includes('Failed to fetch')) {
      return 'Cannot reach the CareConnect API. Start the backend and try again.';
    }
  }

  return fallback;
}
