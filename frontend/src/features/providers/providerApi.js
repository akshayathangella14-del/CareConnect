import { apiSlice } from '@/api/apiSlice';

/**
 * Provider API — RTK Query endpoints.
 *
 * Backend contract:
 *   GET    /providers                     → list
 *   GET    /providers/me                  → get own profile
 *   PATCH  /providers/me                  → update own profile
 *   GET    /providers/:id                 → get single
 *   POST   /providers/:id/verification    → operations: verify provider
 */
export const providerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listProviders: builder.query({
      query: (params) => ({
        url: '/providers',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.providers || response?.providers || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Provider', id: _id })),
              { type: 'Provider', id: 'LIST' },
            ]
          : [{ type: 'Provider', id: 'LIST' }],
    }),

    getMeProvider: builder.query({
      query: () => '/providers/me',
      transformResponse: (response) => response?.data?.provider || response?.provider || response,
      providesTags: ['Provider'],
    }),

    updateMeProvider: builder.mutation({
      query: (data) => ({
        url: '/providers/me',
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response) => response?.data?.provider || response?.provider || response,
      invalidatesTags: ['Provider'],
    }),

    getProvider: builder.query({
      query: (id) => `/providers/${id}`,
      transformResponse: (response) => response?.data?.provider || response?.provider || response,
      providesTags: (result, error, id) => [{ type: 'Provider', id }],
    }),

    verifyProvider: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/providers/${id}/verification`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Provider', id },
        { type: 'Provider', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListProvidersQuery,
  useGetMeProviderQuery,
  useUpdateMeProviderMutation,
  useGetProviderQuery,
  useVerifyProviderMutation,
} = providerApi;
