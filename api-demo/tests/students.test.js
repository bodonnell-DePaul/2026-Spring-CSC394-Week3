// ---------------------------------------------------------------------------
// tests/students.test.js — Full test suite for the Students API
// ---------------------------------------------------------------------------
// Covers every REST principle from the lecture:
//   ✅ GET list with pagination, filtering, sorting, search
//   ✅ GET single resource (200 + 404)
//   ✅ POST create with validation (201 + 422)
//   ✅ PATCH partial update (200 + 404 + 422)
//   ✅ DELETE (204 + 404)
//   ✅ Standardized error format
// ---------------------------------------------------------------------------

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/data/seed');

beforeEach(() => {
  db.resetData();
});

// ============================================================================
// GET /api/students — List
// ============================================================================
describe('GET /api/students', () => {
  it('returns paginated list of students', async () => {
    const res = await request(app).get('/api/students');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toHaveProperty('page');
    expect(res.body.pagination).toHaveProperty('perPage');
    expect(res.body.pagination).toHaveProperty('total');
    expect(res.body.pagination).toHaveProperty('totalPages');
  });

  it('respects perPage parameter', async () => {
    const res = await request(app).get('/api/students?perPage=2');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.perPage).toBe(2);
    expect(res.body.pagination.totalPages).toBeGreaterThan(1);
  });

  it('respects page parameter', async () => {
    const page1 = await request(app).get('/api/students?perPage=2&page=1');
    const page2 = await request(app).get('/api/students?perPage=2&page=2');
    expect(page1.body.data[0].id).not.toBe(page2.body.data[0].id);
    expect(page1.body.pagination.page).toBe(1);
    expect(page2.body.pagination.page).toBe(2);
  });

  it('caps perPage at 100', async () => {
    const res = await request(app).get('/api/students?perPage=999');
    expect(res.body.pagination.perPage).toBe(100);
  });

  it('filters by groupId', async () => {
    const res = await request(app).get('/api/students?groupId=group-6');
    expect(res.status).toBe(200);
    res.body.data.forEach((s) => {
      expect(s.groupId).toBe('group-6');
    });
  });

  it('filters by role', async () => {
    // Add a scrum master to the reset data
    db.createStudent({
      firstName: 'Test',
      lastName: 'SM',
      groupId: 'group-6',
      role: 'scrum master',
    });
    const res = await request(app).get('/api/students?role=scrum master');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((s) => {
      expect(s.role).toBe('scrum master');
    });
  });

  it('searches by name (case-insensitive)', async () => {
    const res = await request(app).get('/api/students?search=omar');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(
      res.body.data.some((s) => s.firstName.toLowerCase().includes('omar'))
    ).toBe(true);
  });

  it('sorts by firstName ascending', async () => {
    const res = await request(app).get('/api/students?sort=firstName&order=asc');
    const names = res.body.data.map((s) => s.firstName);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  it('sorts descending when order=desc', async () => {
    const res = await request(app).get('/api/students?sort=lastName&order=desc');
    const names = res.body.data.map((s) => s.lastName);
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  it('defaults to sorting by lastName', async () => {
    const res = await request(app).get('/api/students');
    const names = res.body.data.map((s) => s.lastName);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  it('returns empty array when filter matches nothing', async () => {
    const res = await request(app).get('/api/students?search=zzzzzzz');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.total).toBe(0);
  });
});

// ============================================================================
// GET /api/students/:id — Single student
// ============================================================================
describe('GET /api/students/:id', () => {
  it('returns a student by id', async () => {
    const res = await request(app).get('/api/students/student-01');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('student-01');
    expect(res.body).toHaveProperty('firstName');
    expect(res.body).toHaveProperty('lastName');
    expect(res.body).toHaveProperty('groupId');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('role');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');
  });

  it('returns 404 for non-existent student', async () => {
    const res = await request(app).get('/api/students/student-999');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.message).toContain('student-999');
  });
});

// ============================================================================
// POST /api/students — Create
// ============================================================================
describe('POST /api/students', () => {
  it('creates a student and returns 201', async () => {
    const newStudent = {
      firstName: 'Jane',
      lastName: 'Doe',
      groupId: 'group-6',
      email: 'jdoe@depaul.edu',
      role: 'developer',
    };
    const res = await request(app).post('/api/students').send(newStudent);
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe('Jane');
    expect(res.body.lastName).toBe('Doe');
    expect(res.body.groupId).toBe('group-6');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');
  });

  it('assigns default role "developer" when not provided', async () => {
    const res = await request(app).post('/api/students').send({
      firstName: 'No',
      lastName: 'Role',
      groupId: 'group-7',
    });
    expect(res.status).toBe(201);
    expect(res.body.role).toBe('developer');
  });

  it('returns 422 when firstName is missing', async () => {
    const res = await request(app).post('/api/students').send({
      lastName: 'NoFirst',
      groupId: 'group-1',
    });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'firstName' }),
      ])
    );
  });

  it('returns 422 when lastName is missing', async () => {
    const res = await request(app).post('/api/students').send({
      firstName: 'NoLast',
      groupId: 'group-1',
    });
    expect(res.status).toBe(422);
    expect(res.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'lastName' }),
      ])
    );
  });

  it('returns 422 when groupId is missing', async () => {
    const res = await request(app).post('/api/students').send({
      firstName: 'No',
      lastName: 'Group',
    });
    expect(res.status).toBe(422);
    expect(res.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'groupId' }),
      ])
    );
  });

  it('returns 422 when groupId does not exist', async () => {
    const res = await request(app).post('/api/students').send({
      firstName: 'Bad',
      lastName: 'Group',
      groupId: 'group-99',
    });
    expect(res.status).toBe(422);
    expect(res.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'groupId',
          message: expect.stringContaining('group-99'),
        }),
      ])
    );
  });

  it('returns 422 for invalid role', async () => {
    const res = await request(app).post('/api/students').send({
      firstName: 'Bad',
      lastName: 'Role',
      groupId: 'group-1',
      role: 'wizard',
    });
    expect(res.status).toBe(422);
    expect(res.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'role' }),
      ])
    );
  });

  it('returns 422 for invalid email format', async () => {
    const res = await request(app).post('/api/students').send({
      firstName: 'Bad',
      lastName: 'Email',
      groupId: 'group-1',
      email: 'not-an-email',
    });
    expect(res.status).toBe(422);
    expect(res.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' }),
      ])
    );
  });

  it('collects ALL validation errors at once', async () => {
    const res = await request(app).post('/api/students').send({
      role: 'wizard',
      email: 'bad',
    });
    expect(res.status).toBe(422);
    // Should have errors for firstName, lastName, groupId, role, and email
    expect(res.body.error.details.length).toBeGreaterThanOrEqual(4);
  });

  it('trims whitespace from names', async () => {
    const res = await request(app).post('/api/students').send({
      firstName: '  Padded  ',
      lastName: '  Name  ',
      groupId: 'group-1',
    });
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe('Padded');
    expect(res.body.lastName).toBe('Name');
  });
});

