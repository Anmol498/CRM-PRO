# 🗺️ Codebase Navigation — Gap-Fill Questionnaire (Round 2)

Just 6 areas. These are the specific gaps that will cause the agent to keep breaking features even with the first answers in hand.

---

## Gap 1 — API Call Pattern: Direct vs. Resource Files

The first answers show API calls made directly inside components:
```typescript
// Inside NewBookingModal.tsx
api.post('/bookings', combinedData)
```
There is no dedicated `frontend/src/api/bookings.ts` file with named functions.

- **Is this intentional — the pattern to follow going forward?**
  - [ ] Yes — always call `api.get/post/patch/delete` directly inside the hook or component
  - [ ] No — it should be in a resource file like `api/bookings.ts` but the agent never created one
  - [ ] Mixed — simple one-off calls inline, complex/reused calls in a resource file

- **If resource files should exist, what should they look like?**
  ```typescript
  // Option A — plain async functions
  export const createBooking = (data: CreateBookingInput) =>
    api.post('/bookings', data).then(r => r.data);

  // Option B — object namespace
  export const bookingApi = {
    create: (data) => api.post('/bookings', data).then(r => r.data),
    getAll: (filters) => api.get('/bookings', { params: filters }).then(r => r.data),
  };
  ```
  Your preference: ___________

- **Where should these files live?**
  - [ ] `frontend/src/api/bookings.ts` (flat, by resource)
  - [ ] `frontend/src/features/bookings/api.ts` (co-located with feature)
  - [ ] No change needed — keep calling inline

---

## Gap 2 — User-Scoping Rules (The #1 Cause of Broken Features)

The first answers mention role-based visibility but the exact DB query rules aren't documented. The agent needs to know *exactly* what filter to add for each role — without this it either shows everyone's data to agents or blocks admins from seeing anything.

- **Fill in the query filter for each role when fetching bookings:**

  | Role | Query filter applied |
  |---|---|
  | `admin` / `manager` | No filter — sees all bookings |
  | `agent` | e.g., `{ assignedTo: req.user._id }` |
  | `operations` | e.g., `{ assignedGroup: req.user.group }` ? |
  | `accounts` | ? |
  | `marketer` | ? |

- **Where is this scoping logic currently applied?**
  - [ ] Inside each controller function manually
  - [ ] A shared middleware that sets `req.query.scope`
  - [ ] A shared service helper function — name/file: ___________
  - [ ] Inconsistent — some controllers have it, some don't

- **When a new feature fetches any user-linked data, is there a single function the agent should call to get the correct filter for the current user's role?**
  - [ ] Yes — function name + file: ___________
  - [ ] No — the agent must manually write the role check each time
  - [ ] There should be one but it doesn't exist yet

---

## Gap 3 — The God File: `booking.controller.ts` (1600+ lines)

The agent is told never to rewrite it wholesale — but it's not told how to handle adding new booking-related logic.

- **When a new booking-related feature needs backend logic, where should it go?**
  - [ ] Add a new function to `booking.controller.ts` at the bottom
  - [ ] Create a new service in `backend/src/services/` and call it from the controller
  - [ ] Create a new slim controller file (e.g., `bookingStats.controller.ts`) for distinct sub-features
  - [ ] It depends — describe the rule: ___________

- **Are there sections inside `booking.controller.ts` that are off-limits even for appending?**
  (e.g., the top 200 lines of core CRUD, the cache invalidation logic)
  Describe: ___________

- **Should the agent ever extract logic out of `booking.controller.ts` into a service during a feature addition?**
  - [ ] Yes — if the new feature needs existing logic, extract it first
  - [ ] No — never refactor while adding a feature, only append
  - [ ] Only if explicitly asked

---

## Gap 4 — SSE: When Does a New Feature Need to Emit an Event?

SSE is mentioned as existing but there's no rule for when new features should use it.

- **What is SSE currently used for?** (list the events that are emitted today)
  e.g., `booking_created`, `booking_assigned`, `booking_status_changed`, `agent_online`...
  List them: ___________

- **The rule for new features — when should the agent emit an SSE event vs. just letting React Query refetch?**
  - [ ] SSE for any data change that other logged-in users need to see immediately
  - [ ] SSE only for specific high-priority events (list: ___________)
  - [ ] SSE only for notifications — data changes always use React Query polling/invalidation
  - [ ] No clear rule yet — agent should ask before adding SSE

- **How does an SSE event get emitted from a controller?** (paste the pattern)
  ```typescript
  // e.g.,
  sseHandler.emit('booking_updated', { bookingId: booking._id });
  // or
  broadcastToRole('manager', 'booking_created', payload);
  ```
  Actual pattern: ___________

- **When the frontend receives an SSE event, what does it do?**
  - [ ] Calls `queryClient.invalidateQueries(...)` to refetch
  - [ ] Updates Zustand/Context directly
  - [ ] Both depending on the event
  - [ ] File that handles this: ___________

---

## Gap 5 — Features That Broke: Real Examples

The 3 recent features listed were infrastructure tasks, not product features. This section is specifically about things that broke during testing so the agent doesn't repeat the same mistakes.

Think of the last 2–3 times you tested something the agent built and it didn't work right.

- **Broken feature 1:**
  - What was it supposed to do? ___________
  - What actually happened? ___________
  - What was the root cause? (even a guess)
    - [ ] Agent forgot to add the route to `routes/index.ts`
    - [ ] Agent forgot to scope the query by user role
    - [ ] Agent forgot to invalidate the cache after mutation
    - [ ] Agent forgot to emit an SSE event
    - [ ] Agent created a new pattern instead of following the existing one
    - [ ] Agent rewrote something it shouldn't have
    - [ ] Frontend mutation didn't invalidate the right React Query key
    - [ ] Other: ___________

- **Broken feature 2:**
  - What was it supposed to do? ___________
  - What actually happened? ___________
  - Root cause: ___________

- **Broken feature 3 (optional):**
  - What was it supposed to do? ___________
  - What actually happened? ___________
  - Root cause: ___________

---

## Gap 6 — React Query Keys: The Exact Registry

Invalidating the wrong query key is a silent bug — the UI doesn't update after a mutation and it looks like the feature "doesn't work" even though the backend saved correctly.

- **List every React Query key currently in use** (or paste a grep result):
  ```bash
  # Run this in frontend/src and paste the output:
  grep -r "queryKey" --include="*.ts" --include="*.tsx" -h | sort | uniq
  ```

- **Is there a central file where query keys are defined as constants?**
  - [ ] Yes — file: ___________
  - [ ] No — strings are written inline wherever they're used

- **When a booking is created/updated/deleted, which query keys must be invalidated?**
  List all of them (there are often more than one):
  e.g., `['bookings']`, `['bookings', 'stats']`, `['agents']` (if agent assignment changed)...
  ___________

- **Is there a case where invalidating `['bookings']` is NOT enough and a more specific key is needed?**
  (e.g., a booking detail page uses `['booking', id]` separately)
  - [ ] Yes — describe: ___________
  - [ ] No — `['bookings']` always covers it

---

*These 6 answers + your original answers = enough to build the complete agent reference file with zero guesswork.*
