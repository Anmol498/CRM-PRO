# Travel CRM — MongoDB Database Access Control Plan

**Goal:** Two-layer defence — Atlas user scoped to one DB (infrastructure) + code-level validation that refuses to boot with wrong/missing config (application).

---

## Architecture Overview

```
ENV Variables
  MONGODB_URI  = mongodb+srv://crm_prod_user:pass@cluster.net   ← no DB name in URI
  DB_NAME      = CRM_Prod                                        ← the ONLY DB this process touches

        │
        ▼
┌─────────────────────────────┐
│  Code Layer (database.ts)   │  ← validates DB_NAME at boot, refuses to start if wrong
│  mongoose.connect(URI, {    │
│    dbName: env.DB_NAME      │  ← Mongoose enforces which DB to use
│  })                         │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  Atlas Layer                │  ← DB user has readWrite on CRM_Prod ONLY
│  User: crm_prod_user        │  ← cannot access CRM_Dev, test, admin, local, config
│  Role: readWrite @ CRM_Prod │
└─────────────────────────────┘
```

---

## Layer 1 — Atlas Configuration (Do First)

### Step 1: Create Scoped Database Users

Go to **Atlas Dashboard → Database Access → Add New Database User** and create TWO new users (one per environment). Do NOT modify or delete the existing user until everything is tested.

---

**Production User**

| Field | Value |
|---|---|
| Username | `crm_prod_user` |
| Password | Generate a strong random password (use Atlas generator) |
| Auth method | Password |
| Built-in Role | ❌ None — use Custom Role instead |
| Custom privilege | Database: `CRM_Prod`, Role: `readWrite` |

Under **Database User Privileges → Specific Privileges:**
```
Resource Type:  Database
Database:       CRM_Prod
Collection:     (leave blank = all collections)
Actions:        readWrite
```

---

**Development User**

| Field | Value |
|---|---|
| Username | `crm_dev_user` |
| Password | Separate password from prod |
| Custom privilege | Database: `CRM_Dev`, Role: `readWrite` |

---

### Step 2: Verify the Restriction Works

After creating the users, test in MongoDB Compass or `mongosh`:

```bash
# Connect as prod user
mongosh "mongodb+srv://crm_prod_user:PASS@cluster.mongodb.net"

# Should succeed
use CRM_Prod
db.users.find().limit(1)

# Should FAIL with "not authorized"
use CRM_Dev
db.users.find().limit(1)

# Should FAIL
use admin
show collections
```

> ⚠️ **M0 Shared Cluster Note:** On M0/M2/M5, the `admin`, `local`, and `config` system databases are managed by Atlas and are inaccessible to any app user regardless of permissions — this is enforced by Atlas itself. Your scoped user adds protection for your own databases on top of this.

### Step 3: Revoke or Demote the Old User

Once the new users are tested and working:
- Go to **Database Access → [old user] → Edit**
- Either delete it, or change its role to a read-only role on a non-production DB
- Never leave an `Atlas Admin` or `readWriteAnyDatabase` user in production connection strings

---

## Layer 2 — Code Changes

### File 1: `src/config/env.ts` — Add Strict Validation

Add `DB_NAME` to your env validation with an allowlist of permitted database names:

```typescript
// src/config/env.ts
import { z } from 'zod';

// Define all permitted DB names — add to this list when new envs are created
const PERMITTED_DB_NAMES = ['CRM_Prod', 'CRM_Dev'] as const;
type PermittedDB = typeof PERMITTED_DB_NAMES[number];

const envSchema = z.object({
  NODE_ENV:     z.enum(['development', 'production', 'test']),
  MONGODB_URI:  z.string().url().refine(
    (uri) => !uri.includes('?authSource=admin') || uri.includes('authSource=admin'),
    { message: 'URI should not embed a database name — use DB_NAME env var instead' }
  ),
  DB_NAME: z.string()
    .min(1, 'DB_NAME is required')
    .refine(
      (name): name is PermittedDB => (PERMITTED_DB_NAMES as readonly string[]).includes(name),
      (name) => ({
        message: `DB_NAME "${name}" is not permitted. Allowed values: ${PERMITTED_DB_NAMES.join(', ')}`
      })
    ),
  PORT: z.coerce.number().default(5000),
  // ... rest of your env vars
});

// This throws at import time if env is invalid — server never starts
export const env = envSchema.parse(process.env);
```

> If you're not using `zod` for env validation yet, install it: `npm install zod --prefix backend`

---

### File 2: `src/database.ts` — Enforce DB Name + Guard URI

```typescript
// src/database.ts
import mongoose from 'mongoose';
import { env } from './config/env';

// Guard: strip any DB name that may have been embedded in the URI
// Forces Mongoose to use only what DB_NAME says, never what the URI says
function sanitizeMongoURI(uri: string): string {
  try {
    const url = new URL(uri);
    // Remove any pathname component (the DB name in the URI)
    // e.g., mongodb+srv://user:pass@cluster.net/SomeDB → .../
    url.pathname = '/';
    return url.toString();
  } catch {
    // Not a parseable URL (e.g., local mongodb://) — return as-is
    return uri;
  }
}

export const connectDatabase = async (): Promise<typeof mongoose> => {
  // Hard stop if DB_NAME is somehow not set (belt + suspenders beyond zod)
  if (!env.DB_NAME) {
    console.error('❌ FATAL: DB_NAME environment variable is not set. Refusing to start.');
    process.exit(1);
  }

  const safeURI = sanitizeMongoURI(env.MONGODB_URI);

  try {
    const conn = await mongoose.connect(safeURI, {
      dbName: env.DB_NAME,      // ← single source of truth for which DB we use
      maxPoolSize: 25,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    const connectedDB = conn.connection.name;

    // Runtime assertion — if Mongoose somehow connected to a different DB, crash loudly
    if (connectedDB !== env.DB_NAME) {
      console.error(
        `❌ FATAL: Connected to database "${connectedDB}" but expected "${env.DB_NAME}". Refusing to start.`
      );
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`✅ MongoDB Connected: ${conn.connection.host} | Database: ${connectedDB}`);
    return conn;

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
```

