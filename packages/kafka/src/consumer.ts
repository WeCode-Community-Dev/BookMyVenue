import type { Consumer, EachMessagePayload, Kafka } from "kafkajs";

// type TopicMap = Record<string, unknown>;

type TopicHandlers<TTopicMap extends object> = {
    [TTopic in keyof TTopicMap]: (message: TTopicMap[TTopic]) => Promise<void>;
};

export interface KafkaConsumer<TTopicMap extends object> {
    connect(): Promise<void>;

    subscribe(topicHandlers: TopicHandlers<TTopicMap>): Promise<void>;

    disconnect(): Promise<void>;
}

export const createConsumer = <TTopicMap extends object>(
    kafka: Kafka,
    groupId: string,
): KafkaConsumer<TTopicMap> => {
    const consumer: Consumer = kafka.consumer({ groupId });

    const connect = async (): Promise<void> => {
        await consumer.connect();
        console.log(`Kafka consumer connected: ${groupId}`);
    };

    const subscribe = async (topicHandlers: TopicHandlers<TTopicMap>): Promise<void> => {
        const topics = Object.keys(topicHandlers);

        await consumer.subscribe({
            topics,
            fromBeginning: true,
        });

        await consumer.run({
            eachMessage: async ({ topic, message }: EachMessagePayload): Promise<void> => {
                const topicHandler = topicHandlers[topic as keyof TTopicMap];

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

                    await topicHandler(parsedMessage as TTopicMap[keyof TTopicMap]);
                } catch (error: unknown) {
                    console.error(`Failed to process Kafka message from topic: ${topic}`, error);

                    throw error;
                }
            },
        });
    };

    const disconnect = async (): Promise<void> => {
        await consumer.disconnect();
        console.log(`Kafka consumer disconnected: ${groupId}`);
    };

    return {
        connect,
        subscribe,
        disconnect,
    };
};

// import type { Kafka, Consumer, EachMessagePayload } from "kafkajs";

// export interface KafkaConsumer {
//     connect(): Promise<void>;
//     subscribe(topics: TopicConfig[]): Promise<void>;
//     disconnect(): Promise<void>;
// }

// export type KafkaMessageHandler<T = unknown> = (message: T) => Promise<void>;

// export interface TopicConfig<T = unknown> {
//     topicName: string;
//     topicHandler: KafkaMessageHandler<T>;
// }

// export const createConsumer = (kafka: Kafka, groupId: string): KafkaConsumer => {
//     const consumer: Consumer = kafka.consumer({ groupId });

//     const connect = async () => {
//         await consumer.connect();
//         console.log("Kafka consumer connected:" + groupId);
//     };

//     const subscribe = async (topics: TopicConfig[]) => {
//         const topicHandlers = new Map(topics.map(({ topicName, topicHandler }) => [topicName, topicHandler]));

//         await consumer.subscribe({
//             topics: topics.map(({ topicName }) => topicName),
//             fromBeginning: true,
//         });

//         await consumer.run({
//             eachMessage: async ({ topic, message }: EachMessagePayload): Promise<void> => {
//                 const topicHandler = topicHandlers.get(topic);

//                 if (!topicHandler) {
//                     console.warn(`No handler registered for topic: ${topic}`);
//                     return;
//                 }

//                 const value = message.value?.toString();

//                 if (!value) {
//                     console.warn(`Received empty message from topic: ${topic}`);
//                     return;
//                 }

//                 try {
//                     const parsedMessage: unknown = JSON.parse(value);
//                     await topicHandler(parsedMessage);
//                 } catch (error: unknown) {
//                     console.error(`Failed to process Kafka message from topic: ${topic}`, error);
//                     throw error;
//                 }
//             },
//         });
//     };

//     const disconnect = async () => {
//         await consumer.disconnect();
//         console.log(`Kafka consumer disconnected: ${groupId}`);
//     };

//     return { connect, subscribe, disconnect };
// };
