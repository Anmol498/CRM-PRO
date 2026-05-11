# 🔐 Security, Vulnerability & Optimization Audit — Questionnaire

Answer the questions below to get a full security and performance audit plan for your project.
Be as honest and detailed as possible — even "I don't know" is a useful answer.

---

## 1. 🔑 Authentication & Authorization

1. **How are users authenticated?**
   - [ ] JWT (JSON Web Tokens)
   - [ ] Session-based (express-session)
   - [ ] OAuth / Third-party (Google, GitHub, etc.)
   - [ ] No authentication yet
   - [ ] Other: ___

2. **If using JWT — where are tokens stored on the frontend?**
   - [ ] `localStorage`  ⚠️ (vulnerable to XSS)
   - [ ] `sessionStorage` ⚠️ (vulnerable to XSS)
   - [ ] HTTP-only cookies ✅ (recommended)
   - [ ] In-memory (React state) ✅
   - [ ] Not sure

3. **What is the JWT token expiry time?** (e.g., 1h, 7d, never)

4. **Is there a refresh token mechanism?** If yes, where is the refresh token stored?

5. **Is role-based access control (RBAC) implemented?**
   - Example: Admin can do X, regular user can only do Y
   - [ ] Yes — describe the roles: ___
   - [ ] No, all logged-in users have equal access
   - [ ] Not implemented yet

6. **Are protected API routes actually verified server-side?**
   - Example: Does your backend check the token on every protected endpoint, or does it only rely on the frontend hiding buttons?

7. **Are passwords hashed before storing in the database?**
   - [ ] Yes — using bcrypt / argon2 / scrypt
   - [ ] Yes — using MD5 or SHA (⚠️ weak — needs upgrade)
   - [ ] No — stored in plain text (🚨 critical issue)
   - [ ] No password storage (OAuth only)

8. **Is there any brute-force protection on login endpoints?**
   - [ ] Rate limiting (e.g., express-rate-limit)
   - [ ] Account lockout after N failed attempts
   - [ ] CAPTCHA
   - [ ] None ⚠️

---

## 2. 🌐 API & Backend Security

9. **Is CORS configured on the backend?**
   - [ ] Yes — restricted to specific origins (list them): ___
   - [ ] Yes — but set to `*` (allow all) ⚠️
   - [ ] Not configured at all
   - [ ] Not sure

10. **Is input validation done on the backend?**
    - [ ] Yes — using a library like Joi, Zod, express-validator
    - [ ] Yes — manual `if` checks
    - [ ] No — trusting whatever the frontend sends ⚠️
    - [ ] Not sure

11. **Is there any protection against SQL Injection or NoSQL Injection?**
    - [ ] Yes — using parameterized queries / prepared statements
    - [ ] Yes — using an ORM (Prisma, Sequelize, Mongoose)
    - [ ] No — building queries by concatenating user input 🚨
    - [ ] Not applicable (no database)

12. **Are HTTP security headers set?**
    - [ ] Yes — using `helmet` middleware
    - [ ] Manually configured
    - [ ] Not set ⚠️
    - [ ] Not sure

13. **Is there protection against CSRF (Cross-Site Request Forgery)?**
    - [ ] Yes — CSRF tokens in use
    - [ ] Using same-site cookies (partial protection)
    - [ ] No protection ⚠️
    - [ ] Not sure what CSRF is

14. **Are there any file upload endpoints?**
    - If yes: Is file type validated? Is file size limited? Where are files stored (local disk, S3, etc.)?

15. **Are API keys or secrets ever returned in API responses?**
    - Example: Returning a full user object that includes internal fields, tokens, or passwords

16. **Is the API rate-limited?**
    - [ ] Yes — globally
    - [ ] Yes — on specific sensitive routes (login, signup, password reset)
    - [ ] No ⚠️
    - [ ] Not sure

17. **Are error messages in API responses generic or detailed?**
    - Example: Does a failed login return "Invalid credentials" or "User not found" / "Wrong password" (⚠️ reveals info)

---

## 3. 🖥️ Frontend Security

