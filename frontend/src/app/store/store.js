import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/api/apiSlice';
import { authReducer } from '@/features/auth';
import realtimeReducer from '@/realtime/realtimeSlice';

/**
 * CareConnect Redux Store
 *
 * Configured with:
 * - Auth reducer for authentication state
 * - RTK Query middleware for API caching and lifecycle
 * - API reducer for RTK Query state
 * - Realtime reducer for SSE state
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    realtime: realtimeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.DEV,
});
