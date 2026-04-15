# CSC 394 — Week 3 API Demo

A fully working REST API built with **Express.js** that demonstrates every concept from the Week 3 lecture on API Design and Documentation. Uses real class roster data.

## Quick Start

```bash
npm install
npm start          # http://localhost:3000
```

Open `http://localhost:3000` in your browser to see the interactive frontend.

## What This Demo Covers

| Lecture Concept | Where It's Demonstrated |
|---|---|
| **Resources as nouns** | `/api/students`, `/api/groups` — no verbs in URLs |
| **HTTP methods** | `GET` (read), `POST` (create), `PATCH` (update), `DELETE` (remove) |
| **Correct status codes** | `200`, `201`, `204`, `404`, `422` |
| **Pagination** | `GET /api/students?page=2&perPage=5` |
| **Filtering** | `?groupId=group-1`, `?role=scrum master`, `?search=peter` |
| **Sorting** | `?sort=firstName&order=desc` |
| **Nested resources** | `GET /api/groups/:id/members` |
| **Standardized errors** | `{ error: { code, message, details } }` |
| **Input validation** | All fields validated; all errors returned at once |
| **PATCH vs PUT** | PATCH sends only changed fields |
| **API documentation** | [`docs/api.md`](docs/api.md) |
| **Interface contract** | Request/response shapes documented per endpoint |
| **Testing** | 35+ tests with Jest + Supertest |
| **Linting/formatting** | ESLint + Prettier configs included |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server on port 3000 |
| `npm run dev` | Start with auto-reload (Node `--watch`) |
| `npm test` | Run the full test suite |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Project Structure

```
api-demo/
├── docs/
│   └── api.md              ← Full API documentation
├── src/
│   ├── app.js              ← Express app (imported by server + tests)
│   ├── server.js           ← Entry point — starts listening
│   ├── data/
│   │   └── seed.js         ← In-memory data store + helpers
│   ├── middleware/
│   │   └── errorHandler.js ← 404 + 500 error handlers
│   ├── routes/
│   │   ├── students.js     ← CRUD endpoints for students
│   │   └── groups.js       ← Read endpoints for groups
│   └── public/
│       └── index.html      ← Interactive frontend
├── tests/
│   ├── students.test.js    ← 28 tests for students API
│   └── groups.test.js      ← 8 tests for groups API
├── .eslintrc.json
├── .prettierrc
└── package.json
```

## Try It with cURL

```bash
# List all students
curl http://localhost:3000/api/students

# Filter by group
curl "http://localhost:3000/api/students?groupId=group-3"

# Create a new student (note the 201 response)
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Doe","groupId":"group-1"}'

# Trigger a validation error (missing required fields)
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{"role":"wizard"}'

# Update with PATCH (only send changed fields)
curl -X PATCH http://localhost:3000/api/students/student-01 \
  -H "Content-Type: application/json" \
  -d '{"role":"scrum master"}'

# Delete a student (204 No Content)
curl -X DELETE http://localhost:3000/api/students/student-34

# Nested resource: group members
curl http://localhost:3000/api/groups/group-1/members
```

## Key Design Decisions (for class discussion)

1. **`app.js` vs `server.js` separation** — The Express app is exported from `app.js` so tests can import it without starting a server. `server.js` only calls `app.listen()`.

2. **In-memory data** — No database dependency. Great for demos but data resets on restart. Week 4 will cover databases.

3. **`resetData()` in tests** — Each test starts from a known state. Tests should never depend on each other.

4. **Validation collects all errors** — Instead of returning on the first error, we collect them all so the client can fix everything in one pass.

5. **PATCH, not PUT** — PATCH is more practical: send only what changed. PUT would require sending every field.
