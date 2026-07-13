ALTER TABLE booking
DROP COLUMN start_time;

ALTER TABLE booking
DROP COLUMN end_time;

ALTER TABLE booking
    ADD COLUMN slot_template_id BIGINT NOT NULL;

ALTER TABLE booking
    ADD CONSTRAINT fk_booking_slot_template
        FOREIGN KEY (slot_template_id)
            REFERENCES venue_availability_template(id);

ALTER TABLE booking
    ADD CONSTRAINT uk_booking_slot
        UNIQUE (
                booking_date,
                slot_template_id
            );