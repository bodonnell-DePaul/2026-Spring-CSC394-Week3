// ---------------------------------------------------------------------------
// server.js — Entry point: starts the Express server
// ---------------------------------------------------------------------------

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ┌──────────────────────────────────────────────┐
  │  CSC 394 — API Demo Server                   │
  │  http://localhost:${PORT}                       │
  │                                               │
  │  Endpoints:                                   │
  │    GET    /api/students                       │
  │    GET    /api/students/:id                   │
  │    POST   /api/students                       │
  │    PATCH  /api/students/:id                   │
  │    DELETE /api/students/:id                   │
  │    GET    /api/groups                         │
  │    GET    /api/groups/:id                     │
  │    GET    /api/groups/:id/members             │
  │    GET    /api/health                         │
  │                                               │
  │  Frontend:  http://localhost:${PORT}             │
  └──────────────────────────────────────────────┘
  `);
});
