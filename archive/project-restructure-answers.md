# 🛠️ React + Node.js Project Restructure — Answers

This document provides answers to the discovery questionnaire for the Travel CRM project.

---

## 1. 📁 Current Project State

1. **How many files does the project currently have?**
   - The project has several hundred files across the frontend and backend.
2. **What are the current file names and what does each one contain?**
   - `frontend/`: Contains the React + Vite frontend application.
   - `travel-crm-backend/`: Contains the Node.js + Express + Mongoose backend.
   - `migration script/`: Contains database migration scripts (e.g., `masterMigrationV4.js`).
   - `docs/`: Project documentation.
   - `package.json` (Root): Monorepo management script.
3. **What is the current folder/directory structure?**
   ```
   CRM 3.0/
   ├── frontend/             # React (Vite) frontend
   ├── travel-crm-backend/    # Node.js (Express) backend
   ├── migration script/      # DB migration scripts
   ├── docs/                 # Documentation
   ├── vercel.json           # Frontend deployment config
   └── package.json          # Root scripts for monorepo
   ```
4. **Is there a `package.json`? Is it one shared file or separate ones for frontend/backend?**
   - There are separate `package.json` files for the root, `frontend`, and `travel-crm-backend`.
5. **Where is the project currently hosted or run from?**
   - **Frontend**: Vercel (configuration in `vercel.json`).
   - **Backend**: Render (as per `08_DEPLOYMENT_GUIDE.md`).
   - **Database**: MongoDB Atlas (Cloud).
   - **Local**: Managed as a monorepo via the root `package.json`.

---

## 2. ⚙️ Tech Stack Details

6. **Which version of React is being used?**
   - React 19.2.0.
7. **Which version of Node.js / Express is being used?**
   - Node.js ~22, Express 4.18.2.
8. **Is there a bundler or build tool?**
   - Vite 8.0.3 is used for the frontend.
9. **Is TypeScript used anywhere, or is it plain JavaScript?**
   - TypeScript is used throughout the project (version 6.0.2).
10. **What database is used?**
    - MongoDB (via Mongoose 9.2.4).
11. **Is there an ORM or query builder?**
    - Mongoose is the primary ODM. Root scripts mention Prisma, but it is not currently integrated in the backend.
12. **What other major libraries/packages are used?**
    - **Frontend**: TanStack Query, TanStack Table, Radix UI, Tailwind CSS, Lucide React, Zod.
    - **Backend**: Socket.io, SSE (Server-Sent Events), JWT, Bcrypt, Node-cache.

---

## 3. 🧩 Features & Functionality

13. **What does this application actually do?**
    - It is a Travel CRM designed for managing bookings, travelers, contacts, and reporting.
14. **List the main features of the app.**
    - User Authentication (JWT).
    - Booking Management (Create, Update, Details, Travelers).
    - Real-time updates via SSE and Socket.io.
    - Dashboard with Analytics/Charts.
    - User and Permissions management.
    - External integrations (WordPress PHP snippets found).
15. **How many API routes/endpoints does the backend have?**
    - Approximately 9 main route files (Auth, Booking, User, Analytics, etc.), each containing multiple endpoints.
16. **How many pages/views does the frontend have?**
    - 11 main views: Login, Dashboard, Bookings, BookingDetails, Users, Settings, Reports, etc.
17. **Is there user authentication?**
    - Yes, JWT-based authentication.
18. **Are there any file uploads, real-time features (WebSockets), or background jobs?**
    - Real-time: SSE and WebSockets (Socket.io) are used.
    - Background jobs: Mentions of "follow-up cron" in previous logs, though not explicitly in a dedicated folder.

---

## 4. 🔗 Frontend ↔ Backend Relationship

19. **Are the frontend and backend meant to be in the same repository (monorepo) or separate repos?**
    - Currently a monorepo.
20. **How does the frontend currently communicate with the backend?**
    - Via REST API calls using Axios.
21. **Is the React app supposed to be a Single Page Application (SPA), or server-side rendered?**
    - SPA (Standard Vite/React setup).
22. **Is there a `.env` file or environment variables in use?**
    - Yes, `.env` files are used in both frontend and backend for database URLs, JWT secrets, and port configurations.

---

## 5. 🧪 Testing & Quality

23. **Is there any existing test coverage?**
    - No dedicated test directory found (unit/integration).
24. **Are there any linting or formatting tools configured?**
    - ESLint is configured in the frontend (`eslint.config.js`).
25. **Is there a CI/CD pipeline?**
    - No explicit CI/CD configuration files (like GitHub Actions) detected in the root.

---

## 6. 🗂️ Version Control & Collaboration

26. **Is the project in a Git repository?**
    - Yes.
27. **How many developers will be working on this project?**
    - Likely a small team or single developer given the structure.
28. **Are there any existing branches, or is everything on `main`/`master`?**
    - Branches found: `CRM-2.0` (current) and `CRM3.0`.

---

## 7. 🚀 Deployment & Environment

29. **Where is the app deployed or intended to be deployed?**
    - **Frontend**: Vercel.
    - **Backend**: Render.
    - **Database**: MongoDB Atlas.
30. **Will the frontend and backend be served from the same domain/port, or different ones?**
    - Different ports in development (handled by `concurrently`). Production setup depends on deployment.
31. **Are there any Docker or containerization requirements?**
    - No Dockerfile found in the repository.

---

## 8. ⚠️ Pain Points & Priorities

32. **What specific problems are you running into right now because of the bad structure?**
    - Mixing of frontend/backend concerns in the root directory.
    - Redundant documentation and scripts scattered across the root.
    - Difficulty in managing shared types or configurations.
33. **What is your top priority for the restructure?**
    - [x] All of the above (Clean separation, modular structure, proper routing, deploy-ready).
34. **Is there any part of the current code you want to keep as-is?**
    - Core logic in controllers and pages seems solid, but requires organization.
35. **What is your timeline?**
    - Methodical restructure suggested.

---

## 9. 📎 Optional — Share the Code

- **Root `package.json`**:
```json
{
    "name": "travel-crm-monorepo",
    "scripts": {
        "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
        "build": "cd travel-crm-backend && npm install && npm run build",
        "start": "cd travel-crm-backend && npm run start"
    }
}
```
- **Backend `src/server.ts`**: Handles Express initialization, middleware, and SSE/Socket.io setup.
- **Frontend `src/main.tsx`**: Initializes React with TanStack Query and Router.
