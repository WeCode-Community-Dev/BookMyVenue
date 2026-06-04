-- name: CreateVenue :one
INSERT INTO venues (
    owner_id,
    name,
    description,
    category,
    address,
    city,
    state,
    pincode,
    capacity,
    price_per_hour,
    price_per_day
)
VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
)
RETURNING *;

-- name: GetVenueByID :one
SELECT * FROM venues
WHERE id = $1;

-- name: GetVenuesByOwnerID :many
SELECT * FROM venues
WHERE owner_id = $1
ORDER BY created_at DESC;

-- name: GetAllVenues :many
SELECT * FROM venues
WHERE status = 'approved'
ORDER BY created_at DESC;

-- name: DeleteVenue :exec
DELETE FROM venues
WHERE id = $1;


-- name: AddVenueImage :one
INSERT INTO venue_images (venue_id, image_url)
VALUES ($1, $2)
RETURNING *;

-- name: GetVenueImages :many
SELECT * FROM venue_images
WHERE venue_id = $1;

-- name: DeleteVenueImage :exec
DELETE FROM venue_images
WHERE id = $1;


-- name: CreateAmenity :one
INSERT INTO amenities (name)
VALUES ($1)
RETURNING *;

-- name: GetAllAmenities :many
SELECT * FROM amenities
ORDER BY name;


-- name: AssignAmenityToVenue :exec
INSERT INTO venue_amenities (venue_id, amenity_id)
VALUES ($1, $2);

-- name: GetAmenitiesForVenue :many
SELECT a.id, a.name
FROM venue_amenities va
JOIN amenities a
ON a.id = va.amenity_id
WHERE va.venue_id = $1;

-- name: RemoveAmenityFromVenue :exec
DELETE FROM venue_amenities
WHERE venue_id = $1 AND amenity_id = $2;


-- name: FindVenuesInACity :many
SELECT * FROM venues
WHERE city = $1 AND status = 'approved';

-- name: FindVenuesByCategory :many
SELECT * FROM venues
WHERE category = $1 AND status = 'approved';

-- name: FindVenuesByPriceRange :many
SELECT * FROM venues
WHERE price_per_hour BETWEEN $1 AND $2
AND status = 'approved';
