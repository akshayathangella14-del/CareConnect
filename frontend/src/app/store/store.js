import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/api/apiSlice';
import { authReducer } from '@/features/auth';

/**
 * CareConnect Redux Store
 *
 * Configured with:
 * - Auth reducer for authentication state
 * - RTK Query middleware for API caching and lifecycle
 * - API reducer for RTK Query state
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.DEV,
});
