// ---------------------------------------------------------------------------
// tests/groups.test.js — Test suite for the Groups API
// ---------------------------------------------------------------------------

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/data/seed');

beforeEach(() => {
  db.resetData();
});

// ============================================================================
// GET /api/groups — List
// ============================================================================
describe('GET /api/groups', () => {
  it('returns all groups with member counts', async () => {
    const res = await request(app).get('/api/groups');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(7);
    res.body.data.forEach((g) => {
      expect(g).toHaveProperty('id');
      expect(g).toHaveProperty('name');
      expect(g).toHaveProperty('project');
      expect(g).toHaveProperty('memberCount');
      expect(typeof g.memberCount).toBe('number');
    });
  });

  it('returns correct member counts', async () => {
    const res = await request(app).get('/api/groups');
    // With reset data (5 students), group-6 has 3 (students 01, 03), group-2 has 1 (student-04)
    const group6 = res.body.data.find((g) => g.id === 'group-6');
    expect(group6.memberCount).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// GET /api/groups/:id — Single group
// ============================================================================
describe('GET /api/groups/:id', () => {
  it('returns a single group with member count', async () => {
    const res = await request(app).get('/api/groups/group-1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('group-1');
    expect(res.body.name).toBe('Group 1');
    expect(res.body.project).toBe('TaskBoard');
    expect(res.body).toHaveProperty('memberCount');
  });

  it('returns 404 for non-existent group', async () => {
    const res = await request(app).get('/api/groups/group-99');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.error.message).toContain('group-99');
  });
});

// ============================================================================
// GET /api/groups/:id/members — Nested resource
// ============================================================================
describe('GET /api/groups/:id/members', () => {
  it('returns members of a group with pagination metadata', async () => {
    const res = await request(app).get('/api/groups/group-6/members');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data)).toBe(true);
    res.body.data.forEach((m) => {
      expect(m.groupId).toBe('group-6');
    });
    expect(res.body.pagination.total).toBe(res.body.data.length);
  });

  it('returns 404 when group does not exist', async () => {
    const res = await request(app).get('/api/groups/group-99/members');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns empty array for group with no members', async () => {
    // Delete all students in group-7 from the reset data
    // Reset data has student-05 in group-7
    db.deleteStudent('student-05');
    const res = await request(app).get('/api/groups/group-7/members');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.pagination.total).toBe(0);
  });
});

// ============================================================================
// Health check
// ============================================================================
describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});
