import { apiSlice } from '@/api/apiSlice';

/**
 * Notification API — RTK Query endpoints.
 *
 * Backend contract:
 *   GET    /notifications                 → list
 *   PATCH  /notifications/read-all        → mark all read
 *   PATCH  /notifications/:id/read        → mark single read
 */
export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.notifications || response?.notifications || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Notification', id: _id })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    markNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Notification', id }],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} = notificationApi;
