import { baseApi } from '../../api/baseApi';

export const aiApi = baseApi.injectEndpoints({
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
