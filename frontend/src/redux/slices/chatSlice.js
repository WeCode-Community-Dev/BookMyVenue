import { createSlice } from '@reduxjs/toolkit';

const sortByCreatedAt = (messages) =>
  [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

const initialState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  unreadCounts: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const { conversationId } = message;


 // Guard: if this conversation has no messages array yet in Redux,
  // initialize it — otherwise .findIndex() would throw on undefined
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      const existing = state.messages[conversationId];


  // ── Case 1: Duplicate prevention ──────────────────────────────────
  // Check if a message with this server id already exists in Redux.
  // This handles reconnect/refresh scenarios where the same message
  // can arrive both from GET /messages (history load) and WS push.
      const byIdIndex = existing.findIndex((m) => m.id === message.id);
      if (byIdIndex >= 0) {
        existing[byIdIndex] = { ...existing[byIdIndex], ...message };
        state.messages[conversationId] = sortByCreatedAt(existing);
        return;
      }  //updates duplicates on reconnection or refresh


        // ── Case 2: Optimistic update reconciliation ───────────────────────
  // When the user sends a message, frontend immediately adds a temp
  // message with a client-generated tempId and status: 'sending'.
  // When the server confirms and echoes back the real message via WS,
  // we need to find that temp message and replace it with the real one.
  // We can't match by tempId because the server never knew about it,
  // so we match by content + senderId + conversationId instead.

      const tempIndex = existing.findIndex(    
        (m) =>
           // must have a tempId — filters out real messages (real messages have id, not tempId)
          m.tempId &&
            // must belong to the same conversation
          m.conversationId === message.conversationId &&
           // must have the same content — this is how we match which temp message the server is confirming
          m.content === message.content &&
           // must be from the same sender — prevents matching another user's message with same content
          m.senderId === message.senderId &&
            // must still be in-flight — if already delivered/failed, don't touch it
          (m.status === 'sending' || m.status === 'sent')
      );

      if (tempIndex >= 0) {
          // Found the temp message — replace it with the real server message.
    // Status becomes 'delivered' meaning DB has confirmed it.
        existing[tempIndex] = { ...message, status: 'delivered' };
      } else {
         // No temp message found — this is an incoming message from the other person.
    // They have no temp message on our side, just push it directly.
        existing.push(message);
      }


  // Always re-sort by server createdAt after any mutation —
  // ensures order is always server-driven, never client-clock-driven.
      state.messages[conversationId] = sortByCreatedAt(existing);



  // Update lastMessageAt on the conversation object in Redux so the
  // conversation list re-sorts and the most recently active thread
  // bubbles to the top — same behaviour as WhatsApp/iMessage.
      const convIndex = state.conversations.findIndex((c) => c.id === conversationId);
      if (convIndex >= 0) {
        state.conversations[convIndex].lastMessageAt = message.createdAt;
      }


    },
    setMessages: (state, action) => {
      const { conversationId, messages, prepend = false } = action.payload;
        // Get existing messages for this conversation, or empty array if none loaded yet
      const existing = state.messages[conversationId] || [];

      if (prepend) {
         // ── Infinite scroll upward (loading older messages) ────────────────
    // User scrolled to top — merge older messages with what's already in Redux.
    // We can't replace (prepend: false) because that would wipe out the
    // messages the user is currently reading in the chat window.
    // older messages go first in the spread so sort corrects the order.
        const merged = [...messages, ...existing];
          // Deduplicate after merge — two scenarios cause duplicates:
    // 1. Reconnect: frontend re-fetches history to catch up, overlaps with existing
    // 2. Race condition: WS pushes a message at the same time as a history fetch
    // Filter keeps only the first occurrence of each message.
        const unique = merged.filter(
          (msg, idx, arr) => arr.findIndex((m) => m.id === msg.id ||   // real messages — match by server id
           (m.tempId && m.tempId === msg.tempId)) === idx    // can't just use m.id === msg.id for temp messages because
           // all temp messages have id: null — null === null would incorrectly
           // deduplicate two different in-flight messages
        );
          // Always sort by server createdAt — never trust client timestamps for ordering
        state.messages[conversationId] = sortByCreatedAt(unique);
      } else {
        state.messages[conversationId] = sortByCreatedAt(messages);
      }
    },
    updateMessageStatus: (state, action) => {
      const { conversationId, tempId, status } = action.payload;
       // Guard: if no messages loaded for this conversation yet, nothing to update
      const messages = state.messages[conversationId];
      if (!messages) return;

        // Find by tempId — not by id, because failure means the message never
  // reached the server so the DB never assigned a real id.
  // tempId is the only identifier that exists at this point.

      const index = messages.findIndex((m) => m.tempId === tempId);
      if (index >= 0) {
         // Just flip the status — don't replace the whole message object.
    // UI reads this status to show "failed — tap to retry" on that message.
        messages[index].status = status;
      }
    },
    incrementUnread: (state, action) => {
       // Increment unread count for this conversation by 1.
  // Called when a NEW_MESSAGE arrives via WS but that conversation
  // is not currently open (user is in a different conversation or page).
  // If no count exists yet for this conversation, start from 0 then add 1.
      const conversationId = action.payload;
      state.unreadCounts[conversationId] = (state.unreadCounts[conversationId] || 0) + 1;
    },
    clearUnread: (state, action) => {
       // Reset unread count to 0 for this conversation.
  // Called when user clicks on a conversation and opens it —
  // they've now seen the messages so the badge should disappear.
      const conversationId = action.payload;
      state.unreadCounts[conversationId] = 0;
    },
  },
});

export const {
  setConversations,
  setActiveConversation,
  addMessage,
  setMessages,
  updateMessageStatus,
  incrementUnread,
  clearUnread,
} = chatSlice.actions;

export default chatSlice.reducer;

export const selectConversations = (state) => state.chat.conversations;
// Returns the currently open conversation id — used by ChatWindow
// to know which messages to display
export const selectActiveConversationId = (state) => state.chat.activeConversationId;
export const selectMessages = (state, conversationId) =>
  state.chat.messages[conversationId] || [];
export const selectUnreadCount = (state, conversationId) =>
  state.chat.unreadCounts[conversationId] || 0;
export const selectAllUnreadCounts = (state) => state.chat.unreadCounts;
// Returns total unread across ALL conversations — used for the
// nav badge ("Messages 5") showing combined unread count in the navbar
export const selectTotalUnreadCount = (state) =>
  Object.values(state.chat.unreadCounts).reduce((sum, count) => sum + count, 0);
