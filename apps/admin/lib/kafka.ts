import { createKafkaClient, createProducer } from "@bookmyvenue/kafka";

const kafkaClient = createKafkaClient("admin-service");

export const producer = createProducer(kafkaClient);
