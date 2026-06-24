import NotificationModel from "../database/models/Notification.model.js";
import { NotificationMapper } from "../../application/mapper/Notification.mapper.js";
import { NotificationRepository } from "../../domain/repositories/INotification.repository.js";

export class NotificationRepositoryImpl extends NotificationRepository {

    async create(notification) {

        const doc =
            await NotificationModel.create(
                NotificationMapper.mapToPersistence(notification)
            )

        return NotificationMapper.mapToEntity(doc)
    }

    async findByUserId(userId) {

        const docs =
            await NotificationModel
                .find({
                    userId
                })

                .sort({
                    createdAt: -1
                })

        return docs.map(doc =>

            NotificationMapper.mapToEntity(doc)

        )

    }

    async markAsRead(id) {

        const doc =
            await NotificationModel.findByIdAndUpdate(
                id,
                {
                    isRead: true
                },

                {
                    new: true
                }
            )

        return NotificationMapper.mapToEntity(doc)

    }

}