18. **Is user-generated content ever rendered directly as HTML?**
    - Example: Using `dangerouslySetInnerHTML` in React
    - [ ] Yes ⚠️ (XSS risk)
    - [ ] No
    - [ ] Not sure

19. **Are there any third-party scripts loaded on the page?**
    - Example: Google Analytics, chat widgets, ad scripts
    - If yes: Is a Content Security Policy (CSP) configured?

20. **Are API base URLs or any backend URLs hardcoded in the frontend code?**
    - [ ] Yes — hardcoded (e.g., `http://localhost:3000`) ⚠️
    - [ ] Using environment variables (e.g., `REACT_APP_API_URL`) ✅

21. **Are any sensitive values in the frontend `.env` file prefixed with `REACT_APP_`?**
    - Note: Anything prefixed `REACT_APP_` is **publicly visible** in the browser bundle — no secrets should go there

22. **Is the frontend bundle analyzed for size?**
    - Are there any obviously large or unused libraries being imported?

---

## 4. 🗄️ Database Security

23. **Is the database exposed to the public internet, or only accessible from the backend server?**

24. **Does the database use a strong password?** Is the default admin user still active?

25. **Does the app connect to the database with a least-privilege user?**
    - Example: The app user should not have DROP or DELETE ALL permissions unless needed

26. **Is the database connection string stored in an `.env` file and excluded from Git (`.gitignore`)?**

27. **Is there any database backup strategy in place?**
    - [ ] Automated backups
    - [ ] Manual backups
    - [ ] No backups ⚠️

28. **Are database queries logged?** If yes, are sensitive fields (passwords, tokens) excluded from logs?

---

## 5. 🔒 Secrets & Environment Variables

29. **List all the secrets/keys your project uses.** (Type only — not the actual values)
    - Examples: DB connection string, JWT secret, AWS keys, Stripe keys, SendGrid API key, etc.

30. **Are ALL secrets stored in `.env` files, never hardcoded in source code?**
    - [ ] Yes — all in `.env` ✅
    - [ ] Some are hardcoded ⚠️
    - [ ] Most are hardcoded 🚨

31. **Is the `.env` file listed in `.gitignore`?**
    - [ ] Yes ✅
    - [ ] No 🚨
    - [ ] Not sure — run: `git ls-files | grep .env` to check

32. **Has the `.env` file or any secrets EVER been committed to Git by accident?**
    - [ ] No
    - [ ] Yes / Not sure (⚠️ secrets must be rotated immediately if so)

33. **Is there a `.env.example` file for new developers to know what variables are needed?**

---

## 6. 📦 Dependencies & Supply Chain

34. **When was the last time you ran `npm audit`?** What was the output?
    - Run it now and paste the summary if possible: `npm audit --summary`

35. **Are there any packages that are heavily outdated?**
    - Run `npm outdated` and paste the output if possible

36. **Are there any unused packages in `package.json` that should be removed?**

37. **Is `package-lock.json` or `yarn.lock` committed to the repo?**
    - [ ] Yes ✅ (ensures reproducible installs)
    - [ ] No ⚠️

38. **Are you using any unofficial or obscure npm packages?** (Small download counts, no maintainer activity)

---

## 7. 🚀 Performance & Optimization

### Frontend Performance

39. **Has Lighthouse been run on the app?** If yes, what are the scores for:
    - Performance: ___
    - Accessibility: ___
    - Best Practices: ___
    - SEO: ___

40. **Is code splitting implemented?**
    - [ ] Yes — using `React.lazy()` and `Suspense`
    - [ ] No — everything loads in one bundle ⚠️

41. **Are images optimized?**
    - [ ] Compressed and in modern format (WebP, AVIF)
    - [ ] Lazy loaded
    - [ ] No optimization ⚠️

42. **Is there any caching strategy for static assets?** (Cache-Control headers, CDN, etc.)

43. **Are there any large libraries imported fully that could be tree-shaken or replaced?**
    - Example: `import _ from 'lodash'` instead of `import debounce from 'lodash/debounce'`

