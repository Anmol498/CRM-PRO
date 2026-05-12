# 🤖 Travel CRM — AI Agent Fix Instructions

**Project:** Travel CRM monorepo  
**Stack:** React 19 + Vite + TypeScript | Node.js 22 + Express 4 + Mongoose  
**Repo root:** `travel-crm/`

---

## ⚠️ Agent Rules — Read Before Starting

1. Work through sections **in order**. Section 1 must be fully complete before Section 2.
2. After completing Section 1, run `cd frontend && npm run build` — it must exit with **0 errors** before proceeding.
3. Use **exact file paths** as written. Do not guess paths.
4. When a task says **"search for and replace"**, scan the entire file for the pattern before replacing.
5. When a task says **"add after line X"**, find that exact line first.
6. Every code block is the **complete replacement** unless stated otherwise.
7. After all sections are done, run both build commands one final time to confirm clean builds.
8. Do **not** attempt to run `git filter-repo` or modify git history — that is a manual step listed in Section 4.

---

## 🚨 SECTION 1 — BLOCKING: Fix Broken Deployments

These errors are preventing any deployment. Fix these first.

---

### Task 1.1 — Fix Render: `tsup: not found` (exit code 127)

**Problem:** Render runs `npm install` in production mode which skips `devDependencies`. `tsup` is in `devDependencies` so it never gets installed, and the build script fails.

**File:** `backend/package.json`

**Command to run:**
```bash
cd backend && npm install tsup --save
```

This moves `tsup` from `devDependencies` to `dependencies` so Render's plain `npm install` picks it up.

**Verify:** `backend/package.json` now has `"tsup"` listed under `"dependencies"`, not `"devDependencies"`.

---

### Task 1.2 — Fix Vercel: `vercel.json` build order

**Problem:** Vercel only runs `npm install` inside `frontend/`. It never installs the `shared/` package, so `@travel-crm/shared` resolves to an empty module and all TypeScript types collapse — causing every `TS2339: Property X does not exist` error in the build logs.

**File:** `vercel.json` (repo root)

**Replace the entire file contents with:**
```json
{
  "buildCommand": "cd shared && npm install && cd ../frontend && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "echo 'deps handled in buildCommand'"
}
```

**Verify:** File saved at repo root as `vercel.json`.

---

### Task 1.3 — Fix Vercel: `zod` not found in shared package

**Problem:** `shared/schemas.ts` imports from `zod` but `zod` is not installed inside the `shared/` package. This causes `TS2307: Cannot find module 'zod'`.

**Commands to run:**
```bash
cd shared && npm install zod
```

**Verify:** `shared/package.json` now lists `"zod"` under `"dependencies"`.

---

### Task 1.4 — Fix Vercel: `token` does not exist on `AuthContextType`

**Problem:** After the auth refactor, `token` was removed from `AuthContextType` but `MainLayout.tsx` still destructures and uses it. This causes `TS2339: Property 'token' does not exist on type 'AuthContextType'`.

**File:** `frontend/src/components/layout/MainLayout.tsx`

**Step A — Search for this pattern anywhere in the file:**
```typescript
const { token
```
or
```typescript
token,
```
(as part of a destructure from `useAuth()` or context)

**Step B — Remove `token` from the destructure.** Example: if you find:
```typescript
const { user, token, logout } = useAuth();
```
Change it to:
```typescript
const { user, logout } = useAuth();
```

**Step C — Search for any standalone usage of the `token` variable in the same file** (e.g. `token &&`, `if (token)`, `headers: { token }`) and remove those lines entirely. The cookie is sent automatically — the frontend does not need to read the token.

**Step D — Search all other frontend files for the same pattern.** Run a project-wide search for:
```
token from useAuth
```
and
```
const { token
```
and remove `token` from any other auth context destructures across the codebase.

**Verify:** No file in `frontend/src/` references `token` as a destructured property from `useAuth()` or auth context.

---

### Task 1.5 — Verify Frontend Builds Clean

**Command to run:**
```bash
cd frontend && npm run build
```

**Expected:** Build exits with code 0, no TypeScript errors.

**If you still see `TS2339` errors after Tasks 1.2–1.4:** The remaining property errors (e.g. `flightTo`, `departureTime`, `returnDepartureTime`) are caused by shared types not resolving. Check `shared/src/types/booking.types.ts` and confirm each missing property is declared in the interface. Add any missing properties with their correct TypeScript types.

---

### Task 1.6 — Verify Backend Builds Clean

**Command to run:**
```bash
cd backend && npm run build
```

**Expected:** Build exits with code 0, `dist/` folder is populated.

---

## 🔐 SECTION 2 — CRITICAL: Security Fixes

All of these must be done before the app goes to production.

---

### Task 2.1 — Add `.env` to `.gitignore`

