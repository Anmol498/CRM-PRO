# Travel CRM — Backend Deployment & Startup Optimization Plan

**Diagnosis summary:** 4 compounding problems cause the 11-min deploy + slow cold start.
Fix all 4 and you go from ~11 min deploy / ~30s cold start to **~3 min deploy / ~3s cold start**.

---

## Root Cause Map

| # | Problem | Impact | Effort |
|---|---|---|---|
| 1 | No index on `users.role` | 2563ms query × 2 on every boot | 🟢 Trivial |
| 2 | PRIMARY + WORKER both run full startup | Every cache task doubled | 🟢 Easy |
| 3 | Cache warming blocks `server.listen()` | Server offline until all caches load | 🟢 Easy |
| 4 | `npm install` runs 4× per deploy, no cache | 8–10 min of the 11-min build | 🟡 Medium |
| 5 | Full `tsc` compile every deploy | ~1–2 min compile, no incremental | 🟡 Medium |

---

## Fix 1 — Add Index on `users.role`
> **Impact:** 2563ms → <10ms query. Fires on every cold start, so this is the highest ROI single change.
> **Time to implement:** 5 minutes.

In `User.model.ts`, add `index: true` to the role field:

```typescript
// User.model.ts
role: {
  type: String,
  enum: ['agent', 'manager', 'AGENT', 'MANAGER', 'admin'],
  required: true,
  index: true,  // ADD THIS
},
```

**Alternatively**, add it as a schema-level index for clarity:

```typescript
UserSchema.index({ role: 1 });
```

> ⚠️ **Also fix the enum inconsistency.** The query filter uses both `"agent"` and `"AGENT"` — this means you're storing mixed-case roles. Normalize all roles to lowercase at write time (a migration + validation hook) so the index is actually selective and the query drops to a single value per case.

---

## Fix 2 — Only the WORKER runs startup tasks (not PRIMARY)
> **Impact:** Eliminates the duplicate DB connect + 2× cache warm + 2× slow query on every boot.
> **Time to implement:** 20 minutes.

Currently `server.ts` runs the full startup sequence in both primary and worker. The primary's only job is to fork workers and restart them on crash — it should never touch the database.

**Current (broken) pattern:**
```typescript
// server.ts — both branches do full startup
if (cluster.isPrimary) {
  initJobs();           // ← primary shouldn't touch DB
  cluster.fork();
} else {
  await connectDatabase();
  await warmDropdownCache();
  await warmCaches();
  server.listen();
}
```

**Fixed pattern:**
```typescript
// server.ts
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  console.log(`[PRIMARY] ${process.pid} is running. Forking workers...`);

  // Primary ONLY manages worker lifecycle
  cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log(`[PRIMARY] Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    cluster.fork();
  });

  // Jobs that only need ONE instance — run in primary, NO DB access
  // initJobs() must be refactored to not need DB (see Fix 2b below)

} else {
  // Worker does ALL the real work
  await startWorker();
}

async function startWorker() {
  await connectDatabase();
  
  // Listen FIRST — server is up immediately
  server.listen(PORT, () => {
    console.log(`[WORKER] ${process.pid} started on port ${PORT}`);
  });

  // Caches warm in background — does NOT block traffic
  warmAfterStart();

  // Cron jobs run only in the single worker
  initJobs();
  startSSEHeartbeat();
}
```

**Fix 2b — Refactor `initJobs` to not need primary-process DB access:**

The FollowUp cron (`followUp.cron.ts`) uses `setInterval` — this is fine to run in the worker only. Remove it from the primary entirely.

---

## Fix 3 — Defer Cache Warming (Don't Block `server.listen`)
> **Impact:** Server goes from "ready in 30s" to "ready in 3s". Caches finish warming in background.
> **Time to implement:** 15 minutes.

**Current (blocking) pattern:**
```typescript
await connectDatabase();
await Promise.all([warmDropdownCache(), warmCaches()]); // ← blocks listen
server.listen(PORT);
```

**Fixed pattern — `warmAfterStart()`:**
```typescript
// startup/warmAfterStart.ts
export async function warmAfterStart(): Promise<void> {
  // setImmediate defers to after current event loop tick
  // Server is already listening when this runs
  setImmediate(async () => {
    try {
      await Promise.all([
        warmDropdownCache(),
        warmCaches(),
      ]);
      console.log('[STARTUP] Background cache warm complete.');
    } catch (err) {
      // Log but don't crash — caches will be populated on first real request
      console.error('[STARTUP] Cache warm failed (non-fatal):', err);
    }
  });
}
```

**Handle cache misses gracefully** while warming is in progress:

```typescript
// In any controller that reads from cache:
export async function getAgents() {
  const cached = agentCache.get('agents');
  if (cached) return cached;

  // Cache miss during warm-up — fetch live and prime the cache
  const agents = await User.find({ role: { $in: ['agent', 'AGENT'] } }).lean();
  agentCache.set('agents', agents);
  return agents;
}
```

> This means even if the first request hits before cache is warm, it still works — it just fetches live once.

---

## Fix 4 — Speed Up `npm install` (Monorepo Cache Strategy)
> **Impact:** Reduces 8–10 min install time to ~30s on cache hit.
> **Time to implement:** 1–2 hours (Render config + lockfile cleanup).

### 4a — Use `npm ci` instead of `npm install`

`npm ci` is deterministic, faster, and designed for CI/CD:

```json
// render.yaml or Render build command
"buildCommand": "npm ci --prefix shared && npm ci --prefix backend && npm run build"
```

### 4b — Enable Render Build Cache

In your `render.yaml`:

```yaml
services:
  - type: web
    name: travel-crm-backend
    env: node
    buildCommand: npm ci && npm run build:backend
    startCommand: node backend/dist/src/server.js
    envVars:
      - key: NODE_ENV
        value: production
    # Tell Render what to cache
    autoDeploy: true
