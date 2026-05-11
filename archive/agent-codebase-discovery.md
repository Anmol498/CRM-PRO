# 🗺️ Codebase Navigation & Agent Handoff — Discovery Questionnaire

**Goal:** Build a living reference file your coding agent reads FIRST before touching anything — so it knows exactly where to add code, what patterns to follow, and what not to break.

Answer as much as you can. Rough answers are fine — we'll infer the rest from patterns.

---

## 1. Project Structure

- **Paste your directory tree** (2–3 levels deep is enough):
  ```
  # Run this and paste the output:
  # find . -type d -not -path '*/node_modules/*' -not -path '*/.git/*' | sort
  ```

- **Where does each concern live?** Fill in the actual folder paths:

  | Concern | Path |
  |---|---|
  | API route definitions | e.g., `backend/src/routes/` |
  | Controller logic | |
  | Mongoose models | |
  | Middleware (auth, validation, etc.) | |
  | Business logic / services | |
  | Utility / helper functions | |
  | Type definitions / interfaces | |
  | Config & env | |
  | Cron jobs | |
  | Frontend pages / views | |
  | Frontend components | |
  | Frontend hooks | |
  | Frontend API calls (axios/fetch) | |
  | Frontend state management | |
  | Shared types (used by both FE & BE) | |

- **Is there a `shared/` package with types used by both frontend and backend?**
  - [ ] Yes — path: ___________
  - [ ] No — types are duplicated in each

---

## 2. Naming Conventions

Consistent naming is the #1 thing that helps an agent find the right file without scanning everything.

- **What naming pattern do files follow?**
  - Controllers: (e.g., `booking.controller.ts`, `BookingController.ts`)
  - Models: (e.g., `booking.model.ts`, `Booking.ts`)
  - Routes: (e.g., `booking.routes.ts`, `bookingRouter.ts`)
  - Services: 
  - Frontend components: (e.g., `BookingCard.tsx`, `booking-card.tsx`)
  - Frontend hooks: (e.g., `useBookings.ts`, `useBookingData.ts`)
  - Frontend pages: 

- **Is there a barrel file (`index.ts`) pattern used for exports?**
  - [ ] Yes — most folders have an `index.ts`
  - [ ] Some folders do, some don't
  - [ ] No

- **Are feature folders used (all files for one feature together), or are files grouped by type (all controllers together)?**
  - [ ] Feature folders (e.g., `bookings/booking.controller.ts`, `bookings/booking.model.ts`)
  - [ ] Type folders (e.g., `controllers/booking.ts`, `models/booking.ts`)
  - [ ] Mixed

---

## 3. How a Feature is Built — The Full Anatomy

Walk through ONE existing feature end-to-end (e.g., "create a booking" or "assign an agent"). For each layer, paste the actual file path and a 1-line description of what it does:

- **Route definition:** (file + what it registers)
- **Middleware on that route:** (auth check? validation schema?)
- **Controller function:** (file + what it does)
- **Service/business logic:** (file + what it does, or "none — logic is in controller")
- **Mongoose model used:** (file)
- **How errors are returned:** (e.g., `res.status(400).json({ error: '...' })` or a custom wrapper?)
- **Frontend API call:** (file + function name)
- **Frontend hook:** (file + what state it manages)
- **Frontend component that renders the result:** (file)
- **Any global state updated?** (e.g., React Query invalidation, Zustand store, Context)

---

## 4. Data Flow & State Management

- **How does the frontend call the backend?**
  - [ ] Axios with a central instance (file path: ___________)
  - [ ] Native fetch
  - [ ] React Query / TanStack Query
  - [ ] SWR
  - [ ] Other: ___________

- **Is there a central API client file?** (e.g., `api/client.ts`, `lib/axios.ts`)
  - Path: ___________

- **Are API functions organized by resource?** (e.g., `api/bookings.ts`, `api/users.ts`)
  - [ ] Yes — path pattern: ___________
  - [ ] No — all in one file
  - [ ] No — called directly in components/hooks

- **Frontend state management:**
  - [ ] React Query (TanStack) — query keys pattern: ___________
  - [ ] Zustand — store files at: ___________
  - [ ] Redux / RTK
  - [ ] React Context — contexts at: ___________
  - [ ] Local state only (useState/useReducer)
  - [ ] Mixed — describe: ___________

- **When a mutation succeeds (e.g., booking created), how does the UI update?**
  - [ ] React Query cache invalidation (`queryClient.invalidateQueries`)
  - [ ] Zustand store updated directly
  - [ ] Component re-fetches manually
  - [ ] Page refreshes
  - [ ] Other: ___________

---

## 5. Authentication & Authorization

- **How is the logged-in user identified in API requests?**
  - [ ] JWT in `Authorization: Bearer` header
  - [ ] HTTP-only cookie
  - [ ] Session
  - [ ] Other: ___________

- **Where is the auth middleware defined?**
  - File: ___________
  - Function name: ___________

- **How is the user extracted in a controller?** (paste the pattern)
  ```typescript
  // e.g.,
  const user = req.user as IUser;
  // or
  const { userId, role } = req.auth;
  ```

