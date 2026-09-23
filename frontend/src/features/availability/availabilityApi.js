import { apiSlice } from '@/api/apiSlice';

/**
 * Availability API — RTK Query endpoints.
 *
 * Backend contract:
 *   POST   /availability                  → create
 *   GET    /availability                  → list
 *   PATCH  /availability/:id              → update
 *   DELETE /availability/:id              → remove
 */
export const availabilityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAvailability: builder.mutation({
      query: (data) => ({
        url: '/availability',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Availability'],
    }),

    listAvailability: builder.query({
      query: (params) => ({
        url: '/availability',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.availabilitySlots || response?.availabilitySlots || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Availability', id: _id })),
              { type: 'Availability', id: 'LIST' },
            ]
          : [{ type: 'Availability', id: 'LIST' }],
    }),

    updateAvailability: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/availability/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Availability', id },
        { type: 'Availability', id: 'LIST' },
      ],
    }),

    removeAvailability: builder.mutation({
      query: (id) => ({
        url: `/availability/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Availability', id },
        { type: 'Availability', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateAvailabilityMutation,
  useListAvailabilityQuery,
  useUpdateAvailabilityMutation,
  useRemoveAvailabilityMutation,
} = availabilityApi;
