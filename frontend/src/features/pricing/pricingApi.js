import { apiSlice } from '@/api/apiSlice';

export const pricingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPricingRules: builder.query({
      query: (params) => ({
        url: '/pricing',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.pricingRules || response?.pricingRules || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'PricingRule', id: _id })),
              { type: 'PricingRule', id: 'LIST' },
            ]
          : [{ type: 'PricingRule', id: 'LIST' }],
    }),

    getPricingRule: builder.query({
      query: (id) => `/pricing/${id}`,
      transformResponse: (response) => response?.data?.pricingRule || response?.pricingRule || response,
      providesTags: (result, error, id) => [{ type: 'PricingRule', id }],
    }),

    createPricingRule: builder.mutation({
      query: (data) => ({
        url: '/pricing',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'PricingRule', id: 'LIST' }],
    }),

    updatePricingRule: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/pricing/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PricingRule', id },
        { type: 'PricingRule', id: 'LIST' },
      ],
    }),

    deletePricingRule: builder.mutation({
      query: (id) => ({
        url: `/pricing/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'PricingRule', id: 'LIST' }],
    }),
  }),
});

export const {
  useListPricingRulesQuery,
  useGetPricingRuleQuery,
  useCreatePricingRuleMutation,
  useUpdatePricingRuleMutation,
  useDeletePricingRuleMutation,
} = pricingApi;
