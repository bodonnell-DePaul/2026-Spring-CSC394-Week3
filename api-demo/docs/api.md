# CSC 394 API Demo — API Documentation

> All endpoints use the `/api/` prefix. Responses use JSON.
> This API has no authentication — it's a classroom demo.

---

## Health Check

`GET /api/health`

**Success:** `200 OK`
```json
{ "status": "ok", "timestamp": "2026-04-15T10:30:00Z" }
```

---

## Students

### List Students
`GET /api/students`

Returns a paginated, filterable list of students.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `groupId` | string | — | Filter by group (e.g. `group-1`) |
| `role` | string | — | Filter by role (`developer`, `scrum master`, etc.) |
| `search` | string | — | Search name or email (case-insensitive) |
| `sort` | string | `lastName` | Sort field: `firstName`, `lastName`, `groupId`, `role`, `createdAt` |
| `order` | string | `asc` | Sort order: `asc` or `desc` |
| `page` | number | `1` | Page number |
| `perPage` | number | `20` | Results per page (max 100) |

**Success:** `200 OK`
```json
{
  "data": [
    {
      "id": "student-01",
      "firstName": "Wael Ahmed M",
      "lastName": "Alolowi",
      "groupId": "group-6",
      "email": "walolowi@depaul.edu",
      "role": "developer",
      "createdAt": "2026-04-01T09:00:00Z",
      "updatedAt": "2026-04-01T09:00:00Z"
    }
  ],
  "pagination": { "page": 1, "perPage": 20, "total": 34, "totalPages": 2 }
}
```

---

### Get Single Student
`GET /api/students/:id`

**Success:** `200 OK` — returns full student object

**Errors:** `404` Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Student with id 'student-999' not found"
  }
}
```

---

### Create Student
`POST /api/students`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `firstName` | string | ✅ | 1–100 chars |
| `lastName` | string | ✅ | 1–100 chars |
| `groupId` | string | ✅ | Must reference an existing group |
| `email` | string | No | Valid email format |
| `role` | string | No | `developer` (default), `scrum master`, `product owner`, `designer` |

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "groupId": "group-3",
  "email": "jdoe@depaul.edu",
  "role": "developer"
}
```

**Success:** `201 Created` — returns full student object with server-generated `id`, `createdAt`, `updatedAt`

**Errors:** `422` Validation Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "firstName", "message": "First name is required" },
      { "field": "groupId", "message": "Group 'group-99' does not exist" }
    ]
  }
}
```

---

### Update Student (Partial)
`PATCH /api/students/:id`

Send only the fields you want to change. All fields are optional.

| Field | Type | Notes |
|-------|------|-------|
| `firstName` | string | 1–100 chars |
| `lastName` | string | 1–100 chars |
| `groupId` | string | Must reference an existing group |
| `email` | string | Valid email format |
| `role` | string | `developer`, `scrum master`, `product owner`, `designer` |

**Request:**
```json
{ "role": "scrum master" }
```

**Success:** `200 OK` — returns updated student object

**Errors:** `404` Not Found · `422` Validation Error

---

### Delete Student
`DELETE /api/students/:id`

**Success:** `204 No Content` (empty body)

**Errors:** `404` Not Found

---

## Groups

### List Groups
`GET /api/groups`

Returns all groups with member counts.

**Success:** `200 OK`
```json
{
  "data": [
    {
      "id": "group-1",
      "name": "Group 1",
      "project": "TaskBoard",
      "createdAt": "2026-04-01T09:00:00Z",
      "memberCount": 5
    }
  ]
}
```

---

### Get Single Group
`GET /api/groups/:id`

**Success:** `200 OK` — returns group object with `memberCount`

**Errors:** `404` Not Found

---

### List Group Members (Nested Resource)
`GET /api/groups/:id/members`

Returns all students in the specified group.

**Success:** `200 OK`
```json
{
  "data": [
    {
      "id": "student-11",
      "firstName": "Vishwash",
      "lastName": "Golakiya",
      "groupId": "group-1",
      "email": "vgolakiya@depaul.edu",
      "role": "scrum master",
      "createdAt": "2026-04-01T09:00:00Z",
      "updatedAt": "2026-04-01T09:00:00Z"
    }
  ],
  "pagination": { "page": 1, "perPage": 5, "total": 5, "totalPages": 1 }
}
```

**Errors:** `404` Not Found (group doesn't exist)

---

## Error Format

All errors follow the same structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": []
  }
}
```

| Code | HTTP Status | Description |
|------|:-----------:|-------------|
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `VALIDATION_ERROR` | 422 | Invalid input data (see `details` array) |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## cURL Examples

```bash
# List all students
curl http://localhost:3000/api/students

# Filter by group
curl "http://localhost:3000/api/students?groupId=group-3"

# Search by name
curl "http://localhost:3000/api/students?search=peter"

# Paginate (5 per page, page 2)
curl "http://localhost:3000/api/students?page=2&perPage=5"

# Get single student
curl http://localhost:3000/api/students/student-01

# Create a student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Doe","groupId":"group-3"}'

# Update a student (PATCH — only changed fields)
curl -X PATCH http://localhost:3000/api/students/student-01 \
  -H "Content-Type: application/json" \
  -d '{"role":"scrum master"}'

# Delete a student
curl -X DELETE http://localhost:3000/api/students/student-34

# List groups
curl http://localhost:3000/api/groups

# Get group members (nested resource)
curl http://localhost:3000/api/groups/group-1/members

# Health check
curl http://localhost:3000/api/health
```
