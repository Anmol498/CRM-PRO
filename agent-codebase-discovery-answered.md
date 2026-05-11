# 🗺️ Codebase Navigation & Agent Handoff — Discovery Questionnaire (Answered & Gap-Filled)

**Goal:** Build a living reference file your coding agent reads FIRST before touching anything — so it knows exactly where to add code, what patterns to follow, and what not to break.

---

## 1. Project Structure

- **Directory tree**:
  ```
  .
  ├── archive
  ├── backend
  │   ├── dist
  │   └── src
  │       ├── config
  │       ├── controllers
  │       ├── jobs
  │       ├── middleware
  │       ├── models
  │       ├── routes
  │       ├── scripts
  │       ├── services
  │       ├── sse
  │       ├── types
  │       └── utils
  ├── docs
  ├── frontend
  │   ├── dist
  │   ├── public
  │   ├── scripts
  │   └── src
  │       ├── api
  │       ├── assets
  │       ├── components
  │       │   ├── layout
  │       │   └── ui
  │       ├── context
  │       ├── data
  │       ├── features
  │       │   ├── analytics
  │       │   ├── auth
  │       │   ├── bookings
  │       │   │   ├── components
  │       │   │   └── pages
  │       │   ├── notifications
  │       │   ├── settings
  │       │   ├── shared
  │       │   └── users
  │       ├── hooks
  │       ├── lib
  │       ├── types
  │       └── utils
  ├── integrations
  ├── scripts
  └── shared
  ```

- **Where does each concern live?**

  | Concern | Path |
  |---|---|
  | API route definitions | `backend/src/routes/` |
  | Controller logic | `backend/src/controllers/` |
  | Mongoose models | `backend/src/models/` |
  | Middleware (auth, validation, etc.) | `backend/src/middleware/` |
  | Business logic / services | `backend/src/services/` (and controllers) |
  | Utility / helper functions | `backend/src/utils/` |
  | Type definitions / interfaces | `backend/src/types/` and `shared/` |
  | Config & env | `backend/src/config/` |
  | Cron jobs | `backend/src/jobs/` |
  | Frontend pages / views | `frontend/src/features/[feature]/pages/` |
  | Frontend components | `frontend/src/features/[feature]/components/` and `frontend/src/components/` |
  | Frontend hooks | `frontend/src/hooks/` and `frontend/src/features/[feature]/hooks/` |
  | Frontend API calls (axios/fetch) | `frontend/src/api/client.ts` (called directly in components/hooks) |
  | Frontend state management | `frontend/src/context/` and React Query |
  | Shared types (used by both FE & BE) | `shared/` |

---

## 2. Naming Conventions

- **What naming pattern do files follow?**
  - Controllers: `name.controller.ts` (e.g., `booking.controller.ts`)
  - Models: `Name.model.ts` (e.g., `Booking.model.ts`)
  - Routes: `name.routes.ts` (e.g., `booking.routes.ts`)
  - Services: `name.service.ts`
  - Frontend components: `PascalCase.tsx` (e.g., `Sidebar.tsx`)
  - Frontend hooks: `useCamelCase.ts` (e.g., `useGlobalSync.ts`)
  - Frontend pages: `PascalCasePage.tsx` (e.g., `BookingsPage.tsx`)

- **Organization**:
  - [x] Feature folders (Frontend: `src/features/[feature]/`)
  - [x] Type folders (Backend: `src/controllers/`, `src/models/`, etc.)

---

## 3. Data Flow & API Pattern

- **How the frontend calls the backend**:
  - [x] **Direct axios calls**: `api.get('/path')` directly inside the React hook or component.
  - [ ] **No dedicated resource files**: There are no files like `api/bookings.ts`. Named functions should NOT be created unless explicitly asked.
  - [x] **State Management**: React Query (TanStack) is the source of truth for server state.

- **React Query Key Registry**:
  - `['bookings']` (Base list key)
  - `['booking', id]` (Specific booking detail)
  - `['agents']`, `['agents-minimal']`
  - `['comments', id]`
  - `['dashboard-stats']`
  - `['recent-bookings']`
  - `['dropdown-settings']`
  - `['users']`
  - `['notifications', user?.id]`
  - `['global-sync', user?.id]`
  - `['calendar-events', date]`
  - `['analytics-bookings', filters]`, `['analytics-payments', filters]`, etc.

- **Mutation Rule**: Always invalidate relevant keys after a success.
  ```typescript
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
    queryClient.invalidateQueries({ queryKey: ['booking', id] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
  }
  ```

---

## 4. User-Scoping & Security Rules

Scoping logic is applied **manually** inside each controller function. The agent must replicate this filter pattern for new data fetches:

| Role | Booking Query Filter |
|---|---|
| `ADMIN` / `MANAGER` | `{} ` (sees all) |
| `AGENT` / `VISA` / `TICKETING` | `{ $or: [{ participantIds: userId }, { assignedGroup: { $in: userGroups } }] }` |
| `OPERATIONS` / `ACCOUNT` | `{ status: 'Booked' }` |
| `MARKETER` | `{ participantIds: userId }` |

- **User Extraction**: Always use `req.user` (set by `protect` middleware).
- **Embedded Snapshots**: Many features rely on the `contact` object embedded in `Booking`. When updating contact details, update the `contact` snapshot in the `Booking` model, not just the `PrimaryContact` collection.

---

## 5. SSE & Real-Time Updates

- **When to use**: SSE should be emitted for any data change that other logged-in users need to see immediately (collaborative environment).
- **Pattern**:
  ```typescript
  // From controller
  pushBookingEvent('booking_updated', {
      bookingId:        id,
      assignedToUserId: String(updatedBooking.assignedToUserId || ''),
      assignedGroup:    updatedBooking.assignedGroup || '',
      createdByUserId:  String(updatedBooking.createdByUserId || ''),
      status:           updatedBooking.status,
  });
  ```
- **Frontend handling**: `frontend/src/hooks/useSSE.ts` handles invalidating React Query caches or patching them optimistically when events arrive.

---

## 6. The "God File": `booking.controller.ts`

- **Rule**: This file is 1600+ lines. **Never rewrite it wholesale.**
- **Appending**: New booking-related logic should be added as new functions at the **bottom** of the file.
- **Extraction**: Only extract logic into `backend/src/services/` if explicitly requested or if logic is becoming excessively redundant across 3+ handlers.
- **Background Tasks**: Use `setImmediate(() => runBG(...))` for non-critical side effects (logging, notifications, legacy sync) to keep API responses fast (<100ms).

---

## 7. Known Pitfalls (Lessons Learned)

- **Mapping Gaps**: Forgetting to map the embedded `contact` snapshot fields to the frontend UI leads to "Unknown" fields.
- **Schema Persistence**: When adding financial fields (margins, actual amounts), ensure they are added to the Mongoose schema and saved during the "Finalize" flow, or they will reset to zero.
- **Query Key Specificity**: Invalidating `['bookings']` is often not enough for the Detail view; you must also invalidate `['booking', id]`.
- **Validation**: Backend validation schemas live in `backend/src/types/index.ts`. Always check/update these when changing payload structures.

---

## 8. Development & Verification

- **Running Locally**: `npm run dev` in both `frontend` and `backend` directories.
- **Testing**: No automated test suite. Manual verification via the UI is required.
- **Errors**: Surface errors to users via `sonner` toasts on the frontend.
