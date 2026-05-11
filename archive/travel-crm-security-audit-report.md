# 🔐 Travel CRM — Security & Optimization Audit Report

**Date:** 2026-05-10  
**Project:** Travel CRM  
**Stack:** React 19 + Vite | Node.js 22 + Express 4 | MongoDB Atlas  
**Auditor:** Structured review based on full questionnaire answers  

---

## 🚦 Summary Dashboard

| Severity | Count | Status |
|---|---|---|
| 🚨 Critical | 4 | Fix before anything else — production is at risk RIGHT NOW |
| ⚠️ High | 7 | Fix before next release |
| 🔧 Medium (Optimization) | 6 | Schedule in next sprint |
| ✅ Already Good | 15 | Keep doing these |

---

## 🚨 CRITICAL ISSUES — Fix Immediately

These are not warnings. They represent active, exploitable vulnerabilities right now.

---

### 🚨 C-1 — `.env` File Is Committed to Git

**Severity:** Critical — Data Breach  
**Location:** Root `.gitignore` does not exclude `.env`  
**Impact:** Your `MONGODB_URI`, `JWT_SECRET`, and `EXTERNAL_API_KEY` are exposed to anyone with read access to the repository — including any past contributors, CI systems, and if the repo is ever made public, the entire internet. This is confirmed as an active credential leak.

**Fix — Do all 4 steps, in order:**

**Step 1 — Immediately rotate ALL secrets.** Do this before touching Git.
- MongoDB Atlas → Database Access → delete current user → create new one → update connection string
- Generate a new JWT secret (minimum 64 random characters):
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- Regenerate the WordPress `EXTERNAL_API_KEY`

**Step 2 — Remove `.env` from Git history:**
```bash
# Install the tool
brew install git-filter-repo   # or: pip install git-filter-repo

# Remove .env from ALL history
git filter-repo --path .env --invert-paths --force

# Also remove backend .env if tracked separately
git filter-repo --path travel-crm-backend/.env --invert-paths --force
```

**Step 3 — Add to `.gitignore` immediately:**
```
.env
.env.local
.env.production
*.env
```

**Step 4 — Force push and notify all collaborators:**
```bash
git push origin --force --all
```
All collaborators must delete their local clone and re-clone — their local copies still have the old history.

> ⚠️ **Note:** If this repository has ever been pushed to a public GitHub/GitLab, assume the credentials are already compromised regardless of rotation. Rotate anyway.

---

### 🚨 C-2 — JWT Tokens Stored in `localStorage`

**Severity:** Critical — XSS Token Theft  
**Location:** `AuthContext.tsx` and `api/client.ts`  
**Impact:** Any JavaScript running on your page — including injected scripts from browser extensions, third-party packages with supply chain issues, or a future XSS bug — can read `localStorage` and steal the JWT. Combined with the 30-day expiry and no refresh token invalidation, an attacker has 30 days of full API access.

**Fix — Move tokens to HTTP-only cookies:**

Backend — set the token as a cookie on login:
```typescript
// authController.ts
res.cookie('token', jwt, {
  httpOnly: true,       // JS cannot read this
  secure: true,         // HTTPS only
  sameSite: 'strict',   // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days (reduce from 30d)
});
res.json({ success: true, user: safeUserObject });
```

Frontend — remove all `localStorage.setItem('token', ...)` and `localStorage.getItem('token')`. The browser sends the cookie automatically with every request. Update Axios client:
```typescript
// api/client.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // sends cookies with every request
});
```

Also reduce JWT expiry from `30d` to `7d` or less. A shorter window limits exposure if a token is ever compromised.

---

### 🚨 C-3 — CORS Set to `*` in Production

**Severity:** Critical  
**Location:** `server.ts`  
**Impact:** Any website on the internet can make authenticated requests to your API from a visitor's browser. This is the definition of a cross-origin attack surface. For an API that handles bookings and traveler data, this is unacceptable.

**Fix — Restrict CORS to your exact frontend domain:**
```typescript
// config/cors.ts
import cors from 'cors';

const allowedOrigins = [
  'https://your-travel-crm.vercel.app',
  'http://localhost:5173',  // dev only
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,       // required when using cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});
```

---

