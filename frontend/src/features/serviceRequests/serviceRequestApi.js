import { apiSlice } from '@/api/apiSlice';

/**
 * Service Request API — RTK Query endpoints.
 *
 * Backend contract:
 *   POST   /service-requests                          → create
 *   GET    /service-requests                          → list (filtered by role)
 *   GET    /service-requests/:id                      → get single
 *   PATCH  /service-requests/:id                      → update draft
 *   POST   /service-requests/:id/submit               → submit for AI review
 *   POST   /service-requests/:id/cancel               → cancel
 *   PATCH  /service-requests/:id/ai-understanding     → correct AI understanding
 *   GET    /service-requests/:id/matches              → get matched providers
 *   POST   /service-requests/:id/quotes               → create quote for request
 *   GET    /service-requests/:id/quotes               → list quotes for request
 */
export const serviceRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createServiceRequest: builder.mutation({
      query: (data) => ({
        url: '/service-requests',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => response?.data?.serviceRequest || response?.serviceRequest || response,
      invalidatesTags: [{ type: 'ServiceRequest', id: 'LIST' }],
    }),

    listServiceRequests: builder.query({
      query: (params) => ({
        url: '/service-requests',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.serviceRequests || response?.serviceRequests || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'ServiceRequest', id: _id })),
              { type: 'ServiceRequest', id: 'LIST' },
            ]
          : [{ type: 'ServiceRequest', id: 'LIST' }],
    }),

    getServiceRequest: builder.query({
      query: (id) => `/service-requests/${id}`,
      transformResponse: (response) => response?.data?.serviceRequest || response?.serviceRequest || response,
      providesTags: (result, error, id) => [{ type: 'ServiceRequest', id }],
    }),

    updateServiceRequest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/service-requests/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response) => response?.data?.serviceRequest || response?.serviceRequest || response,
      invalidatesTags: (result, error, { id }) => [{ type: 'ServiceRequest', id }],
    }),

    submitServiceRequest: builder.mutation({
      query: (id) => ({
        url: `/service-requests/${id}/submit`,
        method: 'POST',
      }),
      transformResponse: (response) => response?.data?.serviceRequest || response?.serviceRequest || response,
      invalidatesTags: (result, error, id) => [
        { type: 'ServiceRequest', id },
        { type: 'ServiceRequest', id: 'LIST' },
      ],
    }),

    cancelServiceRequest: builder.mutation({
      query: (id) => ({
        url: `/service-requests/${id}/cancel`,
        method: 'POST',
      }),
      transformResponse: (response) => response?.data?.serviceRequest || response?.serviceRequest || response,
      invalidatesTags: (result, error, id) => [
        { type: 'ServiceRequest', id },
        { type: 'ServiceRequest', id: 'LIST' },
      ],
    }),

    correctAiUnderstanding: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/service-requests/${id}/ai-understanding`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response) => response?.data?.serviceRequest || response?.serviceRequest || response,
      invalidatesTags: (result, error, { id }) => [{ type: 'ServiceRequest', id }],
    }),

    getMatches: builder.query({
      query: (id) => `/service-requests/${id}/matches`,
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.matches || response?.matches || [];
      },
      providesTags: (result, error, id) => [{ type: 'Provider', id: `matches-${id}` }],
    }),

    createQuoteForRequest: builder.mutation({
      query: ({ requestId, ...data }) => ({
        url: `/quotes/requests/${requestId}`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => response?.data?.quote || response?.quote || response,
      invalidatesTags: (result, error, { requestId }) => [
        { type: 'Quote', id: 'LIST' },
        { type: 'Quote', id: `request-${requestId}` },
        { type: 'ServiceRequest', id: requestId },
      ],
    }),

    listQuotesForRequest: builder.query({
      query: (requestId) => `/service-requests/${requestId}/quotes`,
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.quotes || response?.quotes || [];
      },
      providesTags: (result, error, requestId) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Quote', id: _id })),
              { type: 'Quote', id: `request-${requestId}` },
            ]
          : [{ type: 'Quote', id: `request-${requestId}` }],
    }),
  }),
});

export const {
  useCreateServiceRequestMutation,
  useListServiceRequestsQuery,
  useGetServiceRequestQuery,
  useUpdateServiceRequestMutation,
  useSubmitServiceRequestMutation,
  useCancelServiceRequestMutation,
  useCorrectAiUnderstandingMutation,
  useGetMatchesQuery,
  useCreateQuoteForRequestMutation,
  useListQuotesForRequestQuery,
} = serviceRequestApi;
