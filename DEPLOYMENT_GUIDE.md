# 🚀 Travel CRM — Execution & Deployment Guide

This guide covers how to run the project locally and deploy the components to production environments.

---

## 💻 Local Development

### 1. Prerequisites
- **Node.js**: v20 or higher recommended.
- **MongoDB**: Local MongoDB instance (running on `localhost:27017`) or a MongoDB Atlas connection string.

### 2. Initial Setup
From the project root:
```bash
# Install root dependencies (concurrently)
npm install

# Install all sub-project dependencies (shared, backend, frontend)
npm run install:all
```

### 3. Environment Variables
You must set up `.env` files for both backend and frontend.

#### **Backend (`/backend/.env`)**
Copy `backend/.env.example` to `backend/.env`:
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI="mongodb://127.0.0.1:27017"
DB_NAME="travel_crm"
JWT_SECRET="generate-a-random-string"
```

#### **Frontend (`/frontend/.env`)**
```bash
VITE_API_URL="http://localhost:5000/api"
```

### 4. Running the Project
From the root directory, run:
```bash
npm run dev
```
This will start both the backend (Port 5000) and the frontend (Port 5173) simultaneously using `concurrently`.

---

## 🌐 Deployment to Render (Backend)

Render is the recommended platform for the Node.js backend.

### 1. Create a "Web Service"
- **GitHub Repo**: Connect your repository.
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm run build` (This uses the optimized `tsup` build we configured).
- **Start Command**: `npm run start`

### 2. Environment Variables in Render
Go to the **Environment** tab and add:
- `NODE_ENV`: `production`
- `MONGODB_URI`: `mongodb+srv://user:pass@your-cluster.mongodb.net` (No DB name in path)
- `DB_NAME`: `CRM_Prod` (Must match your Atlas scoped database)
- `JWT_SECRET`: A long, secure random string.
- `WEB_CONCURRENCY`: `1` (or higher depending on your Render plan).

---

## ⚡ Deployment to Vercel (Frontend)

Vercel is ideal for the React/Vite frontend.

### 1. Create a New Project
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`

### 2. Build Settings
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Environment Variables
- `VITE_API_URL`: The URL of your Render backend (e.g., `https://your-backend.onrender.com/api`).

---

## 🛠 Advanced Deployment (Monorepo)

If you want to deploy from the root of the repo (e.g., as a single Render Monorepo setup):

- **Build Command (Root)**: `npm run build`
- **Start Command (Root)**: `npm run start` (Runs the backend).

### Summary of Build Scripts
- `npm run build:shared`: Builds the common TypeScript types.
- `npm run build:backend`: Uses `tsup` to create a production bundle in `backend/dist`.
- `npm run build:frontend`: Uses `vite build` to create optimized assets in `frontend/dist`.

---

## ⚠️ Important Security Reminders
1. **Never commit `.env` files**: Ensure they are in `.gitignore`.
2. **Access Control**: When deploying to production, follow the [MongoDB Access Control Plan](file:///c:/Users/anmol/OneDrive/Desktop/CRM%20Final/mongodb-access-control-plan.md) to isolate your production database.
