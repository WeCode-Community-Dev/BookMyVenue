import type { Kafka, Producer } from "kafkajs";

export interface KafkaProducer {
    connect(): Promise<void>;
    send(topic: string, message: object): Promise<void>;
    disconnect(): Promise<void>;
}

export const createProducer = (kafka: Kafka): KafkaProducer => {
    const producer: Producer = kafka.producer();

    let connectPromise: Promise<void> | null = null;

    const connect = async () => {
        if (!connectPromise) {
            connectPromise = producer.connect().then(() => {
                console.log("Kafka producer connected");
            });
        }
        await connectPromise;
    };

    const send = async (topic: string, message: object) => {
        await connect();
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
    };

    const disconnect = async () => {
        await producer.disconnect();
        connectPromise = null;
        console.log("Kafka producer disconnected");
    };

    return { connect, send, disconnect };
};
