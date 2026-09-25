import { apiSlice } from '@/api/apiSlice';

/**
 * Auth API — RTK Query endpoints for CareConnect authentication.
 *
 * Backend contract:
 *   POST /auth/register  { name, email, password, phone?, role }  →  { token, user, providerProfile? }
 *   POST /auth/login     { email, password }                      →  { token, user }
 *   GET  /auth/me         Bearer token                            →  { user }
 *   POST /auth/logout     Bearer token                            →  { success }
 */
const unwrapAuthData = (response) => {
  if (response?.data && typeof response.data === 'object') {
    return response.data;
  }
  return response;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: unwrapAuthData,
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: unwrapAuthData,
    }),

    getMe: builder.query({
      query: () => '/auth/me',
      transformResponse: unwrapAuthData,
    }),

    updateMe: builder.mutation({
      query: (updates) => ({
        url: '/auth/me',
        method: 'PATCH',
        body: updates,
      }),
      transformResponse: unwrapAuthData,
      invalidatesTags: ['User'],
    }),

    updateProfileImage: builder.mutation({
      query: (formData) => ({
        url: '/auth/me/profile-image',
        method: 'POST',
        body: formData,
      }),
      transformResponse: unwrapAuthData,
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateProfileImageMutation,
  useLogoutMutation,
} = authApi;
