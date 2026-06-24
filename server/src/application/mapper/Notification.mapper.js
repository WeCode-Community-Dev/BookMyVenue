import { Notification } from "../../domain/entities/Notification.js";
import { Types } from 'mongoose'


export class NotificationMapper{

    static mapToEntity(doc) {

        if (!doc) return null

        return new Notification({

            id: doc._id?.toString(),

            userId: doc.userId ?.toString(),

            title: doc.title,

            message: doc.message,

            isRead: doc.isRead,

            createdAt: doc.createdAt,

            updatedAt: doc.updatedAt

        })

    }

    static mapToPersistence(entity) {

        return {

            userId: entity.userId ? new Types.ObjectId(entity.userId) : null,

            title: entity.title,

            message: entity.message,

            isRead: entity.isRead

        }

    }
}