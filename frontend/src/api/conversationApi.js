import { baseApi } from '../redux/api/baseApi';

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => '/conversations',
      providesTags: ['Conversation'],
      transformResponse: (response) => response?.data ?? response,
    }),
    findOrCreateConversation: builder.mutation({
      query: (body) => ({
        url: '/conversations/find-or-create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversation'],
      transformResponse: (response) => response?.data ?? response,
    }),
    getMessages: builder.query({
      query: ({ conversationId, cursor, limit = 20 }) => ({
        url: `/conversations/${conversationId}/messages`,
        params: { cursor, limit },
      }),
      providesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
      ],
      transformResponse: (response) => response?.data ?? response,
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useFindOrCreateConversationMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
} = conversationApi;
