# 🗺️ Travel CRM — Full Project Restructure Plan

**Based on:** Discovery questionnaire answers  
**Project:** Travel CRM (Bookings, Travelers, Contacts, Analytics)  
**Stack:** React 19 + Vite + TypeScript | Node.js 22 + Express 4 + Mongoose | MongoDB Atlas  
**Deployment:** Vercel (frontend) + Render (backend)  

> **Strategy:** Methodical, phase-by-phase. No big-bang rewrites. The core logic in controllers and pages is kept — only the *organization* changes.

---

## 📊 What's Wrong Today (Summary)

| Problem | Impact |
|---|---|
| Root folder named `CRM 3.0` (space in name) | Breaks shell scripts and CI/CD |
| Backend folder named `travel-crm-backend` | Verbose, inconsistent with `frontend/` |
| `migration script/` has a space in the name | Breaks scripts, hard to `cd` into |
| No `shared/` package for TypeScript types | Frontend and backend types drift apart |
| Cron jobs have no dedicated folder | Hard to find, easy to lose |
| Socket.io + SSE handlers likely mixed into `server.ts` | Makes `server.ts` a god file |
| No ESLint on backend (only frontend) | TypeScript code quality is unchecked |
| No `.env.example` files confirmed | New developers guess what vars are needed |
| No CI/CD pipeline | No automated checks on pull requests |
| No tests anywhere | Regressions are invisible |
| WordPress PHP snippets have no clear home | Scattered, likely in root or docs |

---

## 🎯 Target Structure (Full Picture)

```
travel-crm/                        ← rename root from "CRM 3.0"
├── frontend/                      ← keep name
├── backend/                       ← rename from "travel-crm-backend"
├── shared/                        ← NEW: shared TypeScript types
├── scripts/                       ← rename from "migration script"
├── docs/                          ← keep
├── integrations/                  ← NEW: WordPress PHP snippets go here
├── .github/
│   └── workflows/
│       └── ci.yml                 ← NEW: GitHub Actions CI
├── .gitignore                     ← ensure .env is listed
├── .env.example                   ← NEW at root level
├── vercel.json
└── package.json                   ← monorepo scripts
```

---

