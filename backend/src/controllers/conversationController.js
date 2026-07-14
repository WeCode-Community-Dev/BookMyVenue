import conversationService from '../services/conversationService.js';
import { sendResponse } from '../handlers/response_handlers.js';
import { AppError } from '../handlers/error_handlers.js';

export default {
  findOrCreate: async function (req, res, next) {
    try {
      const { ownerId, userId: targetUserId } = req.body;
      const { id: requesterId, role } = req.user;

      let userId;
      let ownerIdFinal;

      if (role === 'owner') {
        if (!targetUserId) {
          throw new AppError({
            message: 'userId is required for owners',
            statusCode: 400,
          });
        }
        userId = targetUserId;
        ownerIdFinal = requesterId;
      } else {
        if (!ownerId) {
          throw new AppError({
            message: 'ownerId is required',
            statusCode: 400,
          });
        }
        userId = requesterId;
        ownerIdFinal = ownerId;
      }

      const conversation = await conversationService.findOrCreate(userId, ownerIdFinal);
      sendResponse(res, { data: conversation });
    } catch (err) {
      next(err);
    }
  },

  getMessages: async function (req, res, next) {
    try {
      const { id: conversationId } = req.params;
      const { cursor, limit } = req.query;
      const messages = await conversationService.getMessages(conversationId, cursor, limit);
      sendResponse(res, { data: messages });
    } catch (err) {
      next(err);
    }
  },

  getConversations: async function (req, res, next) {
    try {
      const { id: userId, role } = req.user;
      const conversations = await conversationService.getConversations(userId, role);
      sendResponse(res, { data: conversations });
    } catch (err) {
      next(err);
    }
  },
};
