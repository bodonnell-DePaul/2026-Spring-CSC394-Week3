---
marp: true
theme: default
paginate: true
header: "CSC 394 — Week 3"
footer: "API Design and Documentation"
style: |
  section {
    font-size: 28px;
  }
  section.lead h1 {
    font-size: 48px;
  }
  section.lead h3 {
    font-size: 24px;
    color: #666;
  }
  table {
    font-size: 22px;
  }
  blockquote {
    border-left: 4px solid #0366d6;
    padding-left: 16px;
    color: #444;
    font-style: italic;
  }
  pre {
    font-size: 18px;
  }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# Week 3: API Design and Documentation

### CSC 394 · DePaul University

---

# Recap & Agenda

**Weeks 1–2:** Requirements, user stories, agile, roles

**Today:** API design — endpoints, errors, docs, contracts, tools

The API turns user stories into working software.

---

<!-- _class: lead -->

# What Is an API?

---

# The Restaurant Analogy

🍽️ **Menu** = API (what you can ask for)
👨‍🍳 **Kitchen** = Backend (how it's made)
🧑‍💼 **Waiter** = HTTP (carries requests and responses)

> You read the menu, place an order, get food. That's an API.

An **API** (Application Programming Interface) is a **contract between two pieces of software** — what you can ask for, in what format, and what you'll get back.

---

# REST Basics

REST (Representational State Transfer) — the dominant web API style:

- **Resources** = nouns: tasks, users, teams
- **HTTP methods** = verbs: GET, POST, PUT, DELETE
- **JSON** = standard data format
- **Stateless** — every request is self-contained

```
GET /api/tasks/42  →  { "id": 42, "title": "..." }
```

---

# Why APIs Matter for Teams

No contract → frontend **waits** for backend 🚧

With contract → **both teams build in parallel** ✅

> Agree on the API → mock it → build independently → integrate

You won't build frameworks from scratch — you'll use **Express.js**, **Flask**, **Django REST**, etc.

---

# 💬 Discussion

> Your backend won't be ready until Week 6. Without an API contract, what happens to frontend devs during Weeks 3–6?

---

<!-- _class: lead -->

# Designing Your Endpoints

---

# Think in Resources

List your **data entities** before writing any endpoints.

**TaskBoard resources:** Tasks, Users, Teams, Labels, Comments

Each gets a base URL:
- `/api/tasks`
- `/api/users`
- `/api/teams`

---

# Resources, Not Actions

❌ `GET /getTask` · `POST /createTask` · `POST /deleteTask`

✅ `GET /api/tasks/:id` · `POST /api/tasks` · `DELETE /api/tasks/:id`

**URL = noun. HTTP method = verb.**

---

# HTTP Methods

| Method | Purpose | Success Code |
|--------|---------|:------------:|
| **GET** | Read | `200 OK` |
| **POST** | Create | `201 Created` |
| **PUT** | Full replace | `200 OK` |
| **PATCH** | Partial update | `200 OK` |
| **DELETE** | Remove | `204 No Content` |

`PATCH` updates only included fields — more practical than `PUT` for most projects.

---

# TaskBoard Endpoints — Tasks

```
GET    /api/tasks              — list (with filtering)
POST   /api/tasks              — create
GET    /api/tasks/:id          — read one
PATCH  /api/tasks/:id          — update fields
DELETE /api/tasks/:id          — delete
PATCH  /api/tasks/:id/status   — change status
GET    /api/tasks/:id/comments — list comments
POST   /api/tasks/:id/comments — add comment
```

---

# TaskBoard Endpoints — Auth, Users, Teams

**Auth & Users:**
```
POST /api/auth/register       — sign up
POST /api/auth/login          — log in
GET  /api/users/me            — current user
GET  /api/users/:id           — user profile
```

**Teams:**
```
GET    /api/teams              — user's teams
POST   /api/teams              — create team
POST   /api/teams/:id/members  — add member
DELETE /api/teams/:id/members/:userId — remove member
```

---

# Request: POST /api/tasks

```json
{
  "title": "Set up project repository",
  "description": "Initialize GitHub repo with README and .gitignore",
  "assigneeId": "user-123",
  "priority": "high",
  "dueDate": "2025-04-15",
  "labels": ["setup", "sprint-1"]
}
```

Client sends user data. Server generates `id`, `createdAt`, `updatedAt`.

---

# Response: 201 Created

```json
{
  "id": "task-456",
  "title": "Set up project repository",
  "description": "Initialize GitHub repo with README and .gitignore",
  "status": "todo",
  "assignee": { "id": "user-123", "name": "Alice Chen" },
  "priority": "high",
  "dueDate": "2025-04-15",
  "labels": ["setup", "sprint-1"],
  "createdAt": "2025-04-01T10:30:00Z",
  "updatedAt": "2025-04-01T10:30:00Z"
}
```

Notice: request sends `assigneeId` → response expands to full `assignee` object. Dates use ISO 8601.

---

# Paginated List Response

**`GET /api/tasks?status=in-progress&assignee=user-123&sort=dueDate`**

```json
{
  "data": [
    { "id": "task-456", "title": "Set up project repository",
      "status": "in-progress", "priority": "high" }
  ],
  "pagination": {
    "page": 1, "perPage": 20, "total": 47, "totalPages": 3
  }
}
```

**Always paginate.** Never return unbounded lists.

---

# Naming Conventions

| Rule | Good ✅ | Bad ❌ |
|------|---------|--------|
| Plural nouns | `/api/tasks` | `/api/task` |
| Consistent casing | `/task-comments` OR `/taskComments` | Mixing both |
| Logical nesting | `/tasks/:id/comments` | `/task-comments?taskId=42` |
| No verbs in URLs | `POST /api/tasks` | `POST /api/createTask` |
| Consistent prefix | `/api/...` | Some with, some without |

> Consistency matters more than which convention you pick.

---

# Filtering, Sorting, Pagination

Standard query parameter patterns:

```
Pagination:  ?page=2&perPage=20
Filtering:   ?status=done&priority=high
Sorting:     ?sort=createdAt&order=desc
```

**Never return unbounded results.**

---

# PUT vs PATCH

**PUT** — full replace (send everything):
```json
PUT /api/tasks/42
{ "title": "...", "description": "...", "status": "done",
  "priority": "high", "assigneeId": "user-1" }
```

**PATCH** — partial update (send only changes):
```json
PATCH /api/tasks/42
{ "status": "done" }
```

> Use **PATCH** for most updates — simpler, safer.
> With PUT, omit a field and it's erased.

---

# 💬 Discussion

> Your project is a recipe-sharing app. What are your resources?

**Sketch 5–6 REST endpoints.**

---

<!-- _class: lead -->

# Error Handling in APIs

---

# Standardized Error Format

Without standards: `{"error":"bad"}` vs `{"msg":"nope"}` 😩

**Use one consistent shape:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "title", "message": "Title is required" },
      { "field": "priority", "message": "Must be: low, medium, high" }
    ]
  }
}
```

`code` for logic, `message` for display, `details` for validation.

---

# HTTP Error Codes

| Code | Meaning | TaskBoard Example |
|:----:|---------|-------------------|
| **400** | Bad Request | Malformed JSON |
| **401** | Unauthorized | Missing auth token |
| **403** | Forbidden | Editing another team's task |
| **404** | Not Found | Task doesn't exist |
| **409** | Conflict | Duplicate team name |
| **422** | Unprocessable | Empty title, invalid priority |
| **500** | Server Error | Database down |

`4xx` = client's fault. `5xx` = server bug. Never intentionally return `500`.

---

# 401 vs 403

**401 Unauthorized** = "Who are you?" (no/invalid token)

**403 Forbidden** = "I know who you are, but you can't do that."

Don't return `400` for everything.

---

# Validation in Code (Express.js)

```javascript
app.post('/api/tasks', (req, res) => {
  const { title, status, priority } = req.body;
  const errors = [];

  if (!title || !title.trim())
    errors.push({ field: 'title', message: 'Required' });
  if (title && title.length > 200)
    errors.push({ field: 'title', message: '200 chars max' });
  if (priority && !['low','medium','high'].includes(priority))
    errors.push({ field: 'priority', message: 'Invalid value' });

  if (errors.length)
    return res.status(422).json({
      error: { code: 'VALIDATION_ERROR', details: errors }
    });

  // ... create task
});
```

Key: collect **all** errors before responding. Standard format.

---

# Validation Best Practices

- Collect **all** errors before responding (don't stop at the first one)
- Wrap database calls in `try/catch`
- **Never** expose stack traces in responses
- Return clean, user-friendly error messages

---

# 💬 Discussion

> A user submits a task with no title, invalid priority "urgent", and due date "next Tuesday". Your API returns all three errors at once.

**Why is this better than returning one error at a time?**

---

<!-- _class: lead -->

# Documenting Your API

---

# What to Document per Endpoint

For every endpoint, document:

- **Method and URL**
- **Description** of what it does
- **Auth requirements**
- **Request body** — fields, types, required/optional
- **Response body** with example
- **Error responses**

---

# Markdown API Docs (Recommended)

````markdown
## Create Task — `POST /api/tasks`
Auth required

| Field       | Type   | Req? | Notes           |
|-------------|--------|------|-----------------|
| title       | string | ✅   | 1–200 chars     |
| description | string | No   | Max 2000 chars  |
| assigneeId  | string | No   | User ID         |
| priority    | string | No   | low/medium/high |
| dueDate     | string | No   | ISO 8601 date   |
| labels      | string[]| No  | Label names     |

**201:** `{ "id": "task-789", "title": "..." }`
**Errors:** 401 Unauthorized · 422 Validation
````

Put in **`/docs/api.md`** — renders great on GitHub.

---

# Swagger / OpenAPI (Brief)

Industry standard for API docs using YAML:

- Auto-generates interactive documentation
- Can generate client SDKs
- Machine-readable

For this course: **Markdown is sufficient.** Swagger is optional bonus.

> Documentation nobody can find doesn't exist.

---

# 💬 Discussion

> A backend dev adds a new field to a response but doesn't update the docs.

**What problems does this cause for the frontend dev? For a new team member?**

---

<!-- _class: lead -->

# Interface Contracts and Mock Data

---

# What Is an Interface Contract?

An **exact agreement** between frontend and backend about:

- Every **field name**
- Every **data type**
- Every **value constraint**

…in every request and response.

It's API docs made **precise and actionable**.

> "I send this JSON → you respond with that JSON."

---

# Contract-First Workflow

```
1. 📝  Write API docs together (whole team)
2. ✅  Both sub-teams agree on shapes
3. 🎭  Frontend builds with mocks
4. 🔧  Backend builds real logic
5. 🔗  Swap mocks → real API calls
6. 🧪  Test end-to-end
```

Without contract: frontend waits → ships late.
With contract: both build simultaneously → ships on time.

> **Do step 1 this week.** It unblocks everything.

---

# Mock Data Example

```javascript
// src/mocks/tasks.js
export const mockTasks = [
  {
    id: "task-001", title: "Set up project repository",
    status: "done",
    assignee: { id: "user-001", name: "Alice Chen" },
    priority: "high", dueDate: "2025-04-15",
    labels: ["setup"],
    createdAt: "2025-04-01T10:30:00Z",
    updatedAt: "2025-04-02T14:00:00Z"
  },
  {
    id: "task-002", title: "Design database schema",
    status: "in-progress",
    assignee: { id: "user-002", name: "Bob Martinez" },
    priority: "high", dueDate: "2025-04-18",
    labels: ["backend", "sprint-1"],
    createdAt: "2025-04-01T11:00:00Z",
    updatedAt: "2025-04-03T09:15:00Z"
  }
];
```

---

# Mock Data with Filtering

```javascript
export function getMockTasks(filters = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...mockTasks];
      if (filters.status)
        result = result.filter(t => t.status === filters.status);
      resolve({
        data: result,
        pagination: {
          page: 1, perPage: 20,
          total: result.length, totalPages: 1
        }
      });
    }, 300); // simulate network delay
  });
}
```

**Mock data must match the contract exactly** — same field names, nesting, types. When you swap in real API calls, frontend code doesn't change.

---

# 💬 Discussion

> Backend returns `assignedTo` instead of `assignee`.

**What breaks? Who is responsible?**

---

<!-- _class: lead -->

# Software Engineering Tools

---

# API Testing Tools

Don't rely on the frontend UI to test backend routes.

| Tool | Type | Best For |
|------|------|----------|
| **Postman** | GUI app | Visual testing, saved collections |
| **Thunder Client** | VS Code ext | Quick in-editor tests |
| **cURL** | CLI | Scripts, fast checks |

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "New task", "priority": "high"}'
```

