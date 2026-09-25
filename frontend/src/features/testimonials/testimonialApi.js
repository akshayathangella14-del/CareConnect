import { apiSlice } from '@/api/apiSlice';

export const testimonialApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listTestimonials: builder.query({
      query: () => '/testimonials',
      transformResponse: (response) =>
        response?.data?.testimonials ||
        response?.testimonials ||
        response?.data?.reviews ||
        response?.reviews ||
        [],
    }),
  }),
});

export const { useListTestimonialsQuery } = testimonialApi;
