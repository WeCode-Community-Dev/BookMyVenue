-- name: CreateBooking :one
INSERT INTO bookings (user_id, venue_id, slot_id, total_amount, status)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetBookingByID :one
SELECT * FROM bookings
WHERE id = $1;

-- name: GetBookingsByUserID :many
SELECT * FROM bookings
WHERE user_id = $1
ORDER BY created_at DESC;

-- name: UpdateBookingStatus :exec
UPDATE bookings
SET status = $2
WHERE id = $1;