```

Add a `.render-buildpacks` or configure native cache paths. For Node on Render, cache `node_modules` by ensuring your lockfile is committed and not modified during build:

```bash
# Render build settings → Build Cache Directory
node_modules
backend/node_modules
shared/node_modules
```

### 4c — Hoist shared dependencies (long-term)

The real fix for a 4× `npm install` is to hoist to a single `package.json` with workspaces:

```json
// root package.json
{
  "name": "travel-crm",
  "workspaces": ["shared", "backend", "frontend"],
  "scripts": {
    "build:backend": "npm run build -w backend",
    "build:frontend": "npm run build -w frontend"
  }
}
```

With workspaces, `npm install` at root installs everything once into a single `node_modules`. This alone cuts install time by ~75%.

> ⚠️ Workspace migration takes a few hours and needs testing — do this as a dedicated task, not mixed with other changes.

---

## Fix 5 — Switch `tsc` to `tsup` for Production Builds
> **Impact:** Compile time from ~60–90s to ~5s. Type-checking moves to a separate CI step.
> **Time to implement:** 30 minutes.

`tsup` uses `esbuild` under the hood — same TypeScript input, dramatically faster output.

```bash
npm install -D tsup --prefix backend
```

```typescript
// backend/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['cjs'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  minify: false, // keep readable for debugging
  // Type checking is separate — tsup only transpiles
});
```

Update `package.json`:
```json
{
  "scripts": {
    "build": "tsup",
    "typecheck": "tsc --noEmit",
    "build:ci": "npm run typecheck && npm run build"
  }
}
```

In Render, use `build` for the deploy command and run `typecheck` in a pre-deploy CI check (GitHub Actions) rather than blocking every deploy.

---

## Fix 6 — Normalize Role Casing (Follow-up)
> **Impact:** Cleaner query, better index selectivity, removes dual-case bug.
> **Time to implement:** 1 hour (migration + validation).

The current query: `{ role: { $in: ["agent", "manager", "AGENT", "MANAGER"] } }` shows roles are stored inconsistently. 

Add a pre-save hook to normalize:

```typescript
// User.model.ts
UserSchema.pre('save', function (next) {
  if (this.isModified('role')) {
    this.role = this.role.toLowerCase() as UserRole;
  }
  next();
});
```

Run a one-time migration:
```typescript
// scripts/normalize-roles.ts
await User.updateMany(
  { role: { $in: ['AGENT', 'MANAGER', 'ADMIN'] } },
  [{ $set: { role: { $toLower: '$role' } } }]
);
console.log('Role normalization complete.');
```

Then simplify the cache query:
```typescript
// Before
User.find({ role: { $in: ['agent', 'manager', 'AGENT', 'MANAGER'] } })

// After
User.find({ role: { $in: ['agent', 'manager'] } })
```

---

## Fix 7 — Verify Atlas / Render Region Match
> **Impact:** Can reduce DB query latency by 50–200ms across the board.
> **Time to implement:** 15 minutes (Atlas cluster config check).

A 2563ms query on 10 documents is extreme even without an index. Cross-region latency compounds every DB call.

1. Check your Atlas cluster region in the Atlas dashboard (e.g., `us-east-1`, `ap-south-1`)
2. Check your Render service region in Render dashboard settings
3. If they don't match — either:
   - Change Atlas cluster region to match Render (free tier allows this)
   - Or change Render region to match Atlas

Target: both in `us-east-1` (AWS) or both in `us-west-2` (Oregon).

---

## Implementation Order for Antigravity

```
Priority 1 — Do today (all under 30 min total):
  1. User.model.ts        → Add { index: true } on role field
  2. server.ts            → Only WORKER runs startup tasks, not PRIMARY
  3. server.ts            → Move cache warm to warmAfterStart() after server.listen()

Priority 2 — Do this week:
  4. User.model.ts        → Add pre-save hook to normalize role casing
  5. scripts/             → Run one-time role normalization migration
  6. package.json         → Switch build from tsc to tsup
  7. Render dashboard     → Verify Atlas region matches Render region

Priority 3 — Dedicated task:
  8. package.json (root)  → Migrate to npm workspaces (hoisted deps)
  9. Render config        → Enable build cache for node_modules
```

---

## Expected Results After All Fixes

| Metric | Before | After |
|---|---|---|
| Full deploy time | ~11 min | ~2.5–3 min |
| `npm install` time | ~8–10 min | ~20–40s (cached) |
| TypeScript compile | ~60–90s | ~5s (tsup) |
| Cold start to first request | ~25–30s | ~3–4s |
| `User.find` at startup | 2563ms | <10ms |
| Duplicate startup work | 2× everything | 1× (worker only) |
| Cache warm blocking traffic | Yes | No (deferred) |

---

## Quick Sanity Check — `server.ts` startup sequence (target state)

```
[PRIMARY]  pid=83  → fork worker, watch for crashes. Nothing else.
[WORKER]   pid=84  → connectDatabase()         ← ~200ms (same region)
[WORKER]   pid=84  → server.listen(PORT)        ← server READY here
[WORKER]   pid=84  → warmAfterStart() (async)   ← background, non-blocking
[WORKER]   pid=84  → initJobs()                 ← cron registered
[WORKER]   pid=84  → startSSEHeartbeat()        ← heartbeat starts
[WORKER]   pid=84  → [CACHE] warm complete      ← fires ~500ms after listen
```

Total time from process start to "accepting requests": **~300–500ms** after DB connects.

---

*Every fix above is independent — they can be shipped one at a time without breaking anything. Start with Fix 1 (the index) — it's a single line and the highest ROI change in the entire codebase.*