### 🚨 C-4 — `/api/external/lead` Relies on a Leaked API Key

**Severity:** Critical  
**Location:** External WordPress integration endpoint  
**Impact:** The `EXTERNAL_API_KEY` used to protect this endpoint was committed to Git (see C-1). Anyone who has seen the repository can call this endpoint freely, injecting arbitrary lead data into your CRM.

**Fix:**
1. Rotate the key immediately (covered in C-1 Step 1)
2. After rotating, add IP allowlisting on this endpoint — only allow requests from your WordPress server's IP:
```typescript
// middleware/ipWhitelist.middleware.ts
const ALLOWED_IPS = (process.env.WORDPRESS_IP || '').split(',');

export const ipWhitelist = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket.remoteAddress;
  if (!ALLOWED_IPS.includes(clientIp!)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
```
3. Add rate limiting specifically on this endpoint (covered in H-2 below)

---

## ⚠️ HIGH PRIORITY ISSUES — Fix Before Next Release

---

### ⚠️ H-1 — No Brute-Force Protection on Login

**Location:** `authRoutes.ts`, no rate limiting middleware  
**Impact:** An attacker can make unlimited login attempts, systematically guessing passwords for any account including admin accounts.

**Fix:**
```bash
cd backend && npm install express-rate-limit
```
```typescript
// middleware/rateLimiter.middleware.ts
import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // 10 attempts per window
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,             // 100 requests per minute globally
});
```
```typescript
// routes/auth.routes.ts
router.post('/login', loginRateLimiter, authController.login);

// routes/index.ts
app.use(apiRateLimiter);  // global
```

---

### ⚠️ H-2 — No `helmet` Middleware (Missing Security Headers)

**Location:** `server.ts`  
**Impact:** Browser-level protections (XSS filter, clickjacking, MIME sniffing, etc.) are all disabled. These are free protections that take 2 minutes to add.

**Fix:**
```bash
cd backend && npm install helmet
```
```typescript
// server.ts
import helmet from 'helmet';
app.use(helmet());
```

This single line adds 11 HTTP security headers automatically including `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, and `X-XSS-Protection`.

---

### ⚠️ H-3 — JWT Expiry Is 30 Days With No Refresh Token

**Location:** `utils/jwt.ts`  
**Impact:** If a token is stolen (more likely given the `localStorage` storage in C-2), the attacker has 30 days of access with no way to invalidate it short of changing the JWT secret, which would log out every user.

**Fix:**
- Reduce access token expiry to `15m` or `1h`
- Implement a refresh token stored in an HTTP-only cookie with `7d` expiry
- Add a token blocklist in Redis or MongoDB for logout/revocation

Minimum acceptable fix without a full refresh token implementation: reduce to `7d` and combine with the HTTP-only cookie fix from C-2.

---

### ⚠️ H-4 — Dynamic Regex in `bookingController.ts`

**Location:** `bookingController.ts` — search/filter functionality  
**Impact:** If user input is passed directly into a MongoDB regex query without sanitization, an attacker can craft a ReDoS (Regular Expression Denial of Service) payload that causes the regex to run for an extremely long time, hanging your server.

**Fix — Escape user input before using in regex:**
```typescript
// utils/escapeRegex.ts
export const escapeRegex = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// In bookingController.ts
const search = escapeRegex(req.query.search as string);
const regex = new RegExp(search, 'i');
```

---

### ⚠️ H-5 — No Persistent Logging

**Location:** Logging is only to console via Morgan  
**Impact:** When something goes wrong in production — an error, a failed login storm, an API abuse — there is no historical record to investigate. Logs disappear when the Render instance restarts.

**Fix — Add Winston with file + console transport:**
```bash
cd backend && npm install winston
```
```typescript
// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});
```
Replace all `console.log` / `console.error` calls with `logger.info` / `logger.error`.

---

### ⚠️ H-6 — No Error Monitoring

**Impact:** Errors in production are invisible unless a user reports them. Silent failures in booking creation, payment processing, or auth could go unnoticed for days.

**Fix — Add Sentry (free tier is sufficient):**
```bash
cd backend && npm install @sentry/node
cd frontend && npm install @sentry/react
```
```typescript
// backend/src/server.ts
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN });
```
Sentry will automatically capture unhandled exceptions, track performance, and send email alerts.

---

### ⚠️ H-7 — MongoDB Atlas Using Admin-Level User

**Impact:** If your connection string is compromised (it already was — see C-1), an attacker has full admin access to your database including dropping collections.

**Fix:**
1. In MongoDB Atlas → Database Access → Add New Database User
2. Create a user with only `readWrite` on the specific CRM database — no `atlasAdmin`, no `dbAdmin`
3. Update `MONGODB_URI` in your new (rotated) `.env`
4. Also in Atlas → Network Access → restrict IP allowlist to only your Render server's outbound IP

---

## 🔧 MEDIUM — Optimizations (Schedule for Next Sprint)

---

### 🔧 O-1 — No Code Splitting on Frontend

**Impact:** All 11 pages load in a single JS bundle. First-load performance is poor, especially for users who only ever use the Login and Dashboard pages but are forced to download Bookings, Reports, Settings, etc.

**Fix:**
```typescript
// lib/router.tsx
import { lazy, Suspense } from 'react';

