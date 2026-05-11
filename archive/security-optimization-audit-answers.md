# 🔐 Security, Vulnerability & Optimization Audit — Answers

This document provides answers to the security and optimization audit questionnaire for the Travel CRM project.

---

## 1. 🔑 Authentication & Authorization

1. **How are users authenticated?**
   - [x] JWT (JSON Web Tokens)
2. **If using JWT — where are tokens stored on the frontend?**
   - [x] `localStorage`  ⚠️ (Found in `AuthContext.tsx` and `api/client.ts`)
3. **What is the JWT token expiry time?**
   - **30 days** (`30d`) as configured in `travel-crm-backend/src/utils/jwt.ts`.
4. **Is there a refresh token mechanism?**
   - No refresh token mechanism is implemented; a single long-lived token is used.
5. **Is role-based access control (RBAC) implemented?**
   - [x] Yes — Roles include `ADMIN`, `AGENT`, `MARKETER`, `VISA`, `TICKETING`, `OPERATION`, and `ACCOUNT`. Permissions include `leadVisibility`, `canAssignLeads`, etc., defined in `User.ts`.
6. **Are protected API routes actually verified server-side?**
   - Yes, the `protect` and `adminGuard` middleware in `auth.ts` verify tokens and roles on every protected request.
7. **Are passwords hashed before storing in the database?**
   - [x] Yes — using `bcrypt` with 10 rounds (found in `utils/password.ts`).
8. **Is there any brute-force protection on login endpoints?**
   - [x] None ⚠️ (No rate limiting middleware detected in `server.ts` or `authRoutes.ts`).

---

## 2. 🌐 API & Backend Security

9. **Is CORS configured on the backend?**
   - [x] Yes — but set to `*` (allow all) in production (found in `server.ts`).
10. **Is input validation done on the backend?**
    - [x] Yes — using **Zod** (e.g., `loginSchema.safeParse(req.body)` in `authController.ts`).
11. **Is there any protection against SQL Injection or NoSQL Injection?**
    - [x] Yes — using an ODM (**Mongoose**). However, some dynamic regexes are constructed in `bookingController.ts` which could be a minor risk if input is malicious.
12. **Are HTTP security headers set?**
    - [x] Not set ⚠️ (`helmet` is not used in `server.ts`).
13. **Is there protection against CSRF (Cross-Site Request Forgery)?**
    - [x] No protection ⚠️ (JWT in `localStorage` doesn't protect against CSRF unless same-site cookies are used for the token, which they aren't here).
14. **Are there any file upload endpoints?**
    - No file upload endpoints found in the current backend controllers.
15. **Are API keys or secrets ever returned in API responses?**
    - No, the controllers use `.lean()` and explicitly select fields or return safe objects.
16. **Is the API rate-limited?**
    - [x] No ⚠️
17. **Are error messages in API responses generic or detailed?**
    - Login returns a generic "Invalid email or password". Development error handler returns stacks; production error handler (if set) returns generic messages.

---

## 3. 🖥️ Frontend Security

18. **Is user-generated content ever rendered directly as HTML?**
    - [x] No (Grep search for `dangerouslySetInnerHTML` yielded no results).
19. **Are there any third-party scripts loaded on the page?**
    - No explicit third-party scripts found in `index.html`.
20. **Are API base URLs or any backend URLs hardcoded in the frontend code?**
    - [x] Using environment variables (`import.meta.env.VITE_API_URL` in `api/client.ts`).
21. **Are any sensitive values in the frontend `.env` file prefixed with `REACT_APP_`?**
    - N/A — Frontend uses Vite, so variables are prefixed with `VITE_`.
22. **Is the frontend bundle analyzed for size?**
    - No explicit bundle analysis tool (like `rollup-plugin-visualizer`) found in `vite.config.ts`.

---

## 4. 🗄️ Database Security

23. **Is the database exposed to the public internet, or only accessible from the backend server?**
    - Intended for MongoDB Atlas; likely restricted via IP allowlist in production.
24. **Does the database use a strong password?**
    - Yes (connection string found in `.env`), but the password has been leaked to version control.
25. **Does the app connect to the database with a least-privilege user?**
    - Likely using a single admin-level user from Atlas.
26. **Is the database connection string stored in an `.env` file and excluded from Git?**
    - **No** 🚨 Stored in `.env` but `.env` IS tracked by Git.
27. **Is there any database backup strategy in place?**
    - [x] No backups ⚠️ (None detected in the repository).
28. **Are database queries logged?**
    - Yes, slow queries (>100ms) are logged via Mongoose hooks in `User.ts` and other models. Sensitive fields like `passwordHash` are excluded from the `User` queries.

