import { createKafkaClient, createProducer } from "@bookmyvenue/kafka";

const kafkaClient = createKafkaClient("client-service");

export const producer = createProducer(kafkaClient);
