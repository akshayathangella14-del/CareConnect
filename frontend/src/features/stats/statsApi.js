import { apiSlice } from '@/api/apiSlice';

export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformStats: builder.query({
      query: () => '/stats',
      transformResponse: (response) =>
        response?.data?.stats ||
        response?.stats ||
        response?.data ||
        response || {
          totalRequests: 0,
          activeBookings: 0,
          completedBookings: 0,
          totalProviders: 0,
          totalCustomers: 0,
          averageRating: 0,
          reviewCount: 0,
        },
    }),
  }),
});

export const { useGetPlatformStatsQuery } = statsApi;
