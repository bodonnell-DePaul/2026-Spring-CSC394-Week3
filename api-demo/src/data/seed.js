// ---------------------------------------------------------------------------
// seed.js — In-memory data store seeded from class roster
// ---------------------------------------------------------------------------
// This module provides the "database" for the demo. In a real app you'd use
// a proper database (PostgreSQL, MongoDB, etc.). We keep everything in memory
// so the demo has zero external dependencies.
// ---------------------------------------------------------------------------

const students = [
  { id: 'student-01', firstName: 'Wael Ahmed M', lastName: 'Alolowi', groupId: 'group-6', email: 'walolowi@depaul.edu', role: 'developer' },
  { id: 'student-02', firstName: 'Maya', lastName: 'Baghjajian', groupId: 'group-5', email: 'mbaghjajian@depaul.edu', role: 'developer' },
  { id: 'student-03', firstName: 'Sareena', lastName: 'Baig', groupId: 'group-6', email: 'sbaig@depaul.edu', role: 'developer' },
  { id: 'student-04', firstName: 'Omar', lastName: 'Cehic', groupId: 'group-2', email: 'ocehic@depaul.edu', role: 'developer' },
  { id: 'student-05', firstName: 'Ulger', lastName: 'Ceren', groupId: 'group-7', email: 'uceren@depaul.edu', role: 'developer' },
  { id: 'student-06', firstName: 'Isaiah', lastName: 'Chapoy', groupId: 'group-3', email: 'ichapoy@depaul.edu', role: 'scrum master' },
  { id: 'student-07', firstName: 'Armahn', lastName: 'Fantozzi', groupId: 'group-7', email: 'afantozzi@depaul.edu', role: 'developer' },
  { id: 'student-08', firstName: 'James', lastName: 'Fitzgerald', groupId: 'group-3', email: 'jfitzgerald@depaul.edu', role: 'developer' },
  { id: 'student-09', firstName: 'Jay', lastName: 'Gallegos', groupId: 'group-4', email: 'jgallegos@depaul.edu', role: 'developer' },
  { id: 'student-10', firstName: 'Marjan', lastName: 'Goglani', groupId: 'group-7', email: 'mgoglani@depaul.edu', role: 'developer' },
  { id: 'student-11', firstName: 'Vishwash', lastName: 'Golakiya', groupId: 'group-1', email: 'vgolakiya@depaul.edu', role: 'scrum master' },
  { id: 'student-12', firstName: 'Andrew', lastName: 'Huebner', groupId: 'group-5', email: 'ahuebner@depaul.edu', role: 'developer' },
  { id: 'student-13', firstName: 'Sage', lastName: 'Irfan', groupId: 'group-1', email: 'sirfan@depaul.edu', role: 'developer' },
  { id: 'student-14', firstName: 'Jonathan', lastName: 'Jacobson', groupId: 'group-5', email: 'jjacobson@depaul.edu', role: 'scrum master' },
  { id: 'student-15', firstName: 'Gabriela', lastName: 'Kuta', groupId: 'group-2', email: 'gkuta@depaul.edu', role: 'scrum master' },
  { id: 'student-16', firstName: 'Allie', lastName: 'Lackowski', groupId: 'group-7', email: 'alackowski@depaul.edu', role: 'scrum master' },
  { id: 'student-17', firstName: 'Alex', lastName: 'Le', groupId: 'group-3', email: 'ale@depaul.edu', role: 'developer' },
  { id: 'student-18', firstName: 'Jeff', lastName: 'Liggett', groupId: 'group-1', email: 'jliggett@depaul.edu', role: 'developer' },
  { id: 'student-19', firstName: 'Jade', lastName: 'Maitland-Cartwright', groupId: 'group-2', email: 'jmaitlandcartwright@depaul.edu', role: 'developer' },
  { id: 'student-20', firstName: 'Lincon', lastName: 'Medina', groupId: 'group-6', email: 'lmedina@depaul.edu', role: 'scrum master' },
  { id: 'student-21', firstName: 'Matthew', lastName: 'Muriel', groupId: 'group-2', email: 'mmuriel@depaul.edu', role: 'developer' },
  { id: 'student-22', firstName: 'Jacob', lastName: 'Myers', groupId: 'group-5', email: 'jmyers@depaul.edu', role: 'developer' },
  { id: 'student-23', firstName: 'Huy', lastName: 'Nguyen', groupId: 'group-4', email: 'hnguyen@depaul.edu', role: 'developer' },
  { id: 'student-24', firstName: 'Jeremy', lastName: 'Redd', groupId: 'group-1', email: 'jredd@depaul.edu', role: 'developer' },
  { id: 'student-25', firstName: 'Melaney', lastName: 'Sandoval', groupId: 'group-5', email: 'msandoval@depaul.edu', role: 'developer' },
  { id: 'student-26', firstName: 'Peter', lastName: 'Savinos', groupId: 'group-1', email: 'psavinos@depaul.edu', role: 'developer' },
  { id: 'student-27', firstName: 'Akshaj', lastName: 'Sriachutananda', groupId: 'group-3', email: 'asriachutananda@depaul.edu', role: 'developer' },
  { id: 'student-28', firstName: 'Peter', lastName: 'Teresi', groupId: 'group-6', email: 'pteresi@depaul.edu', role: 'developer' },
  { id: 'student-29', firstName: 'Cristian', lastName: 'Tovar', groupId: 'group-2', email: 'ctovar@depaul.edu', role: 'developer' },
  { id: 'student-30', firstName: 'Melissa', lastName: 'Vega', groupId: 'group-6', email: 'mvega@depaul.edu', role: 'developer' },
  { id: 'student-31', firstName: 'Katherine', lastName: 'Walsh', groupId: 'group-4', email: 'kwalsh@depaul.edu', role: 'scrum master' },
  { id: 'student-32', firstName: 'Alex', lastName: 'Zastawny', groupId: 'group-3', email: 'azastawny@depaul.edu', role: 'developer' },
  { id: 'student-33', firstName: 'Molly', lastName: 'Nagle', groupId: 'group-4', email: 'mnagle@depaul.edu', role: 'developer' },
  { id: 'student-34', firstName: 'Dylan', lastName: 'Shea', groupId: 'group-7', email: 'dshea@depaul.edu', role: 'developer' },
];