### 🖥️ Backend Target Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts            ← MongoDB connection logic
│   │   ├── env.ts                 ← validated + typed env vars (use Zod)
│   │   └── constants.ts           ← app-wide magic values
│   │
│   ├── controllers/               ← HTTP handlers only, no business logic
│   │   ├── auth.controller.ts
│   │   ├── booking.controller.ts
│   │   ├── user.controller.ts
│   │   ├── analytics.controller.ts
│   │   └── traveler.controller.ts
│   │
│   ├── services/                  ← business logic (called by controllers)
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   ├── user.service.ts
│   │   └── analytics.service.ts
│   │
│   ├── models/                    ← Mongoose schemas + models
│   │   ├── Booking.model.ts
│   │   ├── User.model.ts
│   │   ├── Traveler.model.ts
│   │   └── Contact.model.ts
│   │
│   ├── routes/
│   │   ├── index.ts               ← aggregates all routers → app.use('/api', router)
│   │   ├── auth.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── user.routes.ts
│   │   ├── analytics.routes.ts
│   │   └── traveler.routes.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts     ← JWT verification + req.user injection
│   │   ├── error.middleware.ts    ← global Express error handler
│   │   ├── validate.middleware.ts ← Zod request validation wrapper
│   │   └── rateLimiter.middleware.ts
│   │
│   ├── sockets/                   ← Socket.io handlers (separate from server.ts)
│   │   ├── index.ts               ← initializes Socket.io, attaches to http server
│   │   └── booking.socket.ts      ← booking-specific socket events
│   │
│   ├── sse/
│   │   └── sse.handler.ts         ← SSE connection + event emitters
│   │
│   ├── jobs/                      ← cron jobs (follow-up, reminders, etc.)
│   │   ├── index.ts               ← registers all cron jobs
│   │   └── followUp.cron.ts
│   │
│   ├── utils/
│   │   ├── logger.ts              ← Winston/Pino logger (replace console.log)
│   │   ├── response.ts            ← standardized { success, data, message } helpers
│   │   └── asyncHandler.ts        ← wraps async controllers to catch errors
│   │
│   ├── types/
│   │   └── express.d.ts           ← extends Request to include req.user
│   │
│   └── server.ts                  ← thin: init express, attach middleware, start server
│
├── .env                           ← never commit
├── .env.example                   ← commit this
├── package.json
├── tsconfig.json
└── eslint.config.js               ← add ESLint to backend too
```

---

### ⚛️ Frontend Target Structure

```
frontend/
├── src/
│   ├── api/                       ← all Axios calls, grouped by resource
│   │   ├── client.ts              ← Axios instance (baseURL, interceptors, token attach)
│   │   ├── auth.api.ts
│   │   ├── booking.api.ts
│   │   ├── user.api.ts
│   │   └── analytics.api.ts
│   │
│   ├── assets/                    ← images, icons, fonts
│   │
│   ├── components/
│   │   ├── ui/                    ← base Radix UI wrappers (Button, Modal, Table, etc.)
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── DataTable.tsx      ← TanStack Table wrapper
│   │   └── layout/
│   │       ├── AppLayout.tsx      ← main authenticated layout shell
│   │       ├── Sidebar.tsx
│   │       ├── Navbar.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── features/                  ← colocated feature modules
│   │   ├── auth/
│   │   │   ├── components/        ← LoginForm, etc.
│   │   │   ├── hooks/             ← useLogin, useLogout
│   │   │   └── index.ts
│   │   ├── bookings/
│   │   │   ├── components/        ← BookingCard, BookingForm, TravelerList
│   │   │   ├── hooks/             ← useBookings, useBookingDetail
│   │   │   └── index.ts
│   │   ├── users/
│   │   ├── analytics/
│   │   ├── contacts/
│   │   └── settings/
│   │
│   ├── hooks/                     ← global/shared hooks
│   │   ├── useAuth.ts             ← reads auth state, provides user
│   │   └── useSocket.ts           ← Socket.io connection hook
│   │
│   ├── lib/
│   │   ├── queryClient.ts         ← TanStack Query global config
│   │   ├── router.tsx             ← React Router v6+ route definitions
│   │   └── schemas/               ← Zod validation schemas (form validation)
│   │       ├── booking.schema.ts
│   │       └── auth.schema.ts
│   │
│   ├── pages/                     ← thin route-level wrappers only
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── BookingsPage.tsx
│   │   ├── BookingDetailPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── types/                     ← frontend-only TS types
│   │   └── ui.types.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts          ← date, currency, name formatters
│   │   └── constants.ts
│   │
│   ├── App.tsx                    ← router + providers setup
│   └── main.tsx                   ← ReactDOM.createRoot, QueryClientProvider
│
├── public/
├── .env
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

---

### 🔗 Shared Package (New)

This solves your biggest pain point — shared types between frontend and backend.

```
shared/
├── src/
│   ├── types/
│   │   ├── booking.types.ts       ← IBooking, IBookingStatus, etc.
│   │   ├── user.types.ts          ← IUser, IRole, etc.
│   │   ├── traveler.types.ts
│   │   └── api.types.ts           ← ApiResponse<T>, PaginatedResponse<T>
│   └── index.ts                   ← re-exports everything
├── package.json                   ← name: "@travel-crm/shared"
└── tsconfig.json
```

**Both frontend and backend import from it:**
```typescript
// In backend controller
import { IBooking } from '@travel-crm/shared';

// In frontend api layer
import { ApiResponse, IBooking } from '@travel-crm/shared';
```

---

## 📋 Step-by-Step Migration Plan

> ⚠️ **Before starting:** Create a new Git branch: `git checkout -b refactor/project-structure`  
> Never do this on `main`. Work in phases. Each phase should be a separate commit.

---

### ✅ Phase 1 — Safe Renames & Root Cleanup
*Risk: Very Low | Time: ~30 minutes*

**Steps:**
1. Rename root folder `CRM 3.0` → `travel-crm` (remove space, lowercase)
2. Rename `travel-crm-backend/` → `backend/`
3. Rename `migration script/` → `scripts/`  (remove space from folder name)
4. Create `integrations/` folder and move WordPress PHP snippets into it
5. Update root `package.json` scripts to reflect new folder names:

