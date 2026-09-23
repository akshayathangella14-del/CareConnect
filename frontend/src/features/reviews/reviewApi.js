import { apiSlice } from '@/api/apiSlice';

/**
 * Review API — RTK Query endpoints.
 *
 * Backend contract:
 *   POST   /reviews                       → create
 *   GET    /reviews                       → list
 */
export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review', 'Provider'], // Also invalidate provider to update rating summary
    }),

    listReviews: builder.query({
      query: (params) => ({
        url: '/reviews',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.reviews || response?.reviews || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Review', id: _id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useListReviewsQuery,
} = reviewApi;
