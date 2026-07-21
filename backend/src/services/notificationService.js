import db from '../db/index.js';
import { notificationsTable } from '../models/notificationModel.js';
import { getClients } from '../utils/sseClient.js';
import {and,eq} from 'drizzle-orm';

export default {
  createNotification: async function ({ recipientId, type, payload }) {
    const [notification] = await db
      .insert(notificationsTable)
      .values({
        recipientId,
        type,
        payload,
      })
      .returning();

    const connections = getClients(recipientId);
    if(connections) {
      //  Push to every open tab simultaneously.
      // SSE wire format is strict — must be "data: <json>\n\n"
      // The double newline signals end of message to the browser's EventSource.
      // We send the full notification object (id, type, payload, createdAt)
      // so the frontend can append it to the list without a separate fetch.
      connections.forEach(r => r.write(`data: ${JSON.stringify(notification)}\n\n`))
    }
    return notification;
  },

  getNotifications: async function (userId) {
    const notifications = await db.query.notificationsTable.findMany({
      where: and(eq(notificationsTable.recipientId, userId), eq(notificationsTable.isRead, false)),
    });
    return notifications;
  },

  markAllAsRead: async function (userId) {
    await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(
        and(
          eq(notificationsTable.recipientId, userId),
          eq(notificationsTable.isRead, false)
        )
      );
  },
};
