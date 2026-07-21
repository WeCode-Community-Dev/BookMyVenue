import { baseApi } from '../../redux/api/baseApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
    }),
  }),
});

export const { useMarkAllNotificationsReadMutation } = notificationApi;
