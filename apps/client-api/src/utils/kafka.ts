import {  createConsumer, createKafkaClient, createProducer } from "@bookmyvenue/kafka";

const kafkaClient = createKafkaClient("client-api-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "client-api-group");


