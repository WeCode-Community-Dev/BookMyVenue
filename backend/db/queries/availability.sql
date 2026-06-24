-- name: CreateNewSlot :one
INSERT INTO availability (venue_id, start_time, end_time)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetAvailableSlotsByVenueID :many
SELECT * FROM availability
WHERE venue_id = $1 AND is_booked = FALSE;

-- name: DeleteSlot :exec
DELETE FROM availability
WHERE id = $1;

-- name: GetSlotByID :one
SELECT * FROM availability
WHERE id = $1;

-- name: GetSlotForUpdate :one
SELECT * FROM availability
WHERE id = $1
FOR UPDATE;

-- name: MarkSlotBooked :exec
UPDATE availability
SET is_booked = TRUE
WHERE id = $1;
