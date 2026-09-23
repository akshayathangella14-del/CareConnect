import { apiSlice } from '@/api/apiSlice';

/**
 * Analytics API — RTK Query endpoints.
 *
 * Backend contract:
 *   GET    /analytics/summary             → get platform summary
 */
export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query({
      query: () => '/analytics/summary',
      transformResponse: (response) => response?.data || response,
      // No specific tags provided as analytics might aggregate over many things
    }),
  }),
});

export const {
  useGetAnalyticsSummaryQuery,
} = analyticsApi;
