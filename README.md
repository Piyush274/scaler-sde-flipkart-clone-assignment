# Frontend <-> Backend Connection Reference

This file is the practical guide for connecting `frontend` to `backend` in this project.


For architecture and flow details, also see:
- `CODEBASE_FLOW_SUMMARY.md`

## Current State (Important)
- Backend has real APIs under `/api/*` with MongoDB persistence.
- Frontend is still using mock product data from `frontend/src/services/api.ts`.
- Frontend auth/cart/order behavior is local store based, not fully backend-driven yet.

## 1) Start Both Apps

### Backend
1. Open terminal in `backend`
2. Install deps:
   - `npm install`
3. Create/update `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_strong_secret
TEST_USER_EMAIL=test@example.com
TEST_USER_NAME=Test User
NODE_ENV=development
```

4. Run backend:
   - `npm run dev`

### Frontend
1. Open terminal in `frontend`
2. Install deps:
   - `npm install`
3. Run frontend:
   - `npm run dev`

By default, frontend runs on `http://localhost:8080` and backend on `http://localhost:5000`.

## 2) Add Frontend API Base URL

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Use it from frontend code:
- `const baseURL = import.meta.env.VITE_API_BASE_URL`

## 3) Recommended API Client Pattern (Frontend)

Create a single API client (example `frontend/src/services/http.ts`):

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});
```

Why `withCredentials: true`?
- Backend can set/read JWT cookie (`jwt`) for auth flow.

## 4) Replace Mock Product API With Backend Calls

Current file:
- `frontend/src/services/api.ts` (mock in-memory dataset)

Target behavior:
- `GET /api/products` for listing
- `GET /api/products/:id` for product details

Suggested migration:
1. Keep product TypeScript interfaces.
2. Replace local `PRODUCTS` and delays with API calls.
3. Map backend response shape to frontend product shape if fields differ.
4. Keep hooks (`useProducts`, `useProduct`) and only swap service implementation.

## 5) Protected Routes and Authentication

Backend support:
- `GET /api/auth/test-login` issues JWT cookie and returns test user.
- Protected APIs use `protectRoute` middleware.

Frontend integration plan:
1. On login page, call `/api/auth/test-login` (temporary development login).
2. Save user in `authStore`.
3. Keep `isAuthenticated` based on user/session checks.
4. Call protected APIs with cookie enabled (`withCredentials: true`).

Fallback option:
- Backend currently also accepts `x-user-id` header when cookie is absent.
- Use this only for temporary testing.

## 6) Cart/Order/Wishlist Integration Path

Recommended order:
1. Products: swap `fetchProducts` and `fetchProductById`
2. Cart: wire `/api/cart` endpoints
3. Orders: wire `/api/orders` endpoints
4. Wishlist: either
   - keep frontend-only store, or
   - add backend wishlist endpoints and sync state

## 7) CORS Note (Only If Needed)

If frontend and backend run on different origins and cookies are blocked, add CORS in backend with credentials:
- `origin: "http://localhost:8080"`
- `credentials: true`

Currently, this backend does not explicitly configure CORS in `src/server.js`.

## 8) Quick Verification Checklist
- Backend starts and connects to MongoDB successfully.
- Frontend can fetch products from `/api/products`.
- Login calls `/api/auth/test-login` and user state updates.
- Protected request (`/api/cart`) works after login.
- Order creation works via `/api/orders`.

## 9) Troubleshooting
- `401 Unauthorized`:
  - cookie not present, or invalid token, or missing `x-user-id`
- `400 Invalid id`:
  - malformed Mongo ObjectId in route params
- Empty product/cart/order responses:
  - seed or insert test data in DB (`npm run seed` in backend)
