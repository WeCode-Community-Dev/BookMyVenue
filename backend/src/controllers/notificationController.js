import { addClient, removeClient } from '../utils/sseClient.js';
import notificationService from '../services/notificationService.js';
import { sendResponse } from '../handlers/response_handlers.js';

export default {
  setStream: async function (req, res) {
    console.log('SSE connection attempt', req.user)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
     res.flushHeaders()
    addClient(req.user.id, res);
    // query unread notifications for this user
    // write each one to res
    const  unReadNotifications = await notificationService.getNotifications(req.user.id);

    unReadNotifications.forEach(r=> res.write(`data: ${JSON.stringify(r)}\n\n`))

    req.on('close', () => removeClient(req.user.id, res));
  },

  markAllRead: async function (req, res) {
    await notificationService.markAllAsRead(req.user.id);
    sendResponse(res,{statusCode:204})
  },
};
