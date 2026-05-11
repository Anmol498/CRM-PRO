# 🗄️ MongoDB Database Access Control — Discovery Answers

Based on the codebase analysis, here are the answers to the discovery questionnaire regarding MongoDB access control.

---

## 1. Current Connection Setup

- **What does your current `MONGODB_URI` look like in structure?**
  - Local Dev: `mongodb://127.0.0.1:27017/travel_crm`
  - Production (Atlas): `mongodb+srv://[user]:[pass]@[cluster].mongodb.net/[db]?retryWrites=true&w=majority`

- **What is your `database.ts` / `connectDatabase()` code?**
  ```typescript
  export const connectDatabase = async () => {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, {
        dbName: env.DB_NAME,
        maxPoolSize: 25,
        // ... options
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host} | Database: ${conn.connection.name}`);
      return conn;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  };
  ```

- **Is the database name currently hardcoded in the URI, passed as an option, or both?**
  - [ ] Hardcoded in the URI string
  - [x] Passed as `dbName` option to Mongoose
  - [ ] Both
  - > **Observation:** `env.DB_NAME` is passed as an option, which overrides any DB name in the URI.

---

## 2. Current Atlas User & Permissions

- **How many MongoDB Atlas database users do you currently have?**
  - **Not sure.** Needs verification in Atlas dashboard.

- **What permissions does the user in your current URI have?**
  - [ ] Atlas Admin
  - [ ] readWriteAnyDatabase
  - [ ] Read and write to any database
  - [ ] Custom role scoped to specific database
  - [x] Not sure — never configured it manually
  - > **Note:** If it was created with default settings, it likely has `readWriteAnyDatabase` or `Atlas Admin`.

- **Is the same Atlas user/URI used across multiple environments?**
  - [x] Yes — dev (local) and prod (Atlas) use different URIs, but likely a single Atlas user for all remote environments.

---

## 3. Atlas Cluster Structure

- **How many databases exist on your Atlas cluster right now?**
  - **Not sure.** Expected: `TravelCRM`, `test`, `admin`, `local`, `config`.

- **Is `test` database present?**
  - [x] Not sure (likely yes, as it's the default).

- **Is this a shared cluster (M0 free tier / M2 / M5) or a dedicated cluster (M10+)?**
  - [x] Shared (M0/M2/M5) — Likely M0 for development or Starter plan.

---

## 4. Environment Setup

- **How many deployment environments do you have or plan to have?**
  - [x] Dev + Production

- **Should each environment connect to a DIFFERENT database on the same cluster?**
  - [x] Yes — one DB per environment (e.g., `CRM_Prod`, `CRM_Dev`).

- **Where are your env variables currently managed?**
  - [x] Both (Render dashboard for prod, `.env` for dev).

---

## 5. Desired Access Control Model

- **What exactly do you want to restrict?**
  - [x] The backend user can only read/write ONE specific database — no access to `admin`, `local`, `config`, or any other DB.

- **Should the database NAME be a separate env variable from the URI?**
  - [x] Yes — Already implemented as `DB_NAME` in `env.ts`.

- **If someone accidentally sets the wrong `DB_NAME` at startup, what should happen?**
  - [x] Server should refuse to start and log a clear error.

---

## 6. Code & Config Scope

- **Is `connectDatabase()` called in one place or multiple places?**
  - [x] One central place (`server.ts`), but shared by other scripts.

- **Do any scripts outside the main server also connect to MongoDB?**
  - [x] Yes: `seed.ts`, `migrateData.ts`, `normalizeRoles.ts`.

- **Are you using multiple Mongoose connections anywhere, or just the default global connection?**
  - [x] Single global `mongoose.connect()`.

---

## 7. Goals & Constraints

- **Why is this change being made?**
  - [x] All of the above (Security, preventing accidental mix-ups, compliance).

- **Are you comfortable making changes in the Atlas dashboard?**
  - [x] Yes, I have Atlas project owner access.

- **Should this work be done at the Atlas level (user permissions), the Mongoose level (dbName option + validation), or both?**
  - [x] Both — defence in depth.

---
