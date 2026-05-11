# 🗄️ MongoDB Database Access Control — Discovery Questionnaire

**Goal:** Configure the backend so it connects only to the database specified in an env variable, with no ability to access any other database on the Atlas cluster.

Answer these questions so we can design the right solution for your setup.

---

## 1. Current Connection Setup

- **What does your current `MONGODB_URI` look like in structure?**
  (Mask credentials, just show the shape — e.g., `mongodb+srv://user:pass@cluster.mongodb.net/mydb?options`)

- **What is your `database.ts` / `connectDatabase()` code?**
  Paste the relevant snippet — specifically how the URI is passed to Mongoose:
  ```typescript
  // e.g.,
  mongoose.connect(process.env.MONGODB_URI)
  // or
  mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
  ```

- **Is the database name currently hardcoded in the URI, passed as an option, or both?**
  - [ ] Hardcoded in the URI string (e.g., `.../TravelCRM?retryWrites...`)
  - [ ] Passed as `dbName` option to Mongoose
  - [ ] Both
  - [ ] Not sure

---

## 2. Current Atlas User & Permissions

- **How many MongoDB Atlas database users do you currently have?**
  (Atlas dashboard → Database Access)

- **What permissions does the user in your current URI have?**
  - [ ] `Atlas Admin` (full access to everything)
  - [ ] `readWriteAnyDatabase` (read/write all DBs)
  - [ ] `Read and write to any database` (built-in role)
  - [ ] Custom role scoped to specific database
  - [ ] Not sure — never configured it manually

- **Is the same Atlas user/URI used across multiple environments?**
  - [ ] Yes — dev, staging, and prod all use the same credentials
  - [ ] No — separate users per environment
  - [ ] We only have one environment

---

## 3. Atlas Cluster Structure

- **How many databases exist on your Atlas cluster right now?**
  (Atlas dashboard → Browse Collections — list them if possible, e.g., `TravelCRM`, `test`, `admin`)

- **Is `test` database present?** (Mongoose connects to `test` by default if no DB name is specified)
  - [ ] Yes
  - [ ] No
  - [ ] Not sure

- **Do you have multiple projects/clusters, or a single cluster for everything?**

- **Is this a shared cluster (M0 free tier / M2 / M5) or a dedicated cluster (M10+)?**
  - [ ] Shared (M0/M2/M5) — note: some access control features are limited
  - [ ] Dedicated (M10+)
  - [ ] Not sure

---

## 4. Environment Setup

- **How many deployment environments do you have or plan to have?**
  - [ ] Just production
  - [ ] Dev + Production
  - [ ] Dev + Staging + Production
  - [ ] Other: ___________

- **Should each environment connect to a DIFFERENT database on the same cluster?**
  (e.g., `TravelCRM_dev`, `TravelCRM_staging`, `TravelCRM_prod`)
  - [ ] Yes — one DB per environment
  - [ ] No — they share the same database
  - [ ] Not decided yet

- **Where are your env variables currently managed?**
  - [ ] Render dashboard (environment variables section)
  - [ ] `.env` files in the repo
  - [ ] Both
  - [ ] A secrets manager (Doppler, Vault, etc.)

---

## 5. Desired Access Control Model

- **What exactly do you want to restrict?**
  - [ ] The backend user can only read/write ONE specific database — no access to `admin`, `local`, `config`, or any other DB
  - [ ] Different environments use different DB users (each scoped to their own DB)
  - [ ] A single user scoped to one DB, used everywhere
  - [ ] Something else: ___________

- **Should the database NAME be a separate env variable from the URI?**
  - [ ] Yes — `MONGODB_URI` has no DB name, `DB_NAME` is separate
  - [ ] No — DB name stays embedded in the URI
  - [ ] Either works, just make it consistent

- **If someone accidentally sets the wrong `DB_NAME` at startup, what should happen?**
  - [ ] Server should refuse to start and log a clear error
  - [ ] Server starts but logs a loud warning
  - [ ] No preference

---

## 6. Code & Config Scope

- **Is `connectDatabase()` called in one place or multiple places?**
  - [ ] One central place (`server.ts` or `app.ts`)
  - [ ] Multiple places
  - [ ] Not sure

- **Do any scripts outside the main server also connect to MongoDB?**
  (e.g., seed scripts, migration scripts, cron scripts run independently)
  - [ ] Yes: ___________
  - [ ] No

- **Are you using multiple Mongoose connections anywhere, or just the default global connection?**
  - [ ] Single global `mongoose.connect()`
  - [ ] Multiple connections (`mongoose.createConnection()`)
  - [ ] Not sure

---

## 7. Goals & Constraints

- **Why is this change being made?** (helps choose the right solution)
  - [ ] Security — limit blast radius if credentials are leaked
  - [ ] Preventing accidental writes to wrong DB during dev/prod mix-up
  - [ ] Compliance / audit requirement
  - [ ] All of the above

- **Are you comfortable making changes in the Atlas dashboard** (creating a new DB user with restricted permissions)?
  - [ ] Yes, I have Atlas project owner access
  - [ ] No, someone else manages Atlas
  - [ ] Not sure what access I have

- **Should this work be done at the Atlas level (user permissions), the Mongoose level (dbName option + validation), or both?**
  - [ ] Both — defence in depth
  - [ ] Atlas level only
  - [ ] Code level only
  - [ ] Whatever you recommend

---

*Paste your answers and we'll produce the exact Atlas user config steps + updated `database.ts` code with env-driven DB selection and startup validation.*