44. **Is the React app memoized where appropriate?**
    - Example: Using `React.memo`, `useMemo`, `useCallback` to prevent unnecessary re-renders

### Backend Performance

45. **Are database queries optimized?**
    - [ ] Indexes are set on frequently queried fields
    - [ ] No indexes configured ⚠️
    - [ ] Not sure

46. **Is there any caching on the backend?**
    - [ ] Redis / Memcached for frequent queries
    - [ ] In-memory caching
    - [ ] No caching ⚠️

47. **Are slow or expensive API endpoints identified?**
    - Do you have any logging of response times?

48. **Is pagination implemented on endpoints that return lists of data?**
    - [ ] Yes ✅
    - [ ] No — returning all records at once ⚠️

49. **Are N+1 query problems present?**
    - Example: Fetching a list of users, then making a separate DB call for each user's data in a loop

50. **Is compression enabled on API responses?**
    - [ ] Yes — using `compression` middleware ✅
    - [ ] No ⚠️

---

## 8. 🪵 Logging & Monitoring

51. **Is there any logging in place?**
    - [ ] Yes — using Winston, Morgan, Pino, etc.
    - [ ] Just `console.log` statements ⚠️
    - [ ] No logging at all ⚠️

52. **Are logs stored somewhere persistent?** (File, Datadog, Papertrail, CloudWatch, etc.)

53. **Is there any error monitoring / alerting?**
    - [ ] Yes — Sentry, Bugsnag, Rollbar, etc. ✅
    - [ ] No — errors are silent unless a user reports them ⚠️

54. **Are failed login attempts or suspicious activities logged?**

55. **Are logs sanitized to exclude sensitive data?** (Passwords, tokens, credit card numbers)

---

## 9. 🌍 Infrastructure & Deployment Security

56. **Is HTTPS enforced?** Is there an SSL/TLS certificate?
    - [ ] Yes — HTTPS only, HTTP redirects to HTTPS ✅
    - [ ] No — running on HTTP ⚠️

57. **Is the server running as root?**
    - [ ] No — running as a non-privileged user ✅
    - [ ] Yes 🚨

58. **Are unnecessary ports open on the server firewall?**
    - Ideally only 80 (HTTP), 443 (HTTPS), and 22 (SSH) should be open

59. **Is SSH access secured?**
    - [ ] Key-based authentication only ✅
    - [ ] Password-based authentication ⚠️
    - [ ] Not applicable

60. **Are Node.js and npm kept up to date on the server?**

61. **Is there a process manager keeping the Node server alive?** (PM2, systemd, Docker, etc.)

---

## 10. ⚠️ Known Issues & Red Flags

62. **Have you noticed any of the following?** (Check all that apply)
    - [ ] Unexpected spikes in server load or bandwidth
    - [ ] User accounts being accessed without their knowledge
    - [ ] Spam being sent through your contact forms
    - [ ] Error logs showing SQL/NoSQL injection attempts
    - [ ] Bots hammering your API endpoints
    - [ ] Slow page loads on certain routes
    - [ ] Memory leaks (server needing regular restarts)
    - [ ] None of the above ✅

63. **Have you ever had a security incident or data breach on this project?**

64. **Is there any part of the app that you already suspect is insecure or slow?** Describe it.

65. **What is your current biggest concern — security, performance, or both equally?**

---

## 11. 📎 Optional — Share for Faster Analysis

If you can share any of the following, the audit will be far more precise:

- Output of `npm audit --summary`
- Output of `npm outdated`
- Your Express app entry file (e.g., `server.js` / `app.js`) — just the middleware and route setup, no business logic needed
- Your authentication middleware code
- Lighthouse report screenshot
- Any error logs you're seeing repeatedly

---

> ✅ Once you answer these questions, a prioritized audit report will be produced covering:
> - 🚨 **Critical** issues (fix immediately)
> - ⚠️ **High priority** issues (fix before going to production)
> - 🔧 **Optimizations** (improve performance and maintainability)
> - ✅ **What you're already doing right**
