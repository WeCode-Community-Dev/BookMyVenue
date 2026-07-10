# TODO

## Authentication
- [ ] Migrate frontend API requests to use a centralized `apiFetch` helper.
- [ ] Automatically refresh expired access tokens and retry the original request.
- [ ] Redirect users to the login page when refresh token validation fails.

## Error Handling
- [ ] Refactor service and handler error handling using sentinel/custom errors.
- [ ] Map service errors to appropriate HTTP status codes (400, 401, 403, 404, 500).
- [ ] Avoid exposing raw internal error messages in API responses.

## Database Transactions
- [ ] Wrap venue creation and amenity assignment in a single database transaction to prevent partial data creation if any step fails.

## Image Uploads
- [ ] Make multiple image uploads atomic by cleaning up previously uploaded images or using a transaction-like workflow if one upload fails.

## Amenities
- [ ] Seed default amenities during application setup instead of creating them on demand.
- [x] Validate and reuse existing amenities rather than inserting duplicates.
