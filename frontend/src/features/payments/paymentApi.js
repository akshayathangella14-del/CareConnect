import { apiSlice } from '@/api/apiSlice';

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listPayments: builder.query({
      query: (params) => ({
        url: '/payments',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.payments || response?.payments || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Payment', id: _id })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),

    getPayment: builder.query({
      query: (id) => `/payments/${id}`,
      transformResponse: (response) => response?.data?.payment || response?.payment || response,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),

    createPayment: builder.mutation({
      query: (payment) => ({
        url: '/payments',
        method: 'POST',
        body: payment,
      }),
      transformResponse: (response) => response?.data?.payment || response?.payment || response,
      invalidatesTags: ['Payment', 'Invoice'],
    }),
  }),
});

export const {
  useListPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
} = paymentApi;
