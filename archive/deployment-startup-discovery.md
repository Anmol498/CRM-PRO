# 🚀 Backend Deployment & Startup Analysis — Discovery Questionnaire

Based on your Render deployment logs, here's what was already observed:
- **Build time:** ~11 min (04:56 → 05:07 PM) — `npm install` + `tsc` compile
- **Upload:** 73MB compressed, 2.3s
- **Startup fires:** MongoDB connect → Dropdom cache warm → `User.find` SLOW query (2563ms!) → Agent cache (10 agents) → FollowUp cron → BullMQ worker → Heartbeat → health check

Answer the questions below so we can identify what's slow, what's risky, and what to fix.

---

## 1. Build Pipeline

- **How large is your `node_modules` before compression?**
  (73MB compressed suggests a heavy dep tree — uncompressed size?)

- **Is Render caching `node_modules` between deploys?**
  - [ ] Yes, build cache is configured
  - [ ] No / not sure
  > If no, `npm install` re-downloads everything on every single deploy — this alone can add 5–8 min.

- **Is TypeScript compiled fresh every deploy, or incremental?**
  - [ ] Full `tsc` every time
  - [ ] Using `tsc --incremental`
  - [ ] Not sure

- **What does your `build` script in `package.json` look like?**
  (e.g., `"build": "tsc"` vs `"build": "rimraf dist && tsc"`)

- **Any pre/post build scripts?** (codegen, Prisma generate, seed scripts, etc.)

---

## 2. The 2563ms SLOW Query — Critical

The log shows this running **twice** at startup:
```
[MONGOOSE SLOW] User.find - 2563ms
filter: {"role":{"$in":["agent","manager","AGENT","MANAGER"]}}
```

- **Is there an index on the `role` field in the `users` collection?**
  - [ ] Yes
  - [ ] No
  - [ ] Not sure

- **How many documents are in `users`?** (rough number is fine)

- **Why does this query run at startup at all?**
  - [ ] Warming the agent cache (the "10 agents cached" log that follows)
  - [ ] Part of FollowUp cron initialization
  - [ ] Both
  - [ ] Not sure

- **Why does it run TWICE** (05:16 PM and again at 05:23 PM)?
  Is it because the PRIMARY process and the forked WORKER both run the full startup sequence independently?

- **Does this slow query block the server from serving requests while it runs?**

---

## 3. Startup Activities Inventory

From the logs, these fire on every cold start. Please confirm and fill the gaps:

| Activity | Confirmed? | Blocks startup? | Safe to defer? |
|---|---|---|---|
| MongoDB connect | ✅ | Yes | No |
| Dropdom cache warm | ✅ | ? | ? |
| User.find (role cache) | ✅ ×2 | ? | ? |
| Agent cache (10 agents) | ✅ | ? | ? |
| FollowUp cron start | ✅ | No | Yes |
| BullMQ worker (port 10000) | ✅ | ? | ? |
| Heartbeat (30s interval) | ✅ | No | Yes |

- **What is the "Dropdom cache"?** What data does it hold and roughly how many records?

- **What does the BullMQ worker handle?** (email queue, notifications, report generation?)

- **Are there any startup tasks NOT in these logs?**
  (Redis connect, external API calls, S3/file checks, schema sync, etc.)

---

## 4. Cluster Mode — `WEB_CONCURRENCY=1`

The log shows:
```
Setting WEB_CONCURRENCY=1 by default
[PRIMARY] 83 is running. Forking 1 workers...
```

- **Are you intentionally using cluster mode?**
- **What library manages this?** (`throng`, `@render/node-cluster`, custom code?)
- **Does the forked worker re-run ALL startup tasks** (DB connect, cache warm, cron init) independently of the primary?
  > This is likely why the slow query fires twice — both processes boot independently.
- **Is there any shared state or IPC between primary and worker?**

---

## 5. Infrastructure & Region

- **Render plan tier?** (Free, Starter, Standard, Pro)
  > Free tier spins down after 15 min idle — every cold start re-runs the full 11-min deploy chain.

- **MongoDB hosting?**
  - [ ] Atlas — which region? (e.g., `us-east-1`, `ap-south-1`)
  - [ ] Render-hosted
  - [ ] Other: ___________

- **Render deploy region?** (e.g., Oregon `us-west-2`, Frankfurt, Singapore)

- **Are MongoDB and Render in the SAME region?**
  > Cross-region DB connections are a top cause of slow queries — 2563ms is consistent with cross-region latency on an unindexed query.

- **MongoDB connection pool config — what is `maxPoolSize` set to?**

- **Is your Redis/BullMQ on the same Render instance or a separate service?**

---

## 6. Deployment Frequency & Pain

- **How often do you deploy?**
- **Current acceptable deploy time for the team?**
- **Is there downtime during deploys, or zero-downtime rollover?**
  - [ ] Old instance stays live until new one passes health check
  - [ ] There's a window where the service is down
- **Has startup time gotten worse as the codebase has grown?**

---

## 7. Goals & Constraints

- **What matters most?** (pick all that apply)
  - [ ] Faster CI/CD deploys (the 11-min build)
  - [ ] Faster cold start (time to first request)
  - [ ] Fix the 2.5s slow query
  - [ ] Eliminate duplicate startup work across PRIMARY + WORKER
  - [ ] Reduce memory footprint at boot
  - [ ] All of the above

- **Open to switching build tool?**
  > Replacing `tsc` with `esbuild` or `tsup` for production builds cuts compile time from ~minutes to ~5 seconds. TypeScript type-checking can run separately in CI.

- **Open to deferring non-critical startup tasks?**
  > Cache warming, cron registration, and heartbeat setup can all happen after the first request — this gets the server to "ready" state significantly faster.

- **Any tasks that absolutely MUST complete before the server accepts traffic?**

---

*Fill in what you can — even partial answers are enough to build a concrete optimization plan with code changes.*
