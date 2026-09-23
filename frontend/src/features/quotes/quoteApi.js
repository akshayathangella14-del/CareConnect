import { apiSlice } from '@/api/apiSlice';

/**
 * Quote API — RTK Query endpoints.
 *
 * Backend contract:
 *   GET    /quotes/:id                    → get
 *   PATCH  /quotes/:id                    → update draft
 *   POST   /quotes/:id/submit             → submit to customer
 *   POST   /quotes/:id/accept             → customer accepts
 *   POST   /quotes/:id/reject             → customer rejects
 *   POST   /quotes/:id/request-changes    → customer requests changes
 */
export const quoteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuote: builder.query({
      query: (id) => `/quotes/${id}`,
      transformResponse: (response) => response?.data?.quote || response?.quote || response,
      providesTags: (result, error, id) => [{ type: 'Quote', id }],
    }),

    updateQuote: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/quotes/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response) => response?.data?.quote || response?.quote || response,
      invalidatesTags: (result, error, { id }) => [{ type: 'Quote', id }],
    }),

    submitQuote: builder.mutation({
      query: (id) => ({
        url: `/quotes/${id}/submit`,
        method: 'POST',
      }),
      transformResponse: (response) => response?.data?.quote || response?.quote || response,
      invalidatesTags: (result, error, id) => [
        { type: 'Quote', id },
        { type: 'Quote', id: 'LIST' },
      ],
    }),

    acceptQuote: builder.mutation({
      query: (id) => ({
        url: `/quotes/${id}/accept`,
        method: 'POST',
      }),
      transformResponse: (response) => ({
        quote: response?.data?.quote || response?.quote,
        booking: response?.data?.booking || response?.booking,
        raw: response,
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Quote', id },
        { type: 'Quote', id: 'LIST' },
        { type: 'Booking', id: 'LIST' },
        { type: 'ServiceRequest', id: 'LIST' },
      ],
    }),

    rejectQuote: builder.mutation({
      query: (id) => ({
        url: `/quotes/${id}/reject`,
        method: 'POST',
      }),
      transformResponse: (response) => response?.data?.quote || response?.quote || response,
      invalidatesTags: (result, error, id) => [
        { type: 'Quote', id },
        { type: 'Quote', id: 'LIST' },
      ],
    }),

    requestQuoteChanges: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/quotes/${id}/request-changes`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => response?.data?.quote || response?.quote || response,
      invalidatesTags: (result, error, { id }) => [{ type: 'Quote', id }],
    }),
  }),
});

export const {
  useGetQuoteQuery,
  useUpdateQuoteMutation,
  useSubmitQuoteMutation,
  useAcceptQuoteMutation,
  useRejectQuoteMutation,
  useRequestQuoteChangesMutation,
} = quoteApi;
