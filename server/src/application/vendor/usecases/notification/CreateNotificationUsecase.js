import { Notification } from "../../../../domain/entities/Notification.js";

export class CreateNotificationUsecase {
  constructor(notificationRepository) {
    this._notificationRepository = notificationRepository;
  }

  async execute({
    userId,

    title,

    message,
  }) {
    const notification = new Notification({
      userId,

      title,

      message,
    });

    return await this._notificationRepository.create(notification);
  }
}