**Problem:** The `.env` file containing `MONGODB_URI`, `JWT_SECRET`, and `EXTERNAL_API_KEY` was committed to the git repository. This is a confirmed credential leak.

**File 1:** `backend/.gitignore`

**Add these lines** if not already present:
```
.env
.env.local
.env.production
*.env
```

**File 2:** Root `.gitignore` (repo root)

**Add these lines** if not already present:
```
.env
.env.local
.env.production
*.env
frontend/.env
backend/.env
```

**File 3:** `frontend/.gitignore`

**Add these lines** if not already present:
```
.env
.env.local
.env.production
*.env
```

> ⚠️ **Note for developer (not agent):** Adding to `.gitignore` stops future commits but does NOT remove the credentials from git history. See Section 4 for the required manual git history cleanup and credential rotation steps.

---

### Task 2.2 — Install and Configure `helmet`

**Problem:** No HTTP security headers are set. This leaves the app vulnerable to XSS, clickjacking, MIME sniffing and other browser-level attacks.

**Command to run:**
```bash
cd backend && npm install helmet
cd backend && npm install --save-dev @types/helmet
```

**File:** `backend/src/server.ts`

**Find the line where express and middleware are imported** (top of file). Add this import:
```typescript
import helmet from 'helmet';
```

**Find the line `app.use(express.json())` or the first `app.use(...)` call.**

**Add helmet directly before it:**
```typescript
app.use(helmet());
app.use(express.json());
```

**Verify:** `helmet` appears in imports and is called before any other middleware.

---

### Task 2.3 — Fix CORS: Replace `*` with Environment-Driven Allowlist

**Problem:** CORS is set to `*` (allow all origins). Any website can make authenticated requests to your API.

**File:** `backend/src/server.ts` (or wherever CORS is configured — search for `cors(` in the backend `src/` folder)

**Find the current CORS setup.** It will look something like:
```typescript
app.use(cors());
// or
app.use(cors({ origin: '*' }));
// or
app.use(cors({ origin: true }));
```

**Replace it entirely with:**
```typescript
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
```

**File:** `backend/.env.example`

**Add this line** if not already present:
```
FRONTEND_URL=https://your-app.vercel.app
```

**File:** `backend/.env` (your actual env file, do not commit)

**Add or update:**
```
FRONTEND_URL=https://your-actual-vercel-domain.vercel.app
```

**Verify:** CORS no longer uses `*`. The `FRONTEND_URL` env var controls allowed origins.

---

### Task 2.4 — Add Rate Limiting to Login Endpoint

**Problem:** No brute-force protection on the login endpoint. Unlimited password guessing is possible.

**Command to run:**
```bash
cd backend && npm install express-rate-limit
```

**Create new file:** `backend/src/middleware/rateLimiter.middleware.ts`

```typescript
import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

**File:** `backend/src/server.ts`

**Add this import:**
```typescript
import { globalRateLimiter } from './middleware/rateLimiter.middleware';
```

**After `app.use(helmet())`, add:**
```typescript
app.use(globalRateLimiter);
```

**File:** Find the auth routes file. It will be one of:
- `backend/src/routes/auth.routes.ts`
- `backend/src/routes/authRoutes.ts`

**Add this import at the top:**
```typescript
import { loginRateLimiter } from '../middleware/rateLimiter.middleware';
```

**Find the login route definition.** It will look like:
```typescript
router.post('/login', authController.login);
```

**Replace with:**
```typescript
router.post('/login', loginRateLimiter, authController.login);
```

**Verify:** Login route has `loginRateLimiter` as middleware. Global rate limiter is registered in `server.ts`.

---

### Task 2.5 — Move JWT from `localStorage` to HTTP-only Cookie (Backend)

**Problem:** JWT stored in `localStorage` is readable by any JavaScript on the page (XSS vulnerability). Tokens expire in 30 days with no revocation. Cookie approach eliminates both risks.

#### Step A — Install cookie-parser

**Command to run:**
```bash
cd backend && npm install cookie-parser
cd backend && npm install --save-dev @types/cookie-parser
```

#### Step B — Register cookie-parser in server.ts

**File:** `backend/src/server.ts`

**Add import:**
```typescript
import cookieParser from 'cookie-parser';
```

**Add after `app.use(express.json())`:**
```typescript
app.use(cookieParser());
```

#### Step C — Update login controller to set cookie

**File:** Find the auth controller. It will be one of:
- `backend/src/controllers/auth.controller.ts`
- `backend/src/controllers/authController.ts`

**Find the login function.** It currently returns the JWT token in the response body, something like:
```typescript
res.json({ success: true, token, user });
// or
res.json({ token });
```

**Replace the response line with:**
```typescript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
res.json({ success: true, user });
```

> Note: `token` is removed from the JSON body. The cookie carries it. Only `user` (safe user object, no password) is returned.

#### Step D — Update logout controller to clear cookie

**In the same auth controller file**, find the logout function. Add cookie clearing:
```typescript
res.clearCookie('token', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});
res.json({ success: true });
```

#### Step E — Update auth middleware to read from cookie

**File:** Find the auth middleware. It will be one of:
- `backend/src/middleware/auth.middleware.ts`
- `backend/src/middleware/auth.ts`
- `backend/src/middleware/protect.ts`

**Find the line that reads the token.** It will look like:
```typescript
const token = req.headers.authorization?.split(' ')[1];
// or
const authHeader = req.headers.authorization;
const token = authHeader && authHeader.split(' ')[1];
```

**Replace with (keeps header fallback for safety during transition):**
```typescript
const token =
  req.cookies?.token ||
  req.headers.authorization?.split(' ')[1];
