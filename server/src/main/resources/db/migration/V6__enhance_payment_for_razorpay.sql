ALTER TABLE payment
    ADD COLUMN razorpay_order_id VARCHAR(255);

ALTER TABLE payment
    ADD COLUMN razorpay_payment_id VARCHAR(255);

ALTER TABLE payment
    ADD COLUMN razorpay_signature TEXT;

ALTER TABLE payment
    ADD COLUMN paid_at TIMESTAMP;