---

## 5. 🔒 Secrets & Environment Variables

29. **List all the secrets/keys your project uses.**
    - `MONGODB_URI` / `DATABASE_URL`
    - `JWT_SECRET`
    - `EXTERNAL_API_KEY` (for WordPress integration)
30. **Are ALL secrets stored in `.env` files, never hardcoded in source code?**
    - [x] Yes — all in `.env` ✅
31. **Is the `.env` file listed in `.gitignore`?**
    - [x] No 🚨 (Confirmed via `git ls-files`).
32. **Has the `.env` file or any secrets EVER been committed to Git by accident?**
    - [x] Yes 🚨 (Current repository state includes `.env`).
33. **Is there a `.env.example` file?**
    - Yes, found in `travel-crm-backend/.env.example`.

---

## 6. 📦 Dependencies & Supply Chain

34. **When was the last time you ran `npm audit`?**
    - Run on 2026-05-10: **0 vulnerabilities** found in both frontend and backend.
35. **Are there any packages that are heavily outdated?**
    - `mongoose` (9.2.4 vs 9.6.2) and `express` (4.22.1 vs 5.2.1) are notably behind.
36. **Are there any unused packages?**
    - `prisma` scripts exist in the root `package.json`, but `prisma` is not in the backend dependencies.
37. **Is `package-lock.json` committed to the repo?**
    - [x] Yes ✅
38. **Are you using any unofficial or obscure npm packages?**
    - No, major libraries (TanStack, Radix, Mongoose, etc.) are standard.

---

## 7. 🚀 Performance & Optimization

39. **Has Lighthouse been run?**
    - No scores available yet.
40. **Is code splitting implemented?**
    - [x] No ⚠️ (Pages are imported statically in `App.tsx`).
41. **Are images optimized?**
    - [x] No optimization ⚠️ (No image optimization pipeline found).
42. **Is there any caching strategy for static assets?**
    - Handled by Vercel for the frontend.
43. **Are there any large libraries imported fully?**
    - No obvious ones like full `lodash` imports detected.
44. **Is the React app memoized?**
    - Some use of `useMemo` and `useCallback` likely, but not pervasive.

45. **Are database queries optimized?**
    - [x] Indexes are set on frequently queried fields (e.g., `email` in `User.ts`).
46. **Is there any caching on the backend?**
    - [x] In-memory caching (**NodeCache** used in `utils/cache.ts` with sophisticated invalidation).
47. **Are slow or expensive API endpoints identified?**
    - Yes, `perfMonitor` middleware and `perfLogger` utility log execution times.
48. **Is pagination implemented?**
    - [x] Yes ✅ (Cursor and skip/limit pagination in `bookingController.ts`).
49. **Are N+1 query problems present?**
    - Minimal; controllers use `.populate()` and `Promise.all()` to fetch related data.
50. **Is compression enabled?**
    - [x] Yes — using `compression` middleware ✅.

---

## 8. 🪵 Logging & Monitoring

51. **Is there any logging in place?**
    - [x] Yes — using **Morgan** and custom performance loggers.
52. **Are logs stored somewhere persistent?**
    - No, only console output detected.
53. **Is there any error monitoring / alerting?**
    - [x] No ⚠️
54. **Are failed login attempts logged?**
    - Yes, generic errors are logged to console.
55. **Are logs sanitized?**
    - Yes, Mongoose hooks exclude some fields, but `req.body` logging in Morgan (if configured for tiny/dev) might catch secrets.

---

## 9. 🌍 Infrastructure & Deployment Security

56. **Is HTTPS enforced?**
    - Handled by Vercel/Render in production.
57. **Is the server running as root?**
    - [x] No — Render/Vercel environments are non-privileged.
58. **Are unnecessary ports open?**
    - Managed by the cloud providers.
59. **Is SSH access secured?**
    - N/A (PaaS deployment).
60. **Are Node.js and npm kept up to date?**
    - Node.js 22 is used, which is current.
61. **Is there a process manager?**
    - Yes, Node.js **Cluster** module is used in `server.ts` for multi-core scaling.

---

## 10. ⚠️ Known Issues & Red Flags

62. **Have you noticed any of the following?**
    - [x] None of the above ✅
63. **Security incident?**
    - **Yes** 🚨 The commitment of `.env` files to the Git repository constitutes a data breach of the JWT secret and database credentials.
64. **Suspected insecure/slow parts?**
    - Public `/api/external/lead` endpoint relies solely on a potentially leaked API key.
65. **Current biggest concern?**
    - **Security** due to the credential leak.
