# Venue Categories API

Public endpoint for listing venue categories.

**Base URL:** `http://localhost:8000`

---

## List Venue Categories

Returns all **active**, non-deleted categories, sorted alphabetically by name. Used for the filter dropdown and for resolving category labels.

```
GET /venueCategories
```

### Example

```bash
curl -X GET "http://localhost:8000/venueCategories" -H "Accept: application/json"
```

### Response `200 OK`

```json
{
  "data": [
    { "_id": "6a1c7a113b650d96cb4438fa", "identifier": "auditorium", "name": "Auditorium" },
    { "_id": "6a1c7a113b650d96cb4438f6", "identifier": "banquet-hall", "name": "Banquet Hall" },
    { "_id": "6a1c7a113b650d96cb4438f7", "identifier": "birthday-hall", "name": "Birthday Hall" },
    { "_id": "6a1c7a113b650d96cb4438f8", "identifier": "cafe", "name": "Cafe" },
    { "_id": "6a1c7a113b650d96cb4438f9", "identifier": "hotel", "name": "Hotel" }
  ]
}
```

### Errors

| Status | Body                                                                |
| ------ | ------------------------------------------------------------------- |
| `500`  | `{ "error": "<message>", "message": "Failed to fetch categories" }` |
