import { createConsumer, createKafkaClient, createProducer } from "@bookmyvenue/kafka";
import sendMail from "./utils/mailer";
import { handleBookingCreated } from "./utils/handlers/booking.handler";
import { handleVenueVerificationUpdated } from "./utils/handlers/venueVerification.handler";

const kafkaClient = createKafkaClient("email-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "email-service");

const start = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe([
            {
                topicName: "booking-created",
                topicHandler: handleBookingCreated,
            },
            {
                topicName: "venue-verification-updated",
                topicHandler: handleVenueVerificationUpdated,
            },
        ]);
    } catch (error) {
        console.log(error);
    }
};

start();