---

# VS Code Extensions

| Extension | Purpose |
|-----------|---------|
| **ESLint** | Catch errors and style issues |
| **Prettier** | Auto-format on save |
| **GitLens** | Git blame inline |
| **Live Share** | Real-time pair programming |
| **Thunder Client** / **REST Client** | API testing |

Commit `.vscode/extensions.json` so the whole team matches.

---

# Linters and Formatters

Five people editing the same codebase = merge conflicts over style. Set up once:

**`.eslintrc.json`:**
```json
{
  "env": { "node": true, "es2021": true },
  "extends": ["eslint:recommended"],
  "rules": { "no-unused-vars": "warn", "no-console": "off" }
}
```

**`.prettierrc`:**
```json
{ "semi": true, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5" }
```

---

# Git Hooks with Husky

Pre-commit hooks run the linter **before every commit**:

```bash
npm install --save-dev husky
npx husky init
echo "npx eslint . --fix" > .husky/pre-commit
```

Set up once, enforce forever. No more formatting debates.

---

<!-- _class: lead -->

# Common API Design Mistakes

---

# Anti-Patterns to Avoid 🚫

| Mistake | Fix |
|---------|-----|
| Inconsistent naming (`/Tasks` vs `/users`) | Pick one convention, stick to it |
| No error handling (stack traces to client) | Standardized error format |
| Exposing internals (password hashes, SQL errors) | Clean error messages only |
| No input validation (accept garbage → crash) | Validate all fields, return `422` |
| God endpoints (one URL, 15 behaviors) | Separate endpoints per operation |
| No pagination (10,000 records at once) | Always paginate list endpoints |
| Wrong HTTP semantics (`POST` for everything) | Right method, right status code |
| `200 OK` with `{"error": "broke"}` | Use proper HTTP status codes |

---

<!-- _class: lead -->

# Key Takeaways

---

# Five Principles

1. **API = contract** between frontend and backend
2. **Resources are nouns**, HTTP methods are verbs
3. **Standardize errors** — one format everywhere
4. **Document everything** — undocumented = nonexistent
5. **Contract first** — agree on shapes before coding

---

# This Week's Deliverables

| Task | Owner |
|------|-------|
| Draft team API docs (endpoints + shapes) | Whole team |
| Set up ESLint/Prettier in your repo | Tech Lead |
| Test an endpoint with Postman or cURL | Backend Lead |
| Read your framework's routing docs | Everyone |
| Create mock data for frontend | Frontend Lead |

> **Start with the API contract.** Everything else follows.

---

# Next Week

### Week 4 — Databases and Data Modeling

Design the database schema for TaskBoard — relational tables, entity relationships (tasks → users → teams), and how the schema connects to the API endpoints designed today.
