// ---------------------------------------------------------------------------
// routes/students.js — CRUD endpoints for the Students resource
// ---------------------------------------------------------------------------
// Demonstrates every REST principle from the Week 3 lecture:
//   • Resources as nouns (✅ /api/students, ❌ /api/getStudents)
//   • Correct HTTP methods and status codes
//   • Pagination, filtering, and sorting via query params
//   • Input validation that collects ALL errors before responding
//   • Standardized error format: { error: { code, message, details? } }
// ---------------------------------------------------------------------------

const express = require('express');
const router = express.Router();
const db = require('../data/seed');

// ---- Helpers ---------------------------------------------------------------

const VALID_ROLES = ['developer', 'scrum master', 'product owner', 'designer'];
const SORTABLE_FIELDS = ['firstName', 'lastName', 'groupId', 'role', 'createdAt'];

function paginate(array, page, perPage) {
  const total = array.length;
  const totalPages = Math.ceil(total / perPage) || 1;
  const start = (page - 1) * perPage;
  const data = array.slice(start, start + perPage);
  return { data, pagination: { page, perPage, total, totalPages } };
}

// ---- GET /api/students — list with filtering, sorting, pagination ----------

router.get('/', (req, res) => {
  let result = db.getAllStudents();

  // Filtering
  if (req.query.groupId) {
    result = result.filter((s) => s.groupId === req.query.groupId);
  }
  if (req.query.role) {
    result = result.filter((s) => s.role === req.query.role);
  }
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q))
    );
  }

  // Sorting
  const sortField = SORTABLE_FIELDS.includes(req.query.sort)
    ? req.query.sort
    : 'lastName';
  const order = req.query.order === 'desc' ? -1 : 1;
  result = [...result].sort((a, b) => {
    if (a[sortField] < b[sortField]) return -1 * order;
    if (a[sortField] > b[sortField]) return 1 * order;
    return 0;
  });

  // Pagination
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(req.query.perPage) || 20));

  res.json(paginate(result, page, perPage));
});

// ---- GET /api/students/:id — single student --------------------------------

router.get('/:id', (req, res) => {
  const student = db.getStudentById(req.params.id);
  if (!student) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Student with id '${req.params.id}' not found`,
      },
    });
  }
  res.json(student);
});

// ---- POST /api/students — create a new student ----------------------------

router.post('/', (req, res) => {
  const { firstName, lastName, groupId, email, role } = req.body;
  const errors = [];

  // Validate required fields
  if (!firstName || !firstName.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }
  if (firstName && firstName.length > 100) {
    errors.push({ field: 'firstName', message: 'First name must be 100 characters or less' });
  }
  if (!lastName || !lastName.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }
  if (lastName && lastName.length > 100) {
    errors.push({ field: 'lastName', message: 'Last name must be 100 characters or less' });
  }
  if (!groupId || !groupId.trim()) {
    errors.push({ field: 'groupId', message: 'Group ID is required' });
  }
  if (groupId && !db.getGroupById(groupId)) {
    errors.push({ field: 'groupId', message: `Group '${groupId}' does not exist` });
  }
  if (role && !VALID_ROLES.includes(role)) {
    errors.push({
      field: 'role',
      message: `Role must be one of: ${VALID_ROLES.join(', ')}`,
    });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (errors.length > 0) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: errors,
      },
    });
  }

  const student = db.createStudent({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    groupId,
    email: email || null,
    role: role || 'developer',
  });

  res.status(201).json(student);
});

// ---- PATCH /api/students/:id — partial update -----------------------------

router.patch('/:id', (req, res) => {
  const existing = db.getStudentById(req.params.id);
  if (!existing) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Student with id '${req.params.id}' not found`,
      },
    });
  }

  const { firstName, lastName, groupId, email, role } = req.body;
  const errors = [];

  if (firstName !== undefined && (!firstName || !firstName.trim())) {
    errors.push({ field: 'firstName', message: 'First name cannot be empty' });
  }
  if (firstName && firstName.length > 100) {
    errors.push({ field: 'firstName', message: 'First name must be 100 characters or less' });
  }
  if (lastName !== undefined && (!lastName || !lastName.trim())) {
    errors.push({ field: 'lastName', message: 'Last name cannot be empty' });
  }
  if (lastName && lastName.length > 100) {
    errors.push({ field: 'lastName', message: 'Last name must be 100 characters or less' });
  }
  if (groupId !== undefined && !db.getGroupById(groupId)) {
    errors.push({ field: 'groupId', message: `Group '${groupId}' does not exist` });
  }
  if (role !== undefined && !VALID_ROLES.includes(role)) {
    errors.push({
      field: 'role',
      message: `Role must be one of: ${VALID_ROLES.join(', ')}`,
    });
  }
  if (email !== undefined && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (errors.length > 0) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: errors,
      },
    });
  }

  const updated = db.updateStudent(req.params.id, req.body);
  res.json(updated);
});

// ---- DELETE /api/students/:id — remove a student ---------------------------

router.delete('/:id', (req, res) => {
  const deleted = db.deleteStudent(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Student with id '${req.params.id}' not found`,
      },
    });
  }
  res.status(204).send();
});

module.exports = router;
