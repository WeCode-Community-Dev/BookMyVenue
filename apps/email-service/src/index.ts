import { createConsumer, createKafkaClient, createProducer } from "@bookmyvenue/kafka";
import sendMail from "./utils/mailer";

const kafkaClient = createKafkaClient("email-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "email-service");

const start = async () => {
    console.log(">>> Email Sevice Started <<<");

    try {
        await consumer.connect();
        await consumer.subscribe([
            {
                topicName: "venue-created",
                topicHandler: async (message) => {
                    console.log("Message-Value: ", message);

                    const email = "rizwanc73@gmail.com";
                    if (email) {
                        await sendMail({
                            email,
                            subject: "Venue edited",
                            text: `${JSON.stringify(message)}`,
                        });
                    }
                },
            },
            {
                topicName: "venue-approved",
                topicHandler: async (message) => {
                    const { email, amount, status } = message;

                    if (email) {
                        await sendMail({
                            email,
                            subject: "Order has been created",
                            text: `Hello! Your order: Amount: ${amount / 100}, Status: ${status}`,
                        });
                    }
                },
            },
        ]);
    } catch (error) {
        console.log(error);
    }
};

start();
