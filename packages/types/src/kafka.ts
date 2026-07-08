import { BookingCreatedEvent } from "./booking";
import { UserCreatedEvent } from "./user";
import { VenueVerificationUpdatedEvent } from "./venue";

export interface KafkaTopicMap {
    "user-created": UserCreatedEvent;
    "booking-created": BookingCreatedEvent;
    "venue-verification-updated": VenueVerificationUpdatedEvent;
}