```json
{
  "name": "travel-crm-monorepo",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "cd backend && npm install && npm run build",
    "start": "cd backend && npm run start",
    "install:all": "npm i && cd frontend && npm i && cd ../backend && npm i"
  }
}
```

6. Update `vercel.json` if it references old folder paths
7. Update Render deployment settings to point to `backend/` instead of `travel-crm-backend/`

**Commit message:** `refactor: rename folders and clean up root structure`

---

### ✅ Phase 2 — Environment Variable Hygiene
*Risk: Very Low | Time: ~20 minutes*

**Steps:**
1. Verify `.env` is in `.gitignore` for both `frontend/` and `backend/`
2. Run `git ls-files | grep ".env"` — if any `.env` file appears, remove it from git history immediately
3. Create `backend/.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```
4. Create `frontend/.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
5. Note: In Vite, env vars must be prefixed with `VITE_` to be accessible in the browser. Never put real secrets (JWT secret, DB password) in frontend `.env`.

**Commit message:** `chore: add .env.example files and verify .gitignore`

---

### ✅ Phase 3 — Backend Internal Structure
*Risk: Medium | Time: 2–4 hours*

Work inside `backend/src/`. The goal is to split `server.ts` and organize files into the folders defined above.

**Step 3a — Create the folder skeleton:**
```bash
mkdir -p backend/src/{config,controllers,services,models,routes,middleware,sockets,sse,jobs,utils,types}
```

**Step 3b — Extract from `server.ts`:**
`server.ts` currently holds too much. Extract each concern:

| What to extract | Where it goes |
|---|---|
| MongoDB connection | `config/database.ts` |
| Environment variable reads | `config/env.ts` |
| Socket.io initialization | `sockets/index.ts` |
| SSE handler setup | `sse/sse.handler.ts` |
| Global error handler middleware | `middleware/error.middleware.ts` |
| JWT verify middleware | `middleware/auth.middleware.ts` |
| All `app.use('/api/...')` route mounts | `routes/index.ts` |

**Step 3c — `server.ts` after cleanup should look like:**
```typescript
import express from 'express';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { router } from './routes';
import { errorMiddleware } from './middleware/error.middleware';
import { initSockets } from './sockets';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use('/api', router);
app.use(errorMiddleware);

initSockets(server);
connectDatabase();

server.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
```

**Step 3d — Create `utils/asyncHandler.ts`:**
```typescript
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
```
Wrap every async controller with this — eliminates `try/catch` in every controller.

**Step 3e — Create `utils/response.ts`:**
```typescript
export const successResponse = <T>(data: T, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string, errors?: unknown) => ({
  success: false,
  message,
  errors,
});
```

**Step 3f — Add ESLint to backend:**
```bash
cd backend && npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Commit message:** `refactor(backend): extract server.ts concerns into dedicated modules`

---

### ✅ Phase 4 — Frontend Internal Structure
*Risk: Medium | Time: 2–4 hours*

**Step 4a — Create the folder skeleton:**
```bash
mkdir -p frontend/src/{api,features,hooks,lib/schemas,pages,types,utils}
mkdir -p frontend/src/components/{ui,layout}
mkdir -p frontend/src/features/{auth,bookings,users,analytics,contacts,settings}/{components,hooks}
```

**Step 4b — Create `api/client.ts` (centralized Axios instance):**
```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or from memory/cookie
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // redirect to login
    }
    return Promise.reject(err);
  }
);
```

**Step 4c — Move API calls:**
Any `axios.get('/api/bookings')` scattered in components → move to `api/booking.api.ts`

**Step 4d — Colocate features:**
For each of the 11 views, identify:
- Components that belong to only that feature → move to `features/<name>/components/`
- TanStack Query hooks used only for that feature → move to `features/<name>/hooks/`
- Page wrapper stays thin in `pages/`

**Step 4e — Create `lib/router.tsx`:**
Move all React Router `<Route>` definitions out of `App.tsx` into `lib/router.tsx`. `App.tsx` should only be providers.

**Commit message:** `refactor(frontend): organize into features, api layer, and lib`

---

