import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearCredentials } from '@/features/auth/authSlice';

/**
 * CareConnect Base API
 *
 * RTK Query API foundation. All feature endpoints are injected
 * via `apiSlice.injectEndpoints()`.
 *
 * Base URL is configured via VITE_API_BASE_URL (defaults to /api/v1).
 * Bearer token is automatically attached from Redux auth state.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 'FETCH_ERROR' || result.error?.status === 'TIMEOUT_ERROR') {
    return {
      ...result,
      error: {
        ...result.error,
        data: {
          error: {
            message: 'Cannot reach the CareConnect API. Start the backend and try again.',
          },
        },
      },
    };
  }

  if (result.error?.status === 401 && api.getState()?.auth?.token) {
    api.dispatch(clearCredentials());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'ServiceRequest',
    'Quote',
    'Booking',
    'Review',
    'Invoice',
    'Notification',
    'Provider',
    'Availability',
    'Category',
    'Skill',
    'PricingRule',
    'Dispute',
    'AuditLog',
  ],
  endpoints: () => ({}),
});
