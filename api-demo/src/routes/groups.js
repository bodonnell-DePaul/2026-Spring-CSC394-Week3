// ---------------------------------------------------------------------------
// routes/groups.js — Read-only endpoints for the Groups resource
// ---------------------------------------------------------------------------
// Demonstrates nested resources: /api/groups/:id/members
// ---------------------------------------------------------------------------

const express = require('express');
const router = express.Router();
const db = require('../data/seed');

// ---- GET /api/groups — list all groups ------------------------------------

router.get('/', (req, res) => {
  const groups = db.getAllGroups().map((g) => {
    const members = db.getGroupMembers(g.id);
    return {
      ...g,
      memberCount: members.length,
    };
  });
  res.json({ data: groups });
});

// ---- GET /api/groups/:id — single group -----------------------------------

router.get('/:id', (req, res) => {
  const group = db.getGroupById(req.params.id);
  if (!group) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Group with id '${req.params.id}' not found`,
      },
    });
  }
  const members = db.getGroupMembers(group.id);
  res.json({ ...group, memberCount: members.length });
});

// ---- GET /api/groups/:id/members — nested resource: group members ---------

router.get('/:id/members', (req, res) => {
  const group = db.getGroupById(req.params.id);
  if (!group) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Group with id '${req.params.id}' not found`,
      },
    });
  }
  const members = db.getGroupMembers(group.id);
  res.json({
    data: members,
    pagination: {
      page: 1,
      perPage: members.length,
      total: members.length,
      totalPages: 1,
    },
  });
});

module.exports = router;
