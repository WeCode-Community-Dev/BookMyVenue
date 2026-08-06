# Venues API

Public endpoints for browsing venues.

**Base URL:** `http://localhost:8000`

---

## List Venues

Returns a paginated list of **approved**, non-deleted venues, sorted by newest first.

```
GET /venues
```

### Query Parameters

| Param   | Type    | Default | Description                           |
| ------- | ------- | ------- | ------------------------------------- |
| `page`  | integer | `1`     | Page number (min 1).     |
| `limit` | integer | `20`    | Items per page (min 1). |

### Example

```bash
curl -X GET "http://localhost:8000/venues?page=1&limit=10" -H "Accept: application/json"
```

### Response `200 OK`

```json
{
  "data": [
    {
      "_id": "6a1c7a1112f6e3767f5951b1",
      "name": "Backwater Banquet Hall",
      "description": "Spacious banquet hall overlooking the Kochi backwaters.",
      "venueCategory": {
        "_id": "6a1c7a113b650d96cb4438f6",
        "identifier": "banquet-hall",
        "name": "Banquet Hall"
      },
      "capacity": 300,
      "addressLine": "Marine Drive",
      "state": "Kerala",
      "district": "Ernakulam",
      "city": "Kochi",
      "pincode": "682031",
      "location": { "type": "Point", "coordinates": [76.2809, 9.9816] },
      "basePrice": 2500000,
      "images": [
        {
          "url": "https://picsum.photos/seed/bmv-banquet/800/600",
          "sortOrder": 0,
          "isCover": true
        }
      ],
      "createdAt": "2026-05-31T18:12:33.920Z"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 4, "totalPages": 1 }
}
```

### Errors

| Status | Body                                                            |
| ------ | --------------------------------------------------------------- |
| `500`  | `{ "error": "<message>", "message": "Failed to fetch venues" }` |

---

## Get Venue by ID

Returns the public detail for a single **approved** venue.

```
GET /venues/:id
```

### Path Parameters

| Param | Type             | Description        |
| ----- | ---------------- | ------------------ |
| `id`  | MongoDB ObjectId | The venue's `_id`. |

### Example

```bash
curl -X GET "http://localhost:8000/venues/6a1c7a1112f6e3767f5951b1" -H "Accept: application/json"
```

### Response `200 OK`

```json
{
  "data": {
    "_id": "6a1c7a1112f6e3767f5951b1",
    "name": "Backwater Banquet Hall",
    "description": "Spacious banquet hall overlooking the Kochi backwaters.",
    "venueCategory": {
      "_id": "6a1c7a113b650d96cb4438f6",
      "identifier": "banquet-hall",
      "name": "Banquet Hall"
    },
    "capacity": 300,
    "addressLine": "Marine Drive",
    "state": "Kerala",
    "district": "Ernakulam",
    "city": "Kochi",
    "pincode": "682031",
    "location": { "type": "Point", "coordinates": [76.2809, 9.9816] },
    "basePrice": 2500000,
    "images": [
      {
        "url": "https://picsum.photos/seed/bmv-banquet/800/600",
        "sortOrder": 0,
        "isCover": true
      }
    ],
    "createdAt": "2026-05-31T18:12:33.920Z"
  }
}
```

### Errors

| Status | Body                                                            | When                                     |
| ------ | --------------------------------------------------------------- | ---------------------------------------- |
| `400`  | `{ "error": "Invalid venue id", "message": "Venue not found" }` | `id` is not a valid ObjectId.            |
| `404`  | `{ "message": "Venue not found" }`                              | No matching approved, non-deleted venue. |
| `500`  | `{ "error": "<message>", "message": "Failed to fetch venue" }`  | Server error.                            |

> A non-public venue (pending/rejected/deleted) returns `404` — the API never reveals whether such a listing exists.
