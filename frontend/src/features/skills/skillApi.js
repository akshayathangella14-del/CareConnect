import { apiSlice } from '@/api/apiSlice';

export const skillApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listSkills: builder.query({
      query: (params) => ({
        url: '/skills',
        params,
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        return response?.data?.skills || response?.skills || [];
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: 'Skill', id: _id })),
              { type: 'Skill', id: 'LIST' },
            ]
          : [{ type: 'Skill', id: 'LIST' }],
    }),
  }),
});

export const { useListSkillsQuery } = skillApi;
