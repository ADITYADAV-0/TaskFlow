# TaskFlow — Front End

A collaborative team task & project management web app. This is the **Week 2
(Front-End Application Development)** deliverable for the Junior Full Stack
Developer Internship — it builds the UI on top of the plan from the Week 1
report (project brief, wireframes, architecture, database schema).

> The back end doesn't exist yet (that's a later week), so this app talks to
> a small simulated API (`src/data/api.js`) instead of a real server. It has
> the same function names and shapes the real REST client will have, so
> swapping it out later is a drop-in change, not a rewrite.

## Views

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing | Public marketing page introducing TaskFlow |
| `/login` | Login | Sign in (demo auth — see below) |
| `/dashboard` | Dashboard | Lists the current user's projects; search + create new project |
| `/projects/:projectId` | Board | Kanban board for one project (drag-and-drop + accessible move buttons, add task) |
| `/tasks/:taskId` | Task Detail | Full task view: status/assignee/priority/due date, description, comment thread |
| `*` | Not Found | 404 fallback |

Dashboard, Board, and Task Detail are behind a route guard (`ProtectedRoute`)
and redirect to `/login` if you're not signed in.

## Demo login

This build has no real back end, so **any email/password combination signs
you in** — the form only checks that the email looks valid and the password
is at least 4 characters. Two ways to try it:

- Sign in as **`jane@taskflow.dev`** (any password) to see the three seeded
  projects (Website Relaunch, Mobile App v2, Q4 Marketing Campaign) with
  their tasks and comments already populated.
- Sign in with any other email to get a fresh account with an empty
  dashboard, and create your own project from there.

Data is kept in `localStorage`, so it persists across page reloads but is
local to your browser — clearing site data resets it back to the seed set.

## Getting started

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build, output in dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  main.jsx                # React entry point
  App.jsx                 # Route table
  context/
    AuthContext.jsx        # Current user + login/logout, backed by the mock API
  data/
    mockData.js             # Seed users/projects/tasks/comments (mirrors the Week 1 DB schema)
    api.js                   # Simulated REST client (async, artificial latency, localStorage-backed)
  components/
    AppShell.jsx / .module.css     # Topbar + responsive sidebar layout for authenticated pages
    ProtectedRoute.jsx             # Redirects to /login when not authenticated
    ProjectCard.jsx / .module.css  # Project summary card used on the dashboard
    TaskCard.jsx / .module.css     # Task card used on the Kanban board
    Column.jsx / .module.css       # A single Kanban column (drag target)
    Avatar.jsx / .module.css       # Initials avatar, deterministic color per name
  pages/
    Landing.jsx / .module.css
    Login.jsx / .module.css
    Dashboard.jsx / .module.css
    Board.jsx / .module.css
    TaskDetail.jsx / .module.css
    NotFound.jsx
  hooks/
    useFormattedDate.js     # formatDate() / isOverdue() helpers
  styles/
    tokens.css               # Design tokens (color, type, space, motion) as CSS variables
    global.css                # Reset, base typography, shared .btn/.badge/.card/.form-field classes
```

## Development process

1. **Started from the Week 1 architecture.** The database schema in that
   report (Users, Projects, ProjectMembers, Tasks, Comments) became the
   shape of `mockData.js`, and the REST endpoint table became the function
   signatures in `api.js`. Building the front end against that contract
   first meant the UI and the eventual back end agree on data shape before
   either is finished.
2. **Built the simulated API before any component.** `api.js` wraps every
   read/write in a `Promise` with ~250ms of artificial latency, so every
   page already handles loading and error states the way it will have to
   against a real network call — that discipline is easy to skip if the
   first "backend" you build against is instant and synchronous.
3. **Wireframes → pages.** Each of the four wireframes from Week 1 (login,
   dashboard, board, task detail) maps directly to one page component, so
   the structure agreed on during planning stayed the source of truth
   during implementation instead of drifting.
4. **Layered the app shell once, reused it everywhere.** `AppShell` (topbar
   + sidebar) is a single React Router *layout route* that all three
   authenticated pages render inside of via `<Outlet />`, instead of each
   page re-implementing navigation.
5. **Accessibility pass.** Drag-and-drop alone excludes keyboard and
   screen-reader users, so every task card also has explicit "move to
   previous/next column" buttons that do the same status update. Added a
   skip-to-content link, landmark elements (`header`/`nav`/`main`/`aside`),
   visible focus rings, `aria-label`s on icon-only controls, and a
   `prefers-reduced-motion` override.
6. **Responsive pass.** Sidebar collapses into a slide-out drawer under
   860px; the dashboard grid and task-detail two-column layout collapse to
   a single column on narrow screens; the Kanban board scrolls horizontally
   with scroll-snap on mobile instead of squeezing four columns into one
   screen.

## Design decisions & patterns

- **Design tokens, not hard-coded values.** All color, spacing, radius, and
  type-scale values live in `styles/tokens.css` as CSS custom properties.
  Every component references the token, never a literal hex code — so the
  whole app's look can be re-themed from one file.
- **CSS Modules per component**, plus a small set of shared utility classes
  (`.btn`, `.badge`, `.card`, `.form-field`) in `global.css` for patterns
  repeated across many components. This keeps component styles scoped and
  avoids a global class-name collision problem as the app grows.
- **Context for auth, props for everything else.** `AuthContext` is the one
  piece of state genuinely needed across unrelated parts of the tree
  (topbar, route guard, comment authorship). Project/task data is fetched
  per-page instead of hoisted into a global store, since nothing outside a
  given page currently needs it — this keeps the data flow easy to follow
  without reaching for a state-management library the app doesn't need yet.
- **Optimistic updates with rollback.** Moving a task on the board updates
  local state immediately and calls the (simulated) API in the background;
  if that call ever fails, the board re-fetches from the source of truth
  rather than leaving the UI in a state the "server" disagrees with.
- **Status is a closed set**, matching the Week 1 schema decision: `todo` →
  `in_progress` → `review` → `done`, enforced by a `<select>` and by the
  move buttons' bounds — never a free-text field.

## Known limitations (by design, for this stage)

- No real back end — see `src/data/api.js` for the seam where one plugs in.
- No automated tests yet (would add React Testing Library for component
  tests and Playwright for the login → create project → move task flow).
- Comment editing/deleting, file attachments, and real-time sync (Socket.io,
  per the Week 1 architecture) are intentionally out of scope for this
  front-end-only week and are called out as next steps in the Week 1 report.
