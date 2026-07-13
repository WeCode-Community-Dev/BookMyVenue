CREATE UNIQUE INDEX uk_booking_active_slot
    ON booking(booking_date, slot_template_id)
    WHERE status IN ('PENDING', 'CONFIRMED');