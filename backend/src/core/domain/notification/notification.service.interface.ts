export interface CreateSubscriberInput {
    subscriberId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
}

export interface TriggerNotificationInput {
    subscriberId: string;
    payload: Record<string, unknown>;
}

export interface NotificationResult {
    success: boolean;
    message?: string;
}

export interface INotificationService {

    createSubscriber(
        input: CreateSubscriberInput
    ): Promise<NotificationResult>;

    updateSubscriber(
        input: CreateSubscriberInput
    ): Promise<NotificationResult>;

    deleteSubscriber(
        subscriberId: string
    ): Promise<NotificationResult>;

    trigger(
        input: TriggerNotificationInput
    ): Promise<NotificationResult>;

}