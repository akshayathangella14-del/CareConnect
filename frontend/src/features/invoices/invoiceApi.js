import { apiSlice } from '@/api/apiSlice';

/**
 * Invoice API — RTK Query endpoints.
 *
 * Backend contract:
 *   GET    /invoices                      → list
 *   GET    /invoices/:id                  → get single
 *   PATCH  /invoices/:id                  → update (e.g., mark paid)
 */
export const invoiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listInvoices: builder.query({
      query: (params) => ({
        url: '/invoices',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.invoices || response?.invoices || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Invoice', id: _id })),
              { type: 'Invoice', id: 'LIST' },
            ]
          : [{ type: 'Invoice', id: 'LIST' }],
    }),

    getInvoice: builder.query({
      query: (id) => `/invoices/${id}`,
      transformResponse: (response) => response?.data?.invoice || response?.invoice || response,
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),

    updateInvoice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/invoices/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListInvoicesQuery,
  useGetInvoiceQuery,
  useUpdateInvoiceMutation,
} = invoiceApi;