- **Are there role-based guards?** (e.g., agent vs manager vs admin)
  - [ ] Yes — middleware file: ___________
  - [ ] No

- **On the frontend, where is auth state stored?**
  - [ ] Context (file: ___________)
  - [ ] Zustand store
  - [ ] React Query
  - [ ] localStorage / cookie read directly

---

## 6. Validation

- **How is request validation done on the backend?**
  - [ ] Zod schemas (where are they defined: ___________)
  - [ ] Joi
  - [ ] Express-validator
  - [ ] Manual checks in controller
  - [ ] No validation currently

- **Is there a pattern for where validation schemas live?**
  - [ ] Co-located with the route file (e.g., `booking.routes.ts` has the schema)
  - [ ] Separate `schemas/` or `validators/` folder
  - [ ] Inside the controller

- **Are validation schemas shared between frontend and backend?**
  - [ ] Yes — via the shared package
  - [ ] No — duplicated

---

## 7. Error Handling

- **Is there a global error handler middleware?**
  - [ ] Yes — file: ___________
  - [ ] No — errors handled per controller

- **What does a standard error response look like?** (paste an example)
  ```json
  // e.g.,
  { "error": "Booking not found" }
  // or
  { "success": false, "message": "...", "code": 404 }
  ```

- **On the frontend, how are API errors surfaced to the user?**
  - [ ] Toast notifications (library: ___________)
  - [ ] Inline error messages in forms
  - [ ] Error boundaries
  - [ ] Alert dialogs
  - [ ] Mixed

---

## 8. Known Patterns the Agent Must Follow

These are conventions that, if broken, cause bugs.

- **Is there a standard wrapper for async route handlers to catch errors?**
  ```typescript
  // e.g., does every controller use:
  router.get('/bookings', asyncHandler(getBookings));
  // or
  router.get('/bookings', async (req, res, next) => { try {...} catch(e) { next(e) } });
  ```

- **Are there any "god files" the agent should never rewrite wholesale?**
  (e.g., a 500-line `server.ts` or a monolithic `App.tsx`)
  List them: ___________

- **Are there any files/folders that are auto-generated and should never be manually edited?**
  (e.g., `dist/`, prisma generated files, codegen outputs)
  List them: ___________

- **Is there a pattern for how new routes are registered?**
  (e.g., all routes imported in one `routes/index.ts` and mounted in `app.ts`)
  Describe: ___________

- **Is there a pattern for how new Mongoose models are registered/exported?**
  Describe: ___________

---

## 9. Feature-Specific Gotchas

These are the things that cause features to "not work" even when the code looks correct.

- **Are there any caches that need to be invalidated when data changes?**
  (e.g., the agent cache, dropdown cache from your startup plan)
  List what gets cached and what triggers invalidation: ___________

- **Are there any real-time / SSE / WebSocket channels that need to be updated when data changes?**
  - [ ] Yes — describe: ___________
  - [ ] No

- **Are there any background jobs (cron, queue) that interact with the same data a new feature might touch?**
  List them: ___________

- **Are there any multi-tenancy or user-scoping rules?**
  (e.g., agents can only see their own bookings, managers see all)
  Describe: ___________

- **Are there fields that look optional but must always be set?**
  (e.g., `assignedTo` defaults to null but downstream code assumes it's always populated)
  List them: ___________

---

## 10. Testing

- **Is there any test suite currently?**
  - [ ] Yes — framework: ___________, location: ___________
  - [ ] No

- **When the agent adds a feature, should it also write tests?**
  - [ ] Yes — always
  - [ ] Yes — only for business logic
  - [ ] No — not yet

- **Is there a way to run the app locally to verify a feature before deploying?**
  - [ ] Yes — command: ___________
  - [ ] Partial (backend runs but frontend needs manual setup)
  - [ ] No local environment documented

---

## 11. The 3 Most Recent Features Added

This tells us if there are patterns the agent is already getting wrong.

For each, describe briefly:
1. **Feature:** What was it?
   **What broke / didn't work:** ___________
   **Root cause (if known):** ___________

2. **Feature:** ___________
   **What broke:** ___________
   **Root cause:** ___________

3. **Feature:** ___________
   **What broke:** ___________
   **Root cause:** ___________

---

## 12. Agent Instructions Style

- **Which coding agent are you using?**
  - [ ] Cursor
  - [ ] Windsurf
  - [ ] GitHub Copilot (agent mode)
  - [ ] Claude Code
  - [ ] Other: ___________

- **Does the agent support a project-level instruction file?**
  (e.g., `.cursorrules`, `CLAUDE.md`, `.windsurfrules`)
  - [ ] Yes — file name: ___________
  - [ ] Not sure

- **What format works best for the agent to follow instructions?**
  - [ ] Numbered rules
  - [ ] Code examples it can pattern-match
  - [ ] Both
  - [ ] Not sure

---

*Fill in what you know — blank answers are fine, we'll mark those sections as "to be documented" in the output file. The goal is a single reference the agent reads before every task, not a perfect spec.*
