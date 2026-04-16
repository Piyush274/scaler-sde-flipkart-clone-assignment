# Flipkart Clone - Final Project README

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

### Products
- `GET /api/products`
- `GET /api/products/:id`

### Cart (Protected)
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:id`
- `DELETE /api/cart/:id`

### Orders (Protected)
- `POST /api/orders`
- `GET /api/orders/:id`

### Auth
- `GET /api/auth/test-login` (development test login; sets JWT cookie)

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
VITE_API_BASE_URL=http://localhost:5000/api
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
- Backend: `http://localhost:5000`

## Useful Scripts

### Backend (`backend/package.json`)
- `npm run dev` - start server with nodemon
- `npm start` - start server with node
- `npm run seed` - seed sample data

### Frontend (`frontend/package.json`)
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run lint` - run ESLint
- `npm run test` - run Vitest tests once
- `npm run test:watch` - run Vitest in watch mode

## Frontend-Backend Integration Notes

- The frontend Axios client uses `withCredentials: true`, so cookie auth works across requests.
- The backend enables CORS with credentials.
- For protected endpoints, prefer auth cookie flow via `/api/auth/test-login`.
- Temporary fallback: pass `x-user-id` header for testing protected APIs if needed.

## Quick Testing Flow

1. Start backend and frontend.
2. Hit `GET /api/auth/test-login` once to create/login test user.
3. Call `GET /api/products`.
4. Add an item using `POST /api/cart`.
5. Verify cart with `GET /api/cart`.
6. Place order using `POST /api/orders`.
7. Fetch order details with `GET /api/orders/:id`.

You can use the included Postman collection file at root:
- `Flipkart-Clone-API.postman_collection.json`

Published Postman documentation:
- [Flipkart Clone API](https://documenter.getpostman.com/view/37576231/2sBXqCQjCC)

## Deployment (Suggested)

### Frontend
- Vercel or Netlify
- Set `VITE_API_BASE_URL` to deployed backend `/api` URL

### Backend
- Render / Railway / AWS
- Provide environment variables from `backend/.env`
- Ensure MongoDB network access and credentials are configured

### Production Serving
- Backend is configured to serve `frontend/dist` for non-API routes after frontend build is generated.

## Known Limitations

- No full signup/login/logout user journey yet (currently test-login based for development flow).
- Some frontend features may still use local state/store behaviors while integration is being completed.
- Seed data and realistic catalog quality can be expanded further.

## Assumptions Made

- Node.js 18+ and npm are installed on your machine.
- A valid MongoDB instance is available and reachable via `MONGODB_URI`.
- Frontend and backend run locally with frontend calling backend on `http://localhost:5000/api`.
- Cookie-based auth is used for protected APIs, with `/api/auth/test-login` used as the current development login flow.
- If cookie auth is unavailable during testing, `x-user-id` may be used temporarily for protected endpoints.
- Backend serves `frontend/dist` in production after frontend build artifacts are generated.

## Future Improvements

- Full authentication and role-based authorization
- Wishlist backend sync
- Order history page from backend APIs
- Better filtering/sorting/pagination at API level
- CI/CD and end-to-end test coverage

