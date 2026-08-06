import { Kafka } from "kafkajs";

export const createKafkaClient = (service: string) => {
    const kafka = new Kafka({
        clientId: service,
        brokers: ["localhost:9094"],
    });

    return kafka;
};
