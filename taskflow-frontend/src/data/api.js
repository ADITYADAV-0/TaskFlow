import { seedUsers, seedProjects, seedTasks, seedComments } from "./mockData";

// ---------------------------------------------------------------------------
// This module simulates the back end described in the Week 1 architecture
// report (REST endpoints under /api/..., JWT auth, Postgres-backed data).
// Swapping this file for real `fetch` calls to that API is the only change
// needed to connect the UI once the back end exists — every function here
// keeps the same name and shape it would have as a real API client.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "taskflow.db.v1";
const SESSION_KEY = "taskflow.session.v1";
const LATENCY = 260;

function delay(value, ms = LATENCY) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function loadDb() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through to reseed if storage is corrupted
    }
  }
  const fresh = {
    users: seedUsers,
    projects: seedProjects,
    tasks: seedTasks,
    comments: seedComments,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function uid(prefix) {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

// ---- Auth --------------------------------------------------------------

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function login({ email }) {
  const db = loadDb();
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    // Demo mode: unknown emails are provisioned on the fly so reviewers can
    // sign in with any address without a separate "create account" step.
    user = {
      id: uid("u"),
      name: email.split("@")[0].replace(/[._]/g, " "),
      email,
      initials: email.slice(0, 2).toUpperCase(),
    };
    db.users.push(user);
    saveDb(db);
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return delay(user);
}

export async function logout() {
  localStorage.removeItem(SESSION_KEY);
  return delay(true);
}

// ---- Projects ------------------------------------------------------------

export async function getProjects(userId) {
  const db = loadDb();
  const projects = userId ? db.projects.filter((p) => p.memberIds.includes(userId)) : db.projects;
  return delay(projects.map(withProjectStats(db)));
}

export async function getProject(projectId) {
  const db = loadDb();
  const project = db.projects.find((p) => p.id === projectId);
  return delay(project ? withProjectStats(db)(project) : null);
}

export async function createProject({ name, description, ownerId }) {
  const db = loadDb();
  const project = {
    id: uid("p"),
    name,
    description,
    ownerId,
    memberIds: [ownerId],
    createdAt: new Date().toISOString().slice(0, 10),
  };
  db.projects.unshift(project);
  saveDb(db);
  return delay(withProjectStats(db)(project));
}

function withProjectStats(db) {
  return (project) => {
    const tasks = db.tasks.filter((t) => t.projectId === project.id);
    const done = tasks.filter((t) => t.status === "done").length;
    return {
      ...project,
      members: db.users.filter((u) => project.memberIds.includes(u.id)),
      taskCount: tasks.length,
      doneCount: done,
    };
  };
}

// ---- Tasks -----------------------------------------------------------

export async function getTasksByProject(projectId) {
  const db = loadDb();
  const tasks = db.tasks
    .filter((t) => t.projectId === projectId)
    .map((t) => hydrateTask(db, t));
  return delay(tasks);
}

export async function getTask(taskId) {
  const db = loadDb();
  const task = db.tasks.find((t) => t.id === taskId);
  return delay(task ? hydrateTask(db, task) : null);
}

function hydrateTask(db, task) {
  return {
    ...task,
    assignee: db.users.find((u) => u.id === task.assigneeId) || null,
    comments: db.comments
      .filter((c) => c.taskId === task.id)
      .map((c) => ({ ...c, user: db.users.find((u) => u.id === c.userId) }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
  };
}

export async function createTask(projectId, { title, description, priority, assigneeId, dueDate }) {
  const db = loadDb();
  const task = {
    id: uid("t"),
    projectId,
    title,
    description: description || "",
    status: "todo",
    priority: priority || "medium",
    assigneeId: assigneeId || null,
    dueDate: dueDate || null,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  db.tasks.push(task);
  saveDb(db);
  return delay(hydrateTask(db, task));
}

export async function updateTaskStatus(taskId, status) {
  const db = loadDb();
  const task = db.tasks.find((t) => t.id === taskId);
  if (task) {
    task.status = status;
    saveDb(db);
  }
  return delay(task ? hydrateTask(db, task) : null);
}

export async function updateTask(taskId, patch) {
  const db = loadDb();
  const task = db.tasks.find((t) => t.id === taskId);
  if (task) {
    Object.assign(task, patch);
    saveDb(db);
  }
  return delay(task ? hydrateTask(db, task) : null);
}

// ---- Comments --------------------------------------------------------

export async function addComment(taskId, { userId, content }) {
  const db = loadDb();
  const comment = { id: uid("c"), taskId, userId, content, createdAt: new Date().toISOString() };
  db.comments.push(comment);
  saveDb(db);
  const task = db.tasks.find((t) => t.id === taskId);
  return delay(hydrateTask(db, task));
}

// ---- Users -------------------------------------------------------------

export async function getUsers() {
  const db = loadDb();
  return delay(db.users);
}
