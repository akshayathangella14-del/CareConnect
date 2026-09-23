import { apiSlice } from '@/api/apiSlice';

/**
 * Dispute API — RTK Query endpoints.
 *
 * Backend contract:
 *   POST   /disputes                      → create
 *   GET    /disputes                      → list
 *   GET    /disputes/:id                  → get single
 *   PATCH  /disputes/:id                  → update/resolve
 */
export const disputeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDispute: builder.mutation({
      query: (data) => ({
        url: '/disputes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Dispute'],
    }),

    listDisputes: builder.query({
      query: (params) => ({
        url: '/disputes',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.disputes || response?.disputes || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Dispute', id: _id })),
              { type: 'Dispute', id: 'LIST' },
            ]
          : [{ type: 'Dispute', id: 'LIST' }],
    }),

    getDispute: builder.query({
      query: (id) => `/disputes/${id}`,
      transformResponse: (response) => response?.data?.dispute || response?.dispute || response,
      providesTags: (result, error, id) => [{ type: 'Dispute', id }],
    }),

    updateDispute: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/disputes/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Dispute', id },
        { type: 'Dispute', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateDisputeMutation,
  useListDisputesQuery,
  useGetDisputeQuery,
  useUpdateDisputeMutation,
} = disputeApi;