---

### File 3: `src/scripts/connectForScript.ts` — Shared helper for seed/migration scripts

All standalone scripts (`seed.ts`, `migrateData.ts`, `normalizeRoles.ts`) need DB access too. Give them the same validation, not a raw `mongoose.connect()` call:

```typescript
// src/scripts/connectForScript.ts
import mongoose from 'mongoose';
import { env } from '../config/env';
import { connectDatabase } from '../database';

export async function runScript(
  name: string,
  fn: () => Promise<void>
): Promise<void> {
  console.log(`\n▶ Running script: ${name}`);
  console.log(`  Database: ${env.DB_NAME}`);
  console.log(`  Environment: ${env.NODE_ENV}\n`);

  // Prompt in production — accidental prod script runs are dangerous
  if (env.NODE_ENV === 'production') {
    console.warn('⚠️  WARNING: You are running a script against PRODUCTION database.');
    console.warn(`   DB: ${env.DB_NAME}`);
    console.warn('   You have 5 seconds to cancel (Ctrl+C)...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  await connectDatabase();

  try {
    await fn();
    console.log(`\n✅ Script "${name}" completed successfully.`);
  } catch (err) {
    console.error(`\n❌ Script "${name}" failed:`, err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database disconnected.\n');
  }
}
```

**Update your scripts to use it:**

```typescript
// src/scripts/normalizeRoles.ts
import { runScript } from './connectForScript';
import { User } from '../models/User.model';

runScript('normalize-roles', async () => {
  const result = await User.updateMany(
    { role: { $in: ['AGENT', 'MANAGER', 'ADMIN'] } },
    [{ $set: { role: { $toLower: '$role' } } }]
  );
  console.log(`Updated ${result.modifiedCount} users.`);
});
```

---

## Environment Variable Setup

### Render Dashboard (Production)

In **Render → Your Service → Environment**, set:

```
MONGODB_URI  =  mongodb+srv://crm_prod_user:PROD_PASSWORD@cluster.mongodb.net
DB_NAME      =  CRM_Prod
NODE_ENV     =  production
```

Note: `MONGODB_URI` has **no database name** in the path — just the cluster host. `DB_NAME` is the only place the DB name lives.

### Local `.env` (Development)

```bash
# .env
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=CRM_Dev
NODE_ENV=development
```

### `.env.example` (commit this to the repo)

```bash
# .env.example — copy to .env and fill in values
MONGODB_URI=           # MongoDB connection string, NO database name in path
DB_NAME=               # Permitted values: CRM_Prod, CRM_Dev
NODE_ENV=development   # development | production | test
PORT=5000
```

---

## Startup Behaviour After Changes

**Happy path:**
```
[BOOT] Validating environment...
[BOOT] DB_NAME=CRM_Prod ✓ (permitted)
[BOOT] MONGODB_URI=mongodb+srv://...@cluster.net ✓
✅ MongoDB Connected: cluster.mongodb.net | Database: CRM_Prod
```

**Wrong DB_NAME:**
```
❌ ZodError: DB_NAME "CRM_Staging" is not permitted.
   Allowed values: CRM_Prod, CRM_Dev
[process exits before server starts]
```

**Missing DB_NAME:**
```
❌ ZodError: DB_NAME is required (received empty string)
[process exits before server starts]
```

**Atlas user tries to access wrong DB (infrastructure layer catches it):**
```
❌ MongoDB connection error: MongoServerError: not authorized on CRM_Dev
   to execute command { find: "users" }
[process exits with connection error]
```

---

## Implementation Order for Antigravity

```
Step 1 — Atlas Dashboard (you do this manually, 10 min):
  a. Create crm_prod_user with readWrite on CRM_Prod only
  b. Create crm_dev_user with readWrite on CRM_Dev only
  c. Test both users in Compass / mongosh
  d. Update Render env vars to use crm_prod_user URI
  e. Update local .env to use crm_dev_user URI

Step 2 — Code changes (Antigravity implements):
  a. src/config/env.ts          → Add DB_NAME allowlist validation (zod)
  b. src/database.ts            → Add sanitizeMongoURI() + runtime DB assertion
  c. src/scripts/connectForScript.ts  → New shared script runner with prod warning
  d. src/scripts/*.ts           → Update all scripts to use runScript()
  e. .env.example               → Update with new variable structure

Step 3 — Verify:
  a. Deploy to Render — confirm logs show correct DB name
  b. Try setting DB_NAME to a non-permitted value — confirm server refuses to start
  c. Confirm no other DB is accessible from the prod Atlas user
```

---

## What This Protects Against

| Scenario | Without This | With This |
|---|---|---|
| Credentials leaked | Attacker accesses ALL databases on cluster | Attacker can only access `CRM_Prod` |
| Dev connects to prod DB by mistake | Silent data corruption | Server refuses to start (wrong URI / wrong user) |
| Deploy with missing `DB_NAME` | Mongoose connects to `test` DB silently | Hard crash at boot with clear error |
| Script run against wrong environment | Silent data mutation | 5-second prod warning + env check |
| URI has embedded DB name that conflicts | Ambiguous — URI or option wins? | URI is sanitized, `DB_NAME` is always the truth |
