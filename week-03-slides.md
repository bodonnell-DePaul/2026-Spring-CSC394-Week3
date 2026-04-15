---
marp: true
theme: default
paginate: true
header: "CSC 394 — Week 3"
footer: "API Design and Documentation"
---

# Week 3: API Design and Documentation

**CSC 394 — Software Projects** · DePaul University

<!-- Today: design the API so both sub-teams work in parallel. -->

---

## Recap & Agenda

**Weeks 1–2:** Requirements, stories, agile, roles

**Today:** API design (endpoints, errors, docs, contracts, tools)

<!-- The API turns user stories into working software. -->

---

## What is an API?

🍽️ **Menu** = API (what you can ask for)
👨‍🍳 **Kitchen** = backend (how it's made)
🧑‍💼 **Waiter** = HTTP (carries requests/responses)

> You read the menu, place an order, get food. That's an API.

<!-- A contract between software pieces. Read the menu, get food. -->

---

## REST Basics

- **Resources** = nouns: tasks, users, teams
- **HTTP methods** = verbs: GET, POST, PUT, DELETE
- **JSON** = data format
- **Stateless** — every request is self-contained

```
GET /api/tasks/42  →  { "id": 42, "title": "..." }
```

<!-- Everything is a resource with a URL. Act on it with HTTP methods. -->

---

## Why APIs Matter for Teams

No contract → frontend waits for backend 🚧

With contract → **both teams build in parallel** ✅

> Agree on the API → mock it → build independently → integrate

<!-- This doubles your throughput. Agree on shapes first, then split. -->

---

## Resources, Not Actions

❌ `GET /getTask` · `POST /createTask` · `POST /deleteTask`

✅ `GET /api/tasks/:id` · `POST /api/tasks` · `DELETE /api/tasks/:id`

**URL = noun. HTTP method = verb.**

<!-- Biggest beginner mistake: verbs in URLs. The method IS the verb. -->

---

## HTTP Methods

| Method | Purpose | Success Code |
|--------|---------|:------------:|
| **GET** | Read | `200 OK` |
| **POST** | Create | `201 Created` |
| **PUT** | Full replace | `200 OK` |
| **PATCH** | Partial update | `200 OK` |
| **DELETE** | Remove | `204 No Content` |

<!-- POST=201, DELETE=204. Use correct codes — any REST dev expects them. -->

---

## TaskBoard Endpoints

```
GET    /api/tasks          — list (filtered)
POST   /api/tasks          — create
GET    /api/tasks/:id      — read one
PATCH  /api/tasks/:id      — update fields
DELETE /api/tasks/:id      — delete

GET    /api/users/:id         — profile
GET    /api/teams/:id/members — team members
```

<!-- Full CRUD for tasks plus targeted user/team endpoints. -->

---

## Request: POST /api/tasks

```json
{
  "title": "Design the login page",
  "description": "Wireframe and implement HTML/CSS",
  "status": "todo",
  "priority": "high",
  "assigneeId": "user-123",
  "dueDate": "2025-02-14"
}
```

Client sends user data. Server generates `id`, `createdAt`.

<!-- No ID, no timestamps — those are the server's job. -->

---

## Response: 201 Created

```json
{
  "id": "task-789",
  "title": "Design the login page",
  "status": "todo",
  "priority": "high",
  "assigneeId": "user-123",
  "dueDate": "2025-02-14",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

Always return the full resource — frontend needs that `id`.

<!-- Echo back the object with server-generated fields. -->

---

## Paginated List Response

**`GET /api/tasks?page=1&limit=20`**

```json
{
  "data": [
    { "id": "task-1", "title": "Set up DB", "status": "done" },
    { "id": "task-2", "title": "Login page", "status": "todo" }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 47, "totalPages": 3 }
}
```

**Always paginate.** Never return unbounded lists.

<!-- Wrap arrays in "data" with pagination metadata from day one. -->

---

## Naming Conventions

✅ Plural nouns: `/api/tasks`
✅ Lowercase hyphens: `/api/team-members`
✅ Logical nesting: `/api/teams/:id/tasks`
✅ Consistent `/api/` prefix

❌ Verbs: `/api/getUsers`
❌ Deep nesting: `/teams/5/members/3/tasks/7`
❌ Mixed casing: `/Tasks` and `/users`

<!-- Consistency > which convention you pick. -->

---

## Filtering, Sorting, PUT vs PATCH

**Filters** use query params: `?status=todo&sort=dueDate&order=asc`

**PUT** — full replace (send everything):
```json
PUT /api/tasks/42
{ "title": "...", "description": "...", "status": "done" }
```
**PATCH** — partial update (send only changes):
```json
PATCH /api/tasks/42
{ "status": "done" }
```

> Use **PATCH** for most updates — simpler, safer.

<!-- PUT: omit a field and it's erased. PATCH: only touches what you send. -->

---

## Standardized Error Format

Without standards: `{"error":"bad"}` vs `{"msg":"nope"}` 😩

**Standard shape:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task title is required",
    "details": [{ "field": "title", "message": "1–200 chars" }]
  }
}
```

One format → one error handler for all endpoints ✅

<!-- Define once, use everywhere. "code" for logic, "message" for display. -->

---

## HTTP Error Codes

| Code | Meaning | TaskBoard Example |
|:----:|---------|-------------------|
| **400** | Bad Request | Malformed JSON |
| **401** | Unauthorized | Missing auth token |
| **403** | Forbidden | Editing another's task |
| **404** | Not Found | Task doesn't exist |
| **409** | Conflict | Duplicate team name |
| **422** | Unprocessable | Empty title, bad date |
| **500** | Server Error | Database down |

<!-- 401="who are you?" 403="you can't do that." Don't return 400 for everything. -->

---

## Validation (Express.js)

```javascript
app.post('/api/tasks', (req, res) => {
  const { title, status } = req.body;
  const errors = [];
  if (!title || !title.trim())
    errors.push({ field: 'title', message: 'Required' });
  if (status && !['todo','in-progress','done'].includes(status))
    errors.push({ field: 'status', message: 'Invalid' });
  if (errors.length)
    return res.status(422).json({
      error: { code: 'VALIDATION_ERROR', details: errors }
    });
  // ... create task
});
```

<!-- Collect ALL errors, return at once. Standard format. -->

---

## API Documentation

For every endpoint: **URL, method, description, auth, request body, response example, error codes.**

````markdown
## Create Task — `POST /api/tasks`
| Field       | Type   | Req? | Notes           |
|-------------|--------|------|-----------------|
| title       | string | ✅   | 1–200 chars     |
| description | string | No   | Max 2000 chars  |
| status      | string | No   | Default: "todo" |
| priority    | string | No   | low/medium/high |

**201:** `{ "id": "task-789", "title": "..." }`
````

<!-- Put in API.md. Markdown renders great on GitHub. Swagger/OpenAPI optional. -->

---

## Interface Contracts

Contract = agreed data shapes between frontend & backend.

> "I send this JSON → you respond with that JSON."

- Frontend builds with **mocks** matching the contract
- Backend builds **real logic** matching the contract
- Connect at integration ✅

<!-- The single source of truth both sides build to. -->

---

## Contract-First Workflow

```
1. 📝  Write API docs together (whole team)
2. ✅  Both sub-teams agree
3. 🎭  Frontend mocks  /  🔧  Backend builds
4. 🔗  Swap mocks → real API
5. 🧪  Test end-to-end
```

> **Do step 1 this week.** It unblocks everything.

<!-- Sit down, write API.md, agree, then split and build in parallel. -->

---

## Mock Data Example

```javascript
// src/mocks/tasks.js
const mockTasks = [
  { id: 'task-1', title: 'Set up repo',
    status: 'done', priority: 'high', assigneeId: 'user-1' },
  { id: 'task-2', title: 'Design schema',
    status: 'in-progress', priority: 'medium', assigneeId: 'user-2' }
];

export function getMockTasks(status) {
  return status ? mockTasks.filter(t => t.status === status) : mockTasks;
}
```

Shapes match the contract → swap to real API = minimal changes.

<!-- Frontend imports mocks while backend is built. Swap for fetch() when ready. -->

---

## API Testing Tools

| Tool | Type | Best For |
|------|------|----------|
| **Postman** | GUI | Visual testing, collections |
| **Thunder Client** | VS Code | Quick in-editor tests |
| **cURL** | CLI | Scripts, fast checks |

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Write tests", "priority": "high"}'
```

<!-- Postman or Thunder Client daily; cURL for terminal. -->

---

## VS Code Extensions & Tooling

| Extension | Purpose |
|-----------|---------|
| **ESLint** | Catch errors/style |
| **Prettier** | Auto-format |
| **GitLens** | Git blame inline |
| **Live Share** | Pair programming |
| **REST Client** | API from `.http` files |

Use **Husky** for Git hooks — lint before every commit.
Commit `.vscode/extensions.json` so the team matches.

<!-- Set up once, enforce forever. No more formatting debates. -->

---

## API Anti-Patterns 🚫

- Inconsistent naming (`/Tasks` vs `/users`)
- No error handling (stack traces to client)
- Exposing internals (password hashes)
- No input validation · No pagination
- God endpoints · `200` for errors

<!-- Check your API against this list before sprint demos. -->

---

## Key Takeaways

1. **API = contract** between frontend and backend
2. **Resources are nouns**, methods are verbs
3. **Standardize errors** — one format everywhere
4. **Document everything** — undocumented = nonexistent
5. **Contract first** — agree before coding

<!-- Five things to remember from today. -->

---

## Next Week & Homework

**Next week:** Databases, data modeling, connecting your API

**This week:**
- [ ] Draft team API docs (endpoints + shapes)
- [ ] Set up linting/formatting in your repo
- [ ] Test an endpoint with Postman or cURL
- [ ] Read your framework's routing docs

> **Start with the API contract.** Everything else follows.

<!-- Write API.md as a team — it unblocks all parallel work. -->
