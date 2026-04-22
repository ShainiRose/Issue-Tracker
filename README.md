# Issue Tracker

A full-stack issue tracking application with authentication, issue management, dashboard stats, filtering, and status workflows.

## Demo (Deployment Link)
- Only the frontend is deployed on Vercel, using dummy data. (deploy repo- https://github.com/ShainiRose/Issue-versal) 
- Deploy Link : https://isse-versal.vercel.app/

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, MongoDB (Mongoose), JWT authentication

## Project Structure

- backend: Express API + MongoDB models/routes/controllers
- frontend: React app (Vite) with Redux state management and UI

## Prerequisites

- Node.js 18+ (recommended)
- MongoDB instance (local or cloud)

## Environment Setup

Create a file named .env inside backend folder with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=your_port

Notes:
- PORT is optional (defaults to 5000).
- Frontend Vite dev server proxies /api requests to http://localhost:5000.

## Installation

From the project root:

1. Install backend packages
   - cd backend
   - npm install
2. Install frontend packages
   - cd frontend
   - npm install

## Running the App (Development)

Use two terminals:

1. Start backend API
   - cd backend
   - npm run dev
2. Start frontend app
   - cd frontend
   - npm run dev

Default URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Available Scripts

### Backend

- npm run dev: Start backend with nodemon
- npm start: Start backend with node

### Frontend

- npm run dev: Start Vite development server
- npm run build: Build production assets
- npm run preview: Preview production build locally
- npm run lint: Run ESLint

## Usage

1. Register a new user account.
2. Log in.
3. Create issues with title, description, priority, and severity.
4. View dashboard cards and issue list.
5. Filter issues using search title name/status/priority/severity.
6. Update issue status and details.
7. View issue details and manage status actions.

## API Overview

Base API path: /api

- Auth routes: /api/auth
- Issue routes: /api/issues

## Troubleshooting

- If frontend cannot reach backend:
  - Ensure backend is running on correct port 5000.
  - Check frontend proxy config in frontend/vite.config.js.
- If MongoDB connection fails:
  - Verify MONGO_URI in backend/.env.
- If auth fails:
  - Ensure JWT_SECRET is defined in backend/.env.
