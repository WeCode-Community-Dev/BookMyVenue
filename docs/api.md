# BookMyVenue — API Contract (v1)

Base URL: `/api/v1`

All authenticated routes require `Authorization: Bearer <jwt>`.

## Auth

| Method | Path             | Body                         | Returns       | Access  |
|--------|------------------|------------------------------|---------------|---------|
| POST   | /auth/signup     | `{email,name,password,role}` | `Token`       | public  |
| POST   | /auth/login      | `{email,password}`           | `Token`       | public  |
| POST   | /auth/google     | `{credential}`               | `Token`       | public  |

## Users

| Method | Path             | Body                          | Returns            | Access |
|--------|------------------|-------------------------------|--------------------|--------|
| GET    | /users/me        | -                             | `UserRead`         | any    |
| PUT    | /users/me        | `{name?}`                     | `UserRead`         | any    |
| POST   | /users/me/owner  | `{business_name,...}`         | `OwnerProfileRead` | any    |
| GET    | /users/me/owner  | -                             | `OwnerProfileRead` | any    |

## Venues (public)

| Method | Path             | Query                                                       | Returns        | Access |
|--------|------------------|-------------------------------------------------------------|----------------|--------|
| GET    | /venues          | lat,lng,radius_km,type,min_price,max_price,min_capacity,q  | `VenueRead[]`  | public |
| GET    | /venues/{id}     | -                                                           | `VenueRead`    | public |

## Owner

| Method | Path                   | Body                  | Returns        | Access |
|--------|------------------------|-----------------------|----------------|--------|
| POST   | /owner/venues          | `VenueCreate`         | `VenueRead`    | owner  |
| GET    | /owner/venues          | -                     | `VenueRead[]`  | owner  |
| PUT    | /owner/venues/{id}     | `VenueUpdate`         | `VenueRead`    | owner  |
| GET    | /owner/bookings        | -                     | `BookingRead[]`| owner  |
| PATCH  | /owner/bookings/{id}   | `{status}`            | `BookingRead`  | owner  |

## Bookings (user)

| Method | Path                       | Body                  | Returns        | Access |
|--------|----------------------------|-----------------------|----------------|--------|
| POST   | /bookings                  | `{venue_id,start,end}`| `BookingRead`  | any    |
| GET    | /bookings                  | -                     | `BookingRead[]`| any    |
| POST   | /bookings/{id}/cancel      | -                     | `BookingRead`  | any    |

## Admin

| Method | Path                       | Body            | Returns          | Access |
|--------|----------------------------|-----------------|------------------|--------|
| GET    | /admin/overview            | -               | `OverviewStats`  | admin  |
| GET    | /admin/venues/pending      | -               | `VenueRead[]`    | admin  |
| GET    | /admin/venues              | -               | `VenueRead[]`    | admin  |
| PATCH  | /admin/venues/{id}         | `{status}`      | `VenueRead`      | admin  |
| GET    | /admin/bookings            | -               | `BookingRead[]`  | admin  |

## Health

| Method | Path    | Returns |
|--------|---------|---------|
| GET    | /health | `{status: ok}` |
