import { createConsumer, createKafkaClient } from "@bookmyvenue/kafka";
// import sendMail from "./utils/mailer";
import { handleBookingCreated } from "./utils/handlers/booking.handler";
import { handleVenueVerificationUpdated } from "./utils/handlers/venueVerification.handler";
import { handleUserCreated } from "./utils/handlers/user.handler";
import type { KafkaTopicMap } from "@bookmyvenue/types";

const kafkaClient = createKafkaClient("email-service");

//  const producer: Producer = createProducer(kafkaClient);
export const consumer = createConsumer<KafkaTopicMap>(kafkaClient, "email-service");

const start = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({
            "user-created": handleUserCreated,
            "booking-created": handleBookingCreated,
            "venue-verification-updated": handleVenueVerificationUpdated,
        });
    } catch (error) {
        console.log(error);
    }
};

start();

// import { createConsumer, createKafkaClient, createProducer } from "@bookmyvenue/kafka";
// import sendMail from "./utils/mailer";
// import { handleBookingCreated } from "./utils/handlers/booking.handler";
// import { handleVenueVerificationUpdated } from "./utils/handlers/venueVerification.handler";
// import { handleUserCreated } from "./utils/handlers/user.handler";

// const kafkaClient = createKafkaClient("email-service");

// export const producer = createProducer(kafkaClient);
// export const consumer = createConsumer(kafkaClient, "email-service");

// const start = async () => {
//     try {
//         await consumer.connect();
//         await consumer.subscribe([
//             {
//                 topicName: "user-created",
//                 topicHandler: handleUserCreated,
//             },
//             {
//                 topicName: "booking-created",
//                 topicHandler: handleBookingCreated,
//             },
//             {
//                 topicName: "venue-verification-updated",
//                 topicHandler: handleVenueVerificationUpdated,
//             },
//         ]);
//     } catch (error) {
//         console.log(error);
//     }
// };

// start();
