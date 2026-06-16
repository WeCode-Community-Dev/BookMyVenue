-- name: CreateNewSlot :one
INSERT INTO availability (venue_id, start_time, end_time)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetAvailableSlotsByVenueID :many
SELECT * FROM availability
WHERE venue_id = $1;

-- name: DeleteSlot :exec
DELETE FROM availability
WHERE id = $1;