import db from '../db/index.js';
import { conversationsTable, messagesTable } from '../models/index.js';
import { usersTable } from '../models/userModel.js';
import { eq, and, desc, lt } from 'drizzle-orm';
import { getClients } from '../utils/wsClient.js';

export default {
  findOrCreate: async function (userId, ownerId) {
    const [existing] = await db
      .select()
      .from(conversationsTable)
      .where(
        and(
          eq(conversationsTable.userId, userId),
          eq(conversationsTable.ownerId, ownerId)
        )
      );

    if (existing) return existing;

    const [newConversation] = await db
      .insert(conversationsTable)
      .values({ userId, ownerId })
      .returning();

    return newConversation;
  },

  getMessages: async function (conversationId, cursor, limit = 20) {
    const query = db
      .select()
      .from(messagesTable)
      .where(
        cursor
          ? and(
              eq(messagesTable.conversationId, conversationId),
              lt(messagesTable.createdAt, new Date(cursor))
            )
          : eq(messagesTable.conversationId, conversationId)
      )
      .orderBy(desc(messagesTable.createdAt))
      .limit(limit);

    const messages = await query;
    return messages.reverse(); // oldest first for UI rendering
  },

  sendMessage: async function (conversationId, senderId, content, venueId = null) {
    // 1. persist to DB first — source of truth
    const [message] = await db
      .insert(messagesTable)
      .values({ conversationId, senderId, content, venueId })
      .returning();

    // 2. update lastMessageAt on conversation
    await db
      .update(conversationsTable)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversationsTable.id, conversationId));

    // 3. get the conversation to find the recipient
    const [conversation] = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, conversationId));

    // 4. recipient is whoever isn't the sender
    const recipientId = conversation.userId === senderId
      ? conversation.ownerId
      : conversation.userId;

    // 5. push to recipient and sender via WS if online
    const wsPayload = JSON.stringify({
      type: 'NEW_MESSAGE',
      payload: message,
    });

    const pushToUser = (userId) => {
      const sockets = getClients(userId);
      sockets.forEach((ws) => {
        if (ws.readyState === 1) {
          ws.send(wsPayload);
        }
      });
    };

    pushToUser(recipientId);
    pushToUser(senderId);

    return message;
  },

  getConversations: async function (userId, role) {
    const conversations = await db
      .select()
      .from(conversationsTable)
      .where(
        role === 'owner'
          ? eq(conversationsTable.ownerId, userId)
          : eq(conversationsTable.userId, userId)
      )
      .orderBy(desc(conversationsTable.lastMessageAt));

    if (!conversations.length) return [];

    return Promise.all(
      conversations.map(async (conversation) => {
        const otherUserId =
          role === 'owner' ? conversation.userId : conversation.ownerId;

        const [otherParticipant] = await db
          .select({ id: usersTable.id, username: usersTable.username })
          .from(usersTable)
          .where(eq(usersTable.id, otherUserId));

        const [lastMessage] = await db
          .select({
            content: messagesTable.content,
            createdAt: messagesTable.createdAt,
          })
          .from(messagesTable)
          .where(eq(messagesTable.conversationId, conversation.id))
          .orderBy(desc(messagesTable.createdAt))
          .limit(1);

        return {
          ...conversation,
          otherParticipant: otherParticipant || null,
          lastMessage: lastMessage || null,
        };
      })
    );
  },
};