import { apiSlice } from '@/api/apiSlice';

/**
 * Category API — RTK Query endpoints.
 *
 * Backend contract:
 *   GET    /categories                    → list
 *   GET    /categories/:id                → get single
 *   POST   /categories                    → create (admin)
 *   PATCH  /categories/:id                → update (admin)
 *   DELETE /categories/:id                → remove (admin)
 */
export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query({
      query: () => '/categories',
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return response;
        }
        return response?.data?.categories || response?.categories || response?.data || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Category', id: _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    getCategory: builder.query({
      query: (id) => `/categories/${id}`,
      transformResponse: (response) => response?.data?.category || response?.category || response,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    removeCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useRemoveCategoryMutation,
} = categoryApi;