```

**Verify:** Auth middleware reads from `req.cookies.token` first, falls back to header. Login sets an HTTP-only cookie. Logout clears it.

---

### Task 2.6 — Update Frontend to Use Cookies (Remove `localStorage` Token)

**Problem:** Frontend stores JWT in `localStorage` and manually attaches it to every request header. After Task 2.5, the token is now in a cookie — so the frontend must stop managing tokens manually.

#### Step A — Update Axios client

**File:** `frontend/src/api/client.ts`

**Find and remove** any interceptor that reads from `localStorage` and sets `Authorization` header. It looks like:
```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Delete that entire interceptor block.**

**Find the `axios.create(...)` call and add `withCredentials: true`:**
```typescript
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

`withCredentials: true` tells the browser to automatically include cookies with every request. No manual token management needed.

#### Step B — Remove all `localStorage` token storage

**Search the entire `frontend/src/` directory for:**
```
localStorage.setItem('token'
localStorage.getItem('token'
localStorage.removeItem('token'
```

**Delete every line** that matches these patterns. The cookie is managed by the browser — the frontend should not touch it.

#### Step C — Remove `token` from auth state

**Search for the auth context or store file.** It will be one of:
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/hooks/useAuth.ts`
- `frontend/src/features/auth/hooks/useAuth.ts`

**Find any state or interface that stores `token`:**
```typescript
const [token, setToken] = useState<string | null>(null);
// or in an interface:
token: string | null;
```

**Remove `token` from the state, the interface, and any setter calls.** Auth state should only hold `user` (the user object) and auth status — not the raw token.

**Verify:** No `localStorage` token references remain in `frontend/src/`. No component reads a `token` from auth context. Axios client has `withCredentials: true`.

---

### Task 2.7 — Escape Dynamic Regex in Booking Controller

**Problem:** User search input is passed directly into a MongoDB regex. A malicious input can cause a ReDoS (Regular Expression Denial of Service) attack that hangs the server.

**Create new file:** `backend/src/utils/escapeRegex.ts`

```typescript
/**
 * Escapes special regex characters from user input
 * to prevent ReDoS attacks in dynamic MongoDB regex queries.
 */
export const escapeRegex = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
```

**File:** Find the booking controller. It will be one of:
- `backend/src/controllers/booking.controller.ts`
- `backend/src/controllers/bookingController.ts`

**Add this import at the top:**
```typescript
import { escapeRegex } from '../utils/escapeRegex';
```

**Search for all patterns like:**
```typescript
new RegExp(req.query.search
new RegExp(search,
{ $regex: search }
{ $regex: req.query
```

**For each one found, wrap the string in `escapeRegex()`:**
```typescript
// Before:
const regex = new RegExp(search, 'i');
// or:
{ $regex: search, $options: 'i' }

// After:
const regex = new RegExp(escapeRegex(search as string), 'i');
// or:
{ $regex: escapeRegex(search as string), $options: 'i' }
```

**Verify:** Every dynamic regex in the booking controller uses `escapeRegex()` on user-provided input.

---

## 🔧 SECTION 3 — PERFORMANCE: Code Splitting

---

### Task 3.1 — Add `React.lazy()` to Non-Critical Pages

**Problem:** All 11 pages are imported statically, forcing users to download the full bundle before anything renders.

**File:** `frontend/src/lib/router.tsx` (or wherever your routes are defined — search for `import.*Page` patterns at the top)

**Find all static page imports.** They look like:
```typescript
import DashboardPage from '../pages/DashboardPage';
import BookingsPage from '../pages/BookingsPage';
import BookingDetailPage from '../pages/BookingDetailPage';
import UsersPage from '../pages/UsersPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
```

**Replace all of them (except `LoginPage`) with lazy imports:**
```typescript
import { lazy, Suspense } from 'react';

const DashboardPage    = lazy(() => import('../pages/DashboardPage'));
const BookingsPage     = lazy(() => import('../pages/BookingsPage'));
const BookingDetailPage = lazy(() => import('../pages/BookingDetailPage'));
const UsersPage        = lazy(() => import('../pages/UsersPage'));
const ReportsPage      = lazy(() => import('../pages/ReportsPage'));
const SettingsPage     = lazy(() => import('../pages/SettingsPage'));
```

Keep `LoginPage` as a static import — it must load immediately.

**Wrap your route outlet or router children in `<Suspense>`:**
```typescript
<Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
  {/* your <Routes> or <Outlet> here */}
</Suspense>
```

**Verify:** Running `npm run build` in `frontend/` produces multiple chunk files (`BookingsPage-[hash].js`, etc.) in `frontend/dist/assets/` instead of one large bundle.

---

### Task 3.2 — Add Bundle Analyser

**Problem:** Bundle size is unknown. Large imports may be invisible.

**Command to run:**
```bash
cd frontend && npm install --save-dev rollup-plugin-visualizer
```

**File:** `frontend/vite.config.ts`

**Add this import at the top:**
```typescript
import { visualizer } from 'rollup-plugin-visualizer';
```

**Find the `plugins: [react()]` array and add visualizer:**
```typescript
plugins: [
  react(),
  visualizer({ open: false, gzipSize: true, filename: 'dist/stats.html' }),
],
```

(`open: false` prevents auto-opening in CI — run `npm run build` locally and open `dist/stats.html` manually to view the treemap.)

---

## 🔴 SECTION 4 — MANUAL STEPS (Agent Cannot Do These)

These require developer action in the browser or terminal. Do them in this order.

---

### Manual Step A — Rotate ALL Credentials (Do This TODAY)

The `.env` file with live credentials was committed to git. Even after removing it, anyone who cloned or forked the repo before the fix already has the credentials. Rotation is mandatory.

1. **MongoDB Atlas:** Go to Database Access → delete the current user → create a new one with `readWrite` on your specific database only (not admin) → update `MONGODB_URI` in your `.env` and Render environment variables.

2. **JWT Secret:** Generate a new one:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Update `JWT_SECRET` in `.env` and Render environment variables.

3. **WordPress API Key:** Regenerate it on the WordPress side → update `EXTERNAL_API_KEY` in `.env` and Render.

---

### Manual Step B — Remove `.env` From Git History

After rotating credentials, purge the old ones from git history:

```bash
# Install git-filter-repo if not already installed:
pip install git-filter-repo
# or: brew install git-filter-repo

# Remove .env from ALL commits:
git filter-repo --path backend/.env --invert-paths --force
git filter-repo --path .env --invert-paths --force

# Force push (all collaborators must re-clone after this):
git push origin --force --all
```

> ⚠️ Warn all collaborators before force-pushing. They must delete their local clone and re-clone.

---

### Manual Step C — Update Render Build Command

In the Render dashboard:

1. Go to your backend service → **Settings**
2. Find **Build Command**
3. Change from:
   ```
   npm install; npm run build
   ```
   to:
   ```
   npm install --include=dev && npm run build
   ```
   (This is a backup fix. Task 1.1 already moved `tsup` to regular dependencies, but this makes the Render build more robust.)

---

### Manual Step D — Add Environment Variables to Render

In the Render dashboard for your backend service → **Environment**:

Add or verify these exist:
```
NODE_ENV=production
MONGODB_URI=<your new rotated URI>
JWT_SECRET=<your new rotated secret>
EXTERNAL_API_KEY=<your new rotated key>
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

### Manual Step E — Add Environment Variables to Vercel

In the Vercel dashboard for your frontend project → **Settings → Environment Variables**:

Add or verify:
```
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## ✅ Final Verification Checklist

Run these after all agent tasks are complete:

```bash
# 1. Verify frontend builds with zero TypeScript errors
cd frontend && npm run build

# 2. Verify backend builds
cd backend && npm run build

# 3. Verify shared package is clean
cd shared && npm install && npx tsc --noEmit
```

Expected results:
- [ ] Frontend build exits with code 0, no `TS2339` or `TS2307` errors
- [ ] Backend build exits with code 0, `dist/` populated
- [ ] `frontend/dist/assets/` contains multiple chunk files (code splitting working)
- [ ] No `localStorage.getItem('token')` in frontend source
- [ ] `withCredentials: true` in `frontend/src/api/client.ts`
- [ ] `helmet()` called in `backend/src/server.ts`
- [ ] `loginRateLimiter` on the login route
- [ ] CORS no longer uses `*`
- [ ] `.env` listed in all `.gitignore` files
- [ ] `tsup` in `backend/package.json` under `dependencies`
- [ ] `vercel.json` installs `shared/` before building `frontend/`
