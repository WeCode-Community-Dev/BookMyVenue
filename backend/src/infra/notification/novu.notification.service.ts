import { Novu } from "@novu/api";
import { NOTIFICATION_CONFIG } from "src/config/app.config";
import type { CreateSubscriberInput, INotificationService, NotificationResult, TriggerNotificationInput } from "src/core/domain/notification/notification.service.interface";


export class NovuNotificationService implements INotificationService {

    private readonly novu: Novu

    constructor() {
        this.novu = new Novu({
            secretKey: NOTIFICATION_CONFIG.NOVU_SECRET_KEY,
        });
    }

    async createSubscriber(
        input: CreateSubscriberInput,
    ): Promise<NotificationResult> {

        await this.novu.subscribers.create({

            subscriberId: input.subscriberId,

            email: input.email,

            firstName: input.firstName,

            lastName: input.lastName,

            phone: input.phone,

            avatar: input.avatar,

        });

        return {
            success: true,
        };
    }

    async updateSubscriber(
        input: CreateSubscriberInput,
    ): Promise<NotificationResult> {

        throw new Error('not implemented')
    }

    async deleteSubscriber(
        subscriberId: string,
    ): Promise<NotificationResult> {

        await this.novu.subscribers.delete(
            subscriberId
        );

        return {
            success: true,
        };
    }

    async trigger(
        input: TriggerNotificationInput,
    ): Promise<NotificationResult> {

        await this.novu.trigger({

            workflowId: 'generic-in-app-notification',
            to: {
                subscriberId: input.subscriberId,
            },
            payload: input.payload,
        });

        return {
            success: true,
        };
    }

}