### ✅ Phase 5 — Shared Types Package
*Risk: Low | Time: 1–2 hours*

**Step 5a — Create `shared/package.json`:**
```json
{
  "name": "@travel-crm/shared",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

**Step 5b — Add to both frontend and backend `package.json`:**
```json
{
  "dependencies": {
    "@travel-crm/shared": "file:../shared"
  }
}
```

**Step 5c — Move duplicated types:**
Any interface that exists in both frontend and backend (e.g., `IBooking`, `IUser`, `ApiResponse<T>`) → move to `shared/src/types/`

**Commit message:** `feat: add shared types package`

---

### ✅ Phase 6 — Root `package.json` Scripts Overhaul
*Risk: Very Low | Time: ~15 minutes*

```json
{
  "name": "travel-crm-monorepo",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "lint": "cd frontend && npm run lint && cd ../backend && npm run lint",
    "install:all": "npm i && cd frontend && npm i && cd ../backend && npm i && cd ../shared && npm i",
    "start": "cd backend && npm run start"
  }
}
```

**Commit message:** `chore: update root monorepo scripts`

---

### ✅ Phase 7 — CI/CD (GitHub Actions)
*Risk: Very Low | Time: ~30 minutes*

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, CRM3.0]
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install all dependencies
        run: npm run install:all

      - name: Lint frontend
        run: cd frontend && npm run lint

      - name: Lint backend
        run: cd backend && npm run lint

      - name: Build frontend
        run: cd frontend && npm run build

      - name: Build backend
        run: cd backend && npm run build
```

**Commit message:** `ci: add GitHub Actions workflow for lint and build`

---

## 📁 Files That Need Updating After Restructure

| File | What to update |
|---|---|
| `vercel.json` | Confirm `rootDirectory` points to `frontend/` |
| Render dashboard | Update root directory to `backend/`, build command to `npm run build`, start to `npm run start` |
| `backend/tsconfig.json` | Confirm `outDir`, `rootDir` are correct after folder rename |
| `frontend/vite.config.ts` | Add proxy config for local dev (see below) |

**Vite dev proxy (eliminates CORS in development):**
```typescript
// frontend/vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true,
      },
    },
  },
});
```

---

## 🏁 Final Folder Summary (After All Phases)

```
travel-crm/
├── frontend/src/
│   ├── api/              ← all Axios calls
│   ├── components/ui/    ← Radix UI base components
│   ├── components/layout/← Sidebar, Navbar, AppLayout
│   ├── features/         ← auth, bookings, users, analytics, contacts, settings
│   ├── hooks/            ← useAuth, useSocket
│   ├── lib/              ← queryClient, router, zod schemas
│   ├── pages/            ← thin page wrappers (11 pages)
│   ├── types/
│   └── utils/
│
├── backend/src/
│   ├── config/           ← database, env, constants
│   ├── controllers/      ← HTTP handlers
│   ├── services/         ← business logic
│   ├── models/           ← Mongoose models
│   ├── routes/           ← Express routers
│   ├── middleware/        ← auth, error, validate, rateLimiter
│   ├── sockets/          ← Socket.io
│   ├── sse/              ← Server-Sent Events
│   ├── jobs/             ← cron jobs
│   ├── utils/            ← logger, response helpers, asyncHandler
│   └── types/            ← express.d.ts extensions
│
├── shared/src/types/     ← shared IBooking, IUser, ApiResponse<T>
├── scripts/              ← DB migration scripts
├── integrations/         ← WordPress PHP snippets
└── docs/
```

---

## ⚠️ Things NOT to Touch During Restructure

- Controller logic — keep it, just move the file
- Mongoose model schemas — keep, just move
- React page component JSX — keep, just move
- TanStack Query keys and fetchers — keep, just move to `features/<name>/hooks/`
- Socket.io event names — keep consistent, just move handler file

---

## 🔜 Recommended Next Steps (After Restructure)

1. **Add Zod validation to backend** — validate all incoming request bodies in middleware
2. **Add Vitest** to frontend for component tests
3. **Add Supertest** to backend for API endpoint tests
4. **Set up Winston** logger in backend (replace all `console.log`)
5. **Add Sentry** for error monitoring on both frontend and backend
