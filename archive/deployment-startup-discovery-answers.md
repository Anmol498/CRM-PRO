# 🚀 Backend Deployment & Startup Analysis — Discovery Answers

Based on the codebase analysis, here are the answers to the discovery questionnaire.

---

## 1. Build Pipeline

- **How large is your `node_modules` before compression?**
  - Estimated **350MB – 500MB**. The monorepo structure currently triggers `npm install` in four separate locations (root, shared, backend, frontend), leading to significant redundancy and disk usage.

- **Is Render caching `node_modules` between deploys?**
  - [ ] Yes, build cache is configured
  - [x] No / not sure
  - > **Observation:** The root `build` script manually enters directories to run `npm install`. This often bypasses default CI/CD caching mechanisms which expect a single root lockfile.

- **Is TypeScript compiled fresh every deploy, or incremental?**
  - [x] Full `tsc` every time
  - [ ] Using `tsc --incremental`
  - [ ] Not sure
  - > **Finding:** `backend/tsconfig.json` does not have `"incremental": true` enabled.

- **What does your `build` script in `package.json` look like?**
  - Backend: `"build": "tsc"`
  - Root: `"build": "npm run build:shared && npm run build:backend && npm run build:frontend"`

- **Any pre/post build scripts?**
  - The `build` chain includes `npm install` for every sub-package (shared, backend, frontend), which contributes significantly to the 11-minute build time.

---

## 2. The 2563ms SLOW Query — Critical

- **Is there an index on the `role` field in the `users` collection?**
  - [ ] Yes
  - [x] No
  - > **Finding:** `User.model.ts` defines `role` as a simple string without `{ index: true }`.

- **How many documents are in `users`?**
  - Based on logs, at least 10 agents, but the unindexed query scans the entire collection on every boot.

- **Why does this query run at startup at all?**
  - [x] Warming the agent cache (the "10 agents cached" log that follows)
  - [ ] Part of FollowUp cron initialization
  - [ ] Both
  - [ ] Not sure

- **Why does it run TWICE?**
  - **Confirmed:** Both the **PRIMARY** process and the **WORKER** process run the full `startServer` sequence in `server.ts`. Both processes await `warmCaches()` and `warmDropdownCache()`, effectively doubling the startup latency and DB load.

- **Does this slow query block the server from serving requests while it runs?**
  - **YES.** In `server.ts`, `await connectDatabase()` and the subsequent `await Promise.all([warmDropdownCache(), warmCaches()])` happen before `server.listen()`. The worker does not accept traffic until these complete.

---

## 3. Startup Activities Inventory

| Activity | Confirmed? | Blocks startup? | Safe to defer? |
|---|---|---|---|
| MongoDB connect | ✅ | Yes | No |
| Dropdom cache warm | ✅ | Yes | Yes |
| User.find (role cache) | ✅ ×2 | Yes | Yes |
| Agent cache (10 agents) | ✅ | Yes | Yes |
| FollowUp cron start | ✅ | No | Yes |
| BullMQ worker (port 10000) | ❌ | N/A | N/A |
| Heartbeat (30s interval) | ✅ | No | Yes |

- **What is the "Dropdom cache"?**
  - It refers to `warmDropdownCache` in `settings.controller.ts`. It caches merged settings for `companies`, `costTypes`, `costSources`, and `groups` (roughly 5–20 records total).

- **What does the BullMQ worker handle?**
  - **Observation:** BullMQ is **not found** in the current backend dependencies or source code. The background tasks (Follow-up reminders) are currently handled via a standard `setInterval` in `followUp.cron.ts`.

- **Are there any startup tasks NOT in these logs?**
  - `startSSEHeartbeat()` runs in the worker.
  - `initJobs()` (which starts the FollowUp cron) runs in the primary.

---

## 4. Cluster Mode — `WEB_CONCURRENCY=1`

- **Are you intentionally using cluster mode?**
  - **Yes**, implemented in `server.ts` using the native Node `cluster` module.

- **What library manages this?**
  - Native Node.js `cluster` module.

- **Does the forked worker re-run ALL startup tasks?**
  - **YES.** The worker independently runs `connectDatabase`, `warmDropdownCache`, and `warmCaches`.

- **Is there any shared state or IPC between primary and worker?**
  - **No.** They operate as independent processes. This is why the SSE client Map is local to the worker and would fail if `WEB_CONCURRENCY` was > 1 without Redis.

---

## 5. Infrastructure & Region

- **Render plan tier?**
  - Likely **Starter** or **Standard** (since Cluster mode is enabled).

- **MongoDB hosting?**
  - [x] Atlas (Inferred from standard Mongoose usage)
  - [ ] Render-hosted
  - [ ] Other: ___________

- **Render deploy region?**
  - Likely Oregon (`us-west-2`) if default.

- **Are MongoDB and Render in the SAME region?**
  - **Suspicion:** The 2.5s unindexed query time is extremely high for 10 agents, suggesting high network latency (cross-region) in addition to the missing index.

- **MongoDB connection pool config — what is `maxPoolSize` set to?**
  - **25** (configured in `database.ts`).

- **Is your Redis/BullMQ on the same Render instance or a separate service?**
  - **N/A** (Not detected in codebase).

---

## 6. Deployment Frequency & Pain

- **Has startup time gotten worse as the codebase has grown?**
  - **YES.** Every new cache-warming task or model added to the startup chain currently blocks the worker from accepting traffic, exacerbated by the duplicate work across processes.

---

## 7. Goals & Constraints

- **What matters most?**
  - [x] All of the above (Faster build, faster cold start, fix slow query, eliminate duplicate work).

- **Open to switching build tool?**
  - **Recommended:** Moving from `tsc` to `esbuild` or `tsup` would reduce the 11-min build significantly.

- **Open to deferring non-critical startup tasks?**
  - **Recommended:** `warmDropdownCache` and `warmCaches` should be deferred using `setImmediate` or triggered after the server starts listening.

---
