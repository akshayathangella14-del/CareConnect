import { apiSlice } from '@/api/apiSlice';

/**
 * Audit API — RTK Query endpoints.
 *
 * Backend contract:
 *   GET    /audit-logs                    → list
 */
export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listAuditLogs: builder.query({
      query: (params) => ({
        url: '/audit-logs',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.auditLogs || response?.auditLogs || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'AuditLog', id: _id })),
              { type: 'AuditLog', id: 'LIST' },
            ]
          : [{ type: 'AuditLog', id: 'LIST' }],
    }),
  }),
});

export const {
  useListAuditLogsQuery,
} = auditApi;
