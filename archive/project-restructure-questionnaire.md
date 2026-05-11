# 🛠️ React + Node.js Project Restructure — Discovery Questionnaire

Before building a restructuring plan, answer the questions below as completely as possible.
The more detail you provide, the more precise and actionable the final plan will be.

---

## 1. 📁 Current Project State

1. **How many files does the project currently have?** (Rough count is fine — e.g., "everything is in 3 files")
2. **What are the current file names and what does each one contain?**
   - Example: `server.js` — React frontend + Express backend + DB queries all in one
3. **What is the current folder/directory structure?** (Paste the output of `tree` or `ls -R` if possible)
4. **Is there a `package.json`? Is it one shared file or separate ones for frontend/backend?**
5. **Where is the project currently hosted or run from?** (Local machine, a VPS, Vercel, etc.)

---

## 2. ⚙️ Tech Stack Details

6. **Which version of React is being used?** (Check `package.json` — e.g., React 17, 18, 19)
7. **Which version of Node.js / Express is being used?**
8. **Is there a bundler or build tool?** (e.g., Vite, Create React App / Webpack, Parcel, None)
9. **Is TypeScript used anywhere, or is it plain JavaScript?**
10. **What database is used?** (MongoDB, PostgreSQL, MySQL, SQLite, Firebase, None, etc.)
11. **Is there an ORM or query builder?** (Mongoose, Prisma, Sequelize, Knex, raw SQL, etc.)
12. **What other major libraries/packages are used?**
    - Examples: Redux, React Router, Axios, JWT, bcrypt, dotenv, Socket.io, etc.

---

## 3. 🧩 Features & Functionality

13. **What does this application actually do?** (Brief description of the product/purpose)
14. **List the main features of the app.** (e.g., User auth, dashboard, CRUD for X, file uploads, etc.)
15. **How many API routes/endpoints does the backend have?** (Rough count — e.g., ~10 routes)
16. **How many pages/views does the frontend have?** (e.g., Login, Dashboard, Profile, Settings)
17. **Is there user authentication?** If yes, what kind? (JWT, sessions, OAuth, third-party like Auth0)
18. **Are there any file uploads, real-time features (WebSockets), or background jobs?**

---

## 4. 🔗 Frontend ↔ Backend Relationship

19. **Are the frontend and backend meant to be in the same repository (monorepo) or separate repos?**
20. **How does the frontend currently communicate with the backend?**
    - Same file (no separation), REST API calls, GraphQL, etc.
21. **Is the React app supposed to be a Single Page Application (SPA), or server-side rendered?**
22. **Is there a `.env` file or environment variables in use?** What kind of secrets are stored?

---

## 5. 🧪 Testing & Quality

23. **Is there any existing test coverage?** (Unit tests, integration tests, E2E — or none at all)
24. **Are there any linting or formatting tools configured?** (ESLint, Prettier, etc.)
25. **Is there a CI/CD pipeline?** (GitHub Actions, Jenkins, etc. — or none)

---

## 6. 🗂️ Version Control & Collaboration

26. **Is the project in a Git repository?** Is it on GitHub/GitLab/Bitbucket?
27. **How many developers will be working on this project?** (Just you, a small team, etc.)
28. **Are there any existing branches, or is everything on `main`/`master`?**

---

## 7. 🚀 Deployment & Environment

29. **Where is the app deployed or intended to be deployed?**
    - Frontend: Vercel, Netlify, AWS S3, same server as backend, etc.
    - Backend: Heroku, Railway, DigitalOcean, AWS EC2, same machine, etc.
30. **Will the frontend and backend be served from the same domain/port, or different ones?**
    (This determines if you need a proxy setup in dev, and CORS config in production)
31. **Are there any Docker or containerization requirements?**

---

## 8. ⚠️ Pain Points & Priorities

32. **What specific problems are you running into right now because of the bad structure?**
    - Examples: Hard to find code, can't run frontend and backend separately, merge conflicts, etc.
33. **What is your top priority for the restructure?**
    - [ ] Clean separation of frontend and backend
    - [ ] Modular, maintainable folder structure
    - [ ] Setting up proper routing (React Router / Express Router)
    - [ ] Making it team-friendly
    - [ ] Getting it deploy-ready
    - [ ] All of the above
34. **Is there any part of the current code you want to keep as-is?** Or is a full restructure fine?
35. **What is your timeline?** (Is this urgent, or can you do it methodically over time?)

---

## 9. 📎 Optional — Share the Code

If possible, paste or share any of the following to speed up the planning:

- The contents of your current `package.json`
- The top-level structure of your main file (just the imports and route/component names — no need to share sensitive logic)
- Any error messages you're currently seeing

---

> ✅ Once you answer these questions, a detailed step-by-step restructuring plan will be created —
> including the target folder structure, which files to create, how to split the code, and the order to do it safely.