const BookingsPage = lazy(() => import('../pages/BookingsPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

// Wrap routes in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <BookingsPage />
</Suspense>
```
Apply `React.lazy()` to every page except `LoginPage` and `DashboardPage`. This alone can cut initial bundle size by 40–60%.

---

### 🔧 O-2 — No Bundle Analysis

**Impact:** You don't know what's making your bundle large. A single accidental full import can add 200KB+.

**Fix:**
```bash
cd frontend && npm install -D rollup-plugin-visualizer
```
```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [react(), visualizer({ open: true, gzipSize: true })]
```
Run `npm run build` once — a visual treemap opens in your browser showing exactly what's large.

---

### 🔧 O-3 — No Lighthouse Scores Recorded

Run Lighthouse on: Login page, Dashboard page, Bookings page. Target scores:

| Metric | Target |
|---|---|
| Performance | > 80 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 80 |

Run from Chrome DevTools → Lighthouse tab, or:
```bash
npm install -g lighthouse
lighthouse https://your-travel-crm.vercel.app --output html --output-path report.html
```

---

### 🔧 O-4 — Mongoose and Express Are Outdated

| Package | Current | Latest | Risk |
|---|---|---|---|
| `mongoose` | 9.2.4 | 9.6.2 | Bug fixes, performance |
| `express` | 4.22.1 | 5.2.1 | Major version — async error handling built-in |

Update mongoose first (minor version, safe):
```bash
cd backend && npm install mongoose@latest
```
Express 5 is a major version — read the migration guide before upgrading. Key change: async route handlers no longer need `try/catch` — Express 5 catches rejections automatically (which makes your `asyncHandler` util redundant).

---

### 🔧 O-5 — No Database Backup Strategy

**Impact:** MongoDB Atlas does not enable backups by default on free/shared clusters. A corrupted migration script or accidental `deleteMany` has no recovery path.

**Fix:**
- In MongoDB Atlas → Clusters → your cluster → Backup → enable **Continuous Backups** or **Scheduled Snapshots**
- M10+ cluster tier required for continuous backups
- Minimum: daily snapshots with 7-day retention
- Also: run `mongoexport` before running any migration script

---

### 🔧 O-6 — Morgan Logging May Capture `req.body` Secrets

**Impact:** If Morgan is configured with a custom format that includes request body, passwords or tokens in POST requests get written to logs.

**Fix — verify Morgan format:**
```typescript
// Only use 'combined', 'common', 'dev', or 'short' — never log req.body
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
```
Never use a custom Morgan token that reads `req.body`.

---

## ✅ WHAT YOU'RE ALREADY DOING RIGHT

These are real positives — don't change them.

| Item | Detail |
|---|---|
| ✅ bcrypt with 10 rounds | Correct password hashing. 12 rounds would be marginally better but 10 is acceptable. |
| ✅ Zod validation on all inputs | `loginSchema.safeParse()` and similar — exactly right. |
| ✅ Mongoose ODM | Prevents the majority of NoSQL injection by design. |
| ✅ Generic login error message | "Invalid email or password" — doesn't reveal whether the email exists. |
| ✅ No `dangerouslySetInnerHTML` | Zero XSS via React rendering. |
| ✅ `VITE_` prefixed env vars | Correctly separating public config from secrets. |
| ✅ No secrets hardcoded in source | All secrets are in `.env` (the problem is `.env` being tracked, not where secrets are). |
| ✅ `package-lock.json` committed | Reproducible, deterministic installs. |
| ✅ 0 npm audit vulnerabilities | Clean dependency tree. |
| ✅ DB indexes on `email` and key fields | Correct — prevents full collection scans on common queries. |
| ✅ NodeCache with invalidation | Sophisticated in-memory caching — most teams skip this entirely. |
| ✅ Performance monitoring middleware | `perfMonitor` logging slow endpoints — proactive. |
| ✅ Pagination on booking endpoints | Both cursor and skip/limit — well implemented. |
| ✅ `compression` middleware enabled | Gzip on API responses — correct. |
| ✅ `.populate()` + `Promise.all()` pattern | Avoids N+1 query problems properly. |
| ✅ HTTPS via Vercel + Render | Both platforms enforce HTTPS automatically. |
| ✅ Node.js Cluster module | Multi-core scaling — most Node.js apps don't bother with this. |

---

## 📋 Fix Priority Order (Exact Sequence)

Execute in this order — do not skip ahead.

```
TODAY (before anything else):
  [ ] C-1a  Rotate MONGODB_URI on MongoDB Atlas
  [ ] C-1b  Rotate JWT_SECRET
  [ ] C-1c  Rotate EXTERNAL_API_KEY
  [ ] C-1d  Remove .env from Git history (git filter-repo)
  [ ] C-1e  Add .env to .gitignore
  [ ] C-1f  Force push — notify all collaborators

THIS WEEK:
  [ ] C-2   Move JWT from localStorage to HTTP-only cookie
  [ ] C-3   Restrict CORS to specific frontend origin
  [ ] C-4   Add IP allowlist to /api/external/lead
  [ ] H-1   Add express-rate-limit to login + global
  [ ] H-2   Add helmet middleware (2 lines)
  [ ] H-7   Create least-privilege MongoDB Atlas user

NEXT SPRINT:
  [ ] H-3   Reduce JWT expiry + implement refresh token
  [ ] H-4   Escape dynamic regex in bookingController
  [ ] H-5   Add Winston persistent logging
  [ ] H-6   Add Sentry error monitoring
  [ ] O-5   Enable MongoDB Atlas backups

SCHEDULED IMPROVEMENTS:
  [ ] O-1   Add React.lazy() code splitting to all non-critical pages
  [ ] O-2   Run rollup-plugin-visualizer bundle analysis
  [ ] O-3   Run Lighthouse and record baseline scores
  [ ] O-4   Update mongoose to 9.6.2
  [ ] O-6   Audit Morgan log format for req.body exposure
```

---

## 🔑 One-Line Summary Per Issue

| ID | Issue | Fix |
|---|---|---|
| C-1 | `.env` in Git = full credential breach | Rotate secrets → filter-repo → .gitignore |
| C-2 | JWT in localStorage = XSS theft | Move to HTTP-only cookie |
| C-3 | CORS `*` = open API | Allowlist your Vercel domain only |
| C-4 | Leaked API key on external endpoint | Rotate + add IP allowlist |
| H-1 | No login rate limiting | Add express-rate-limit (10 req / 15 min) |
| H-2 | No helmet = missing 11 security headers | `app.use(helmet())` |
| H-3 | 30-day JWT, no revocation | Reduce to 7d, add refresh tokens |
| H-4 | Unescaped regex in bookings search | Use escapeRegex() utility |
| H-5 | Logs lost on server restart | Add Winston with file transport |
| H-6 | Silent production errors | Add Sentry |
| H-7 | Admin-level MongoDB user | Create least-privilege Atlas user |
| O-1 | No code splitting = fat bundle | React.lazy() on all non-critical pages |
| O-2 | Bundle size unknown | rollup-plugin-visualizer |
| O-3 | No Lighthouse baseline | Run and record scores now |
| O-4 | Outdated mongoose + express | npm update |
| O-5 | No DB backups | Enable Atlas snapshots |
| O-6 | Morgan may log req.body | Audit Morgan format |
