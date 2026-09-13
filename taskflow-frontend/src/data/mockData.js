// Seed data shaped after the Week 1 database schema (Users, Projects,
// ProjectMembers, Tasks, Comments). This stands in for the back end until
// the real API (see Week 1 report, Section 8) is wired up.

export const seedUsers = [
  { id: "u1", name: "Jane Duarte", email: "jane@taskflow.dev", initials: "JD" },
  { id: "u2", name: "Alex Chen", email: "alex@taskflow.dev", initials: "AC" },
  { id: "u3", name: "Priya Nair", email: "priya@taskflow.dev", initials: "PN" },
  { id: "u4", name: "Sam Okafor", email: "sam@taskflow.dev", initials: "SO" },
];

export const seedProjects = [
  {
    id: "p1",
    name: "Website Relaunch",
    description: "Redesign the marketing site and migrate content to the new CMS.",
    ownerId: "u1",
    memberIds: ["u1", "u2", "u3"],
    createdAt: "2026-08-02",
  },
  {
    id: "p2",
    name: "Mobile App v2",
    description: "Ship offline mode and the new onboarding flow for the mobile app.",
    ownerId: "u2",
    memberIds: ["u1", "u2", "u4"],
    createdAt: "2026-08-10",
  },
  {
    id: "p3",
    name: "Q4 Marketing Campaign",
    description: "Plan and execute the Q4 product launch campaign across channels.",
    ownerId: "u3",
    memberIds: ["u1", "u3"],
    createdAt: "2026-08-20",
  },
];

const STATUSES = ["todo", "in_progress", "review", "done"];

export const seedTasks = [
  {
    id: "t1",
    projectId: "p1",
    title: "Audit existing site content",
    description: "Go through every page on the current site and tag content as keep, rewrite, or retire.",
    status: "done",
    priority: "medium",
    assigneeId: "u3",
    dueDate: "2026-08-12",
    createdAt: "2026-08-03",
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Design new homepage layout",
    description: "Explore two directions for the homepage hero and navigation, then converge on one.",
    status: "review",
    priority: "high",
    assigneeId: "u2",
    dueDate: "2026-09-05",
    createdAt: "2026-08-04",
  },
  {
    id: "t3",
    projectId: "p1",
    title: "Build responsive nav component",
    description: "Implement the header navigation with a mobile drawer and keyboard support.",
    status: "in_progress",
    priority: "high",
    assigneeId: "u1",
    dueDate: "2026-09-10",
    createdAt: "2026-08-06",
  },
  {
    id: "t4",
    projectId: "p1",
    title: "Migrate blog posts to new CMS",
    description: "Export posts from the old CMS and import them, checking formatting on the way in.",
    status: "todo",
    priority: "medium",
    assigneeId: "u3",
    dueDate: "2026-09-18",
    createdAt: "2026-08-07",
  },
  {
    id: "t5",
    projectId: "p1",
    title: "Set up analytics on new pages",
    description: "Wire up page-view and event tracking to match the current dashboard's metrics.",
    status: "todo",
    priority: "low",
    assigneeId: null,
    dueDate: "2026-09-25",
    createdAt: "2026-08-09",
  },
  {
    id: "t6",
    projectId: "p2",
    title: "Design offline sync indicator",
    description: "Show users clearly when the app is working from a cached copy of their data.",
    status: "in_progress",
    priority: "medium",
    assigneeId: "u4",
    dueDate: "2026-09-08",
    createdAt: "2026-08-11",
  },
  {
    id: "t7",
    projectId: "p2",
    title: "Rewrite onboarding copy",
    description: "Tighten the three onboarding screens down to one clear action each.",
    status: "todo",
    priority: "high",
    assigneeId: "u2",
    dueDate: "2026-09-14",
    createdAt: "2026-08-12",
  },
  {
    id: "t8",
    projectId: "p2",
    title: "Implement local cache layer",
    description: "Add an on-device store so the last-loaded project data survives a lost connection.",
    status: "review",
    priority: "high",
    assigneeId: "u1",
    dueDate: "2026-09-02",
    createdAt: "2026-08-13",
  },
  {
    id: "t9",
    projectId: "p3",
    title: "Draft launch announcement email",
    description: "Write the email sequence announcing the Q4 launch to the existing customer list.",
    status: "todo",
    priority: "medium",
    assigneeId: "u3",
    dueDate: "2026-10-01",
    createdAt: "2026-08-21",
  },
  {
    id: "t10",
    projectId: "p3",
    title: "Book paid social placements",
    description: "Confirm ad slots and budgets across the two platforms we're running this quarter.",
    status: "done",
    priority: "low",
    assigneeId: "u1",
    dueDate: "2026-08-30",
    createdAt: "2026-08-22",
  },
];

export const seedComments = [
  {
    id: "c1",
    taskId: "t3",
    userId: "u2",
    content: "Started on this, will push a draft by end of day.",
    createdAt: "2026-09-01T10:15:00Z",
  },
  {
    id: "c2",
    taskId: "t3",
    userId: "u1",
    content: "Sounds good — flag me if the mobile breakpoint gives you trouble.",
    createdAt: "2026-09-01T11:02:00Z",
  },
  {
    id: "c3",
    taskId: "t2",
    userId: "u3",
    content: "Direction B tested better with the two people we showed it to. Leaning that way.",
    createdAt: "2026-08-30T09:40:00Z",
  },
];

export const STATUS_COLUMNS = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "review", label: "In Review" },
  { key: "done", label: "Done" },
];

export { STATUSES };
