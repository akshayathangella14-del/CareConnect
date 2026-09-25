import { apiSlice } from '@/api/apiSlice';

/**
 * Booking API — RTK Query endpoints.
 *
 * Backend contract:
 *   GET    /bookings                                       → list
 *   GET    /bookings/:id                                   → get
 *   POST   /bookings/:id/confirm                           → transition
 *   POST   /bookings/:id/en-route                          → transition
 *   POST   /bookings/:id/arrived                           → transition
 *   POST   /bookings/:id/start                             → transition
 *   POST   /bookings/:id/request-completion                → transition
 *   POST   /bookings/:id/confirm-completion                → transition
 *   POST   /bookings/:id/cancel                            → cancel
 *   POST   /bookings/:id/evidence                          → add evidence
 *   POST   /bookings/:id/scope-changes                     → request scope change
 *   POST   /bookings/:id/scope-changes/:changeId/approve   → approve scope change
 *   POST   /bookings/:id/scope-changes/:changeId/reject    → reject scope change
 *   GET    /bookings/:id/service-trace                     → get service trace
 *   GET    /bookings/:id/proof-pack                        → get proof pack
 *   POST   /bookings/:id/invoice                           → create invoice
 */
export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listBookings: builder.query({
      query: (params) => ({
        url: '/bookings',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.bookings || response?.bookings || response?.data?.data?.bookings || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Booking', id: _id })),
              { type: 'Booking', id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),

    getBooking: builder.query({
      query: (id) => `/bookings/${id}`,
      transformResponse: (response) => response?.data?.booking || response?.booking || response,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    transitionBooking: builder.mutation({
      query: ({ id, action }) => ({
        url: `/bookings/${id}/${action}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
      ],
    }),

    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Booking', id },
        { type: 'Booking', id: 'LIST' },
      ],
    }),

    addEvidence: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/bookings/${id}/evidence`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }],
    }),

    requestScopeChange: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/bookings/${id}/scope-changes`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }],
    }),

    decideScopeChange: builder.mutation({
      query: ({ bookingId, changeId, decision }) => ({
        url: `/bookings/${bookingId}/scope-changes/${changeId}/${decision}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { bookingId }) => [{ type: 'Booking', id: bookingId }],
    }),

    getServiceTrace: builder.query({
      query: (id) => `/bookings/${id}/service-trace`,
      transformResponse: (response) => response?.data?.serviceTrace || response?.serviceTrace || [],
      providesTags: (result, error, id) => [{ type: 'Booking', id: `trace-${id}` }],
    }),

    getProofPack: builder.query({
      query: (id) => `/bookings/${id}/proof-pack`,
      transformResponse: (response) => response?.data?.proofPack || response?.proofPack || response,
      providesTags: (result, error, id) => [{ type: 'Booking', id: `proof-${id}` }],
    }),

    createInvoiceForBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/invoice`,
        method: 'POST',
      }),
      transformResponse: (response) => response?.data?.invoice || response?.invoice || response,
      invalidatesTags: (result, error, id) => [
        { type: 'Booking', id },
        { type: 'Invoice', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListBookingsQuery,
  useGetBookingQuery,
  useTransitionBookingMutation,
  useCancelBookingMutation,
  useAddEvidenceMutation,
  useRequestScopeChangeMutation,
  useDecideScopeChangeMutation,
  useGetServiceTraceQuery,
  useGetProofPackQuery,
  useCreateInvoiceForBookingMutation,
} = bookingApi;