// ============================================================================
// PATCH /api/students/:id — Update
// ============================================================================
describe('PATCH /api/students/:id', () => {
  it('partially updates a student', async () => {
    const res = await request(app)
      .patch('/api/students/student-01')
      .send({ role: 'scrum master' });
    expect(res.status).toBe(200);
    expect(res.body.role).toBe('scrum master');
    expect(res.body.id).toBe('student-01');
    // Other fields unchanged
    expect(res.body.firstName).toBe('Wael Ahmed M');
  });

  it('updates updatedAt timestamp', async () => {
    const before = await request(app).get('/api/students/student-01');
    const res = await request(app)
      .patch('/api/students/student-01')
      .send({ role: 'scrum master' });
    expect(res.body.updatedAt).not.toBe(before.body.updatedAt);
  });

  it('returns 404 for non-existent student', async () => {
    const res = await request(app)
      .patch('/api/students/student-999')
      .send({ role: 'developer' });
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns 422 for invalid role', async () => {
    const res = await request(app)
      .patch('/api/students/student-01')
      .send({ role: 'wizard' });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns 422 for empty firstName', async () => {
    const res = await request(app)
      .patch('/api/students/student-01')
      .send({ firstName: '' });
    expect(res.status).toBe(422);
    expect(res.body.error.details[0].field).toBe('firstName');
  });

  it('returns 422 for non-existent groupId', async () => {
    const res = await request(app)
      .patch('/api/students/student-01')
      .send({ groupId: 'group-99' });
    expect(res.status).toBe(422);
    expect(res.body.error.details[0].field).toBe('groupId');
  });
});

// ============================================================================
// DELETE /api/students/:id — Delete
// ============================================================================
describe('DELETE /api/students/:id', () => {
  it('deletes a student and returns 204', async () => {
    const res = await request(app).delete('/api/students/student-05');
    expect(res.status).toBe(204);
    expect(res.text).toBe('');

    // Confirm it's gone
    const check = await request(app).get('/api/students/student-05');
    expect(check.status).toBe(404);
  });

  it('returns 404 for non-existent student', async () => {
    const res = await request(app).delete('/api/students/student-999');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

// ============================================================================
// 404 for unknown routes
// ============================================================================
describe('Unknown routes', () => {
  it('returns 404 with standard error format', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
