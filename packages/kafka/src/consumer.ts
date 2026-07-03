import type { Kafka, Consumer, EachMessagePayload } from "kafkajs";

interface KafkaConsumer {
    connect(): Promise<void>;
    subscribe(topics: TopicConfig[]): Promise<void>;
    disconnect(): Promise<void>;
}

type KafkaMessageHandler<T = unknown> = (message: T) => Promise<void>;

interface TopicConfig<T = unknown> {
    topicName: string;
    topicHandler: KafkaMessageHandler<T>;
}

export const createConsumer = (kafka: Kafka, groupId: string): KafkaConsumer => {
    const consumer: Consumer = kafka.consumer({ groupId });

    const connect = async () => {
        await consumer.connect();
        console.log("Kafka consumer connected:" + groupId);
    };

    const subscribe = async (topics: TopicConfig[]) => {
        const topicHandlers = new Map(topics.map(({ topicName, topicHandler }) => [topicName, topicHandler]));

        await consumer.subscribe({
            topics: topics.map(({ topicName }) => topicName),
            fromBeginning: true,
        });

        await consumer.run({
            eachMessage: async ({ topic, message }: EachMessagePayload): Promise<void> => {
                const topicHandler = topicHandlers.get(topic);

                if (!topicHandler) {
                    console.warn(`No handler registered for topic: ${topic}`);
                    return;
                }

                const value = message.value?.toString();

                if (!value) {
                    console.warn(`Received empty message from topic: ${topic}`);
                    return;
                }

                try {
                    const parsedMessage: unknown = JSON.parse(value);
                    await topicHandler(parsedMessage);
                } catch (error: unknown) {
                    console.error(`Failed to process Kafka message from topic: ${topic}`, error);
                    throw error;
                }
            },
        });
    };

    const disconnect = async () => {
        await consumer.disconnect();
        console.log(`Kafka consumer disconnected: ${groupId}`);
    };

    return { connect, subscribe, disconnect };
};
