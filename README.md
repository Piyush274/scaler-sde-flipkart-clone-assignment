# Flipkart Clone - Final Project README

Published Postman documentation:
- [Flipkart Clone API](https://documenter.getpostman.com/view/37576231/2sBXqCQjCC)

A full-stack Flipkart-inspired e-commerce project with a React + TypeScript frontend and an Express + MongoDB backend.

The application supports product discovery, cart operations, checkout flow, and order placement, with backend APIs and frontend state management wired for local development.

## Project Structure

```text
scaler-sde-flipkart-clone/
├── frontend/               # React + Vite + TypeScript app
│   ├── src/
│   │   ├── components/     # UI and reusable components
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # Axios clients and API layer
│   │   ├── store/          # Zustand stores
│   │   └── hooks/          # Reusable hooks
├── backend/                # Express API server
│   ├── src/
│   │   ├── controllers/    # API handlers
│   │   ├── routes/         # Route definitions
│   │   ├── models/         # Mongoose models
│   │   ├── middlewares/    # Auth, validation, error handlers
│   │   ├── db/             # Database connection
│   │   └── seed/           # Seed script
└── FINAL_README.md
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- Axios

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Cookie Parser
- CORS
- JSON Web Token (JWT)

## Core Features

- Product listing with search and category filtering
- Product detail view
- Cart management (add, update quantity, remove)
- Checkout and order placement
- Protected APIs using cookie-based auth (with `x-user-id` fallback for testing)
- Flipkart-style responsive UI layout

## API Endpoints

Base URL (local): `http://localhost:5050`


## Local Setup

## 1) Clone and install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## 2) Configure environment variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_strong_secret
TEST_USER_EMAIL=test@example.com
TEST_USER_NAME=Test User
NODE_ENV=development
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5050/api
```

## 3) Run the application

Start backend:

```bash
cd backend
npm run dev
```

Start frontend (new terminal):

```bash
cd frontend
npm run dev
```

Typical local URLs:
- Frontend: `http://localhost:8080` (or the Vite URL shown in terminal)
- Backend: `http://localhost:5050`



## Assumptions Made

- Node.js 18+ and npm are installed on your machine.
- A valid MongoDB instance is available and reachable via `MONGODB_URI`.
- Frontend and backend run locally with frontend calling backend on `http://localhost:5050/api`.
- Cookie-based auth is used for protected APIs, with `/api/auth/test-login` used as the current development login flow.
- If cookie auth is unavailable during testing, `x-user-id` may be used temporarily for protected endpoints.

## Future Improvements

- Full authentication and role-based authorization
- Wishlist backend sync
- Better filtering/sorting/pagination at API level
- CI/CD and end-to-end test coverage

