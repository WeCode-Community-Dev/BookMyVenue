# API Overview

## Base URL
All API routes are mounted under `/api/v1`. Example:
```
http://localhost:3000/api/v1/health
```

## Health Check
```
GET /api/v1/health
Response: { "success": true, "message": "Service is healthy" }
```

## Authentication Flow
The API uses JWT-based authentication with access + refresh token pattern:

1. **Register**: `POST /api/v1/auth/register` — Create account (username, email, password)
2. **Login**: `POST /api/v1/auth/login` — Returns access token in response body, refresh token in HTTP-only cookie
3. **Access**: Include access token in `Authorization: Bearer <token>` header
4. **Refresh**: `POST /api/v1/auth/refresh` — Uses refresh token cookie to issue new access token
5. **Logout**: `POST /api/v1/auth/logout` — Revokes current session

Additional auth endpoints:
- `POST /api/v1/auth/forgot-password` — Sends reset email (rate-limited: 5/15min)
- `POST /api/v1/auth/reset-password` — Resets password with token
- `PATCH /api/v1/auth/change-password` — Change password (authenticated)
- `GET /api/v1/auth/sessions` — List active sessions
- `POST /api/v1/auth/sessions/logout-others` — Sign out other sessions
- `DELETE /api/v1/auth/sessions/:sessionId` — Revoke specific session

Rate limiting: Login is limited to 10 attempts per 15 minutes per IP.

## Response Format

### Success
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

### Paginated
```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": {
    "items": [ ... ],
    "pagination": {
      "total": 87,
      "page": 2,
      "limit": 10,
      "skip": 10,
      "totalPages": 9,
      "hasNext": true,
      "hasPrev": true
    }
  }
}
```

Pagination query parameters:
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | 1-based page number |
| `limit` | number | `20` | Items per page (clamped between min/max) |
| `skip` | number | — | Override skip directly (ignores page) |
| `sort` | string | `-createdAt` | Comma-separated fields; prefix `-` for descending |

### Status Codes Used by ResponseUtil
| Method | HTTP Status |
|---|---|
| `success()` | 200 |
| `created()` | 201 |
| `error()` | 500 |
| `notFound()` | 404 |
| `badRequest()` | 400 |
| `unauthorized()` | 401 |
| `forbidden()` | 403 |
| `conflict()` | 409 |
| `rateLimitExceeded()` | 429 |
| `validationError()` | 422 |
| `internalServerError()` | 500 |
| `serverUnavailable()` | 503 |

## Request Validation
All request data is validated using Zod schemas via the validation middleware:
- **Body**: `validateBody(schema)` — Validates `req.body`
- **Params**: `validateParams(schema)` — Validates route parameters
- **Query**: Validation available via middleware pattern

Validated data is available at `req.validated.body`, `req.validated.params`, or `req.validated.query`. Controllers must never access raw `req.body` directly.

## Webhook Handling
Webhooks (Razorpay) are mounted at `/api/v1/webhook` **before** the JSON body parser in the middleware stack. This ensures the raw request body is available as a Buffer for HMAC-SHA256 signature verification.

## Idempotency
Certain endpoints (payment processing, booking creation, venue state changes) support idempotency via the `Idempotency-Key` header:
- Pass a unique key in the request header
- If the same key is reused within a time window, the server returns the original response instead of processing again
- Implemented via `idempotency.middleware.ts` using MongoDB storage

## Swagger API Documentation
Interactive API documentation is available at `http://localhost:3000/api/v1/swagger` when the server is running. It uses swagger-jsdoc with inline JSDoc annotations in controller/route files. Access is protected by basic authentication (credentials from `SWAGGER_USER`/`SWAGGER_PASS` env vars).

## API Route Map
All routes under `/api/v1/`:

| Prefix | Module | Auth Required |
|---|---|---|
| `/auth` | Authentication | Varies by endpoint |
| `/user` | User management | Yes |
| `/venues` | Venue CRUD | Varies |
| `/bookings` | Booking management | Yes |
| `/availability` | Availability schedules | Varies |
| `/owner` | Owner operations | Yes (owner+) |
| `/rbac` | RBAC management | Yes (admin+) |
| `/role` | Role management | Yes (admin+) |
| `/reviews` | Reviews & ratings | Varies |
| `/moderation` | Moderation | Yes (admin+) |
| `/geo` | Geocoding/search | Yes |
| `/wishlist` | User wishlists | Yes |
| `/webhook` | External webhooks | None (HMAC verified) |
| `/swagger` | API docs | Basic auth |
| `/health` | Health check | None |
