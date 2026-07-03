import type { Kafka, Producer } from "kafkajs";

export interface KafkaProducer {
    connect(): Promise<void>;
    send(topic: string, message: object): Promise<void>;
    disconnect(): Promise<void>;
}

export const createProducer = (kafka: Kafka): KafkaProducer => {
    const producer: Producer = kafka.producer();

    const connect = async () => {
        await producer.connect();
        console.log("Kafka producer connected");
    };

    const send = async (topic: string, message: object) => {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    };

    const disconnect = async () => {
        await producer.disconnect();
        console.log("Kafka producer disconnected");
    };

    return { connect, send, disconnect };
};
