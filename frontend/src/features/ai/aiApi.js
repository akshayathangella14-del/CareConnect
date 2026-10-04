import { apiSlice } from '@/api/apiSlice';

export const aiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    askConcierge: builder.mutation({
      query: (data) => ({
        url: '/ai/concierge',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useAskConciergeMutation } = aiApi;