const groups = [
  { id: 'group-1', name: 'Group 1', project: 'TaskBoard', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'group-2', name: 'Group 2', project: 'RecipeShare', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'group-3', name: 'Group 3', project: 'StudyBuddy', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'group-4', name: 'Group 4', project: 'FitTracker', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'group-5', name: 'Group 5', project: 'CampusEvents', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'group-6', name: 'Group 6', project: 'BudgetBuddy', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'group-7', name: 'Group 7', project: 'PeerReview', createdAt: '2026-04-01T09:00:00Z' },
];

// Add timestamps to students
students.forEach((s) => {
  s.createdAt = '2026-04-01T09:00:00Z';
  s.updatedAt = '2026-04-01T09:00:00Z';
});

// ---------------------------------------------------------------------------
// Data-access helpers — thin layer so routes stay clean
// ---------------------------------------------------------------------------

let nextStudentNum = students.length + 1;

function getAllStudents() {
  return students;
}

function getStudentById(id) {
  return students.find((s) => s.id === id) || null;
}

function createStudent({ firstName, lastName, groupId, email, role }) {
  const id = `student-${String(nextStudentNum++).padStart(2, '0')}`;
  const now = new Date().toISOString();
  const student = {
    id,
    firstName,
    lastName,
    groupId,
    email: email || null,
    role: role || 'developer',
    createdAt: now,
    updatedAt: now,
  };
  students.push(student);
  return student;
}

function updateStudent(id, fields) {
  const student = students.find((s) => s.id === id);
  if (!student) return null;
  const allowed = ['firstName', 'lastName', 'groupId', 'email', 'role'];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      student[key] = fields[key];
    }
  }
  student.updatedAt = new Date().toISOString();
  return student;
}

function deleteStudent(id) {
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  students.splice(idx, 1);
  return true;
}

function getAllGroups() {
  return groups;
}

function getGroupById(id) {
  return groups.find((g) => g.id === id) || null;
}

function getGroupMembers(groupId) {
  return students.filter((s) => s.groupId === groupId);
}

// Reset for testing — restores original data
function resetData() {
  students.length = 0;
  students.push(
    { id: 'student-01', firstName: 'Wael Ahmed M', lastName: 'Alolowi', groupId: 'group-6', email: 'walolowi@depaul.edu', role: 'developer', createdAt: '2026-04-01T09:00:00Z', updatedAt: '2026-04-01T09:00:00Z' },
    { id: 'student-02', firstName: 'Maya', lastName: 'Baghjajian', groupId: 'group-5', email: 'mbaghjajian@depaul.edu', role: 'developer', createdAt: '2026-04-01T09:00:00Z', updatedAt: '2026-04-01T09:00:00Z' },
    { id: 'student-03', firstName: 'Sareena', lastName: 'Baig', groupId: 'group-6', email: 'sbaig@depaul.edu', role: 'developer', createdAt: '2026-04-01T09:00:00Z', updatedAt: '2026-04-01T09:00:00Z' },
    { id: 'student-04', firstName: 'Omar', lastName: 'Cehic', groupId: 'group-2', email: 'ocehic@depaul.edu', role: 'developer', createdAt: '2026-04-01T09:00:00Z', updatedAt: '2026-04-01T09:00:00Z' },
    { id: 'student-05', firstName: 'Ulger', lastName: 'Ceren', groupId: 'group-7', email: 'uceren@depaul.edu', role: 'developer', createdAt: '2026-04-01T09:00:00Z', updatedAt: '2026-04-01T09:00:00Z' },
  );
  nextStudentNum = 6;
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllGroups,
  getGroupById,
  getGroupMembers,
  resetData,
};
