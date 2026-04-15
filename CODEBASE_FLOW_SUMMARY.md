# Codebase Flow Summary

This document explains the current architecture and execution flow of this project, split into backend and frontend.

## Backend (`backend`)

### 1) Purpose and Stack
- Runtime: Node.js + Express
- Database: MongoDB with Mongoose
- Auth mechanism: JWT in cookie (`jwt`) with fallback `x-user-id` header
- Entry point: `backend/src/server.js`

### 2) High-Level Folder Map
- `src/server.js`: app bootstrap, middleware registration, route mounting, static frontend serving
- `src/routes/`: API route definitions
- `src/controllers/`: route handlers and business logic
- `src/models/`: Mongoose models and schemas
- `src/middlewares/`: auth, object-id validation, and error handling
- `src/db/dbConnect.js`: MongoDB connection
- `src/lib/utils/`: token generation and JWT secret helper
- `src/seed/seedData.js`: sample data seeding script

### 3) Startup Flow
1. `dotenv` loads environment values in `src/server.js`.
2. Express app is created.
3. Core middleware is enabled:
   - `express.json({ limit: "5mb" })`
   - `express.urlencoded({ extended: true })`
   - `cookieParser()`
4. API routes are mounted:
   - `/api/products`
   - `/api/cart`
   - `/api/orders`
   - `/api/auth`
5. Built frontend assets are served from `frontend/dist`.
6. Non-API routes return `frontend/dist/index.html`.
7. `notFoundHandler` and `errorHandler` are attached.
8. Server starts on `PORT || 5000`.
9. `dbConnect()` connects to MongoDB.

### 4) Request Lifecycle
General flow:
1. Request enters Express app.
2. Optional auth middleware (`protectRoute`) validates identity.
3. Optional route-param validation (`validateObjectId`) runs.
4. Route forwards to controller.
5. Controller reads/writes Mongoose models.
6. Response payload is returned, or error is passed to `errorHandler`.

Examples:
- Products flow:
  `routes/product.route.js` -> `controllers/product.controller.js` -> `models/Product.js` + `models/ProductImage.js`
- Cart flow:
  `routes/cart.route.js` -> `controllers/cart.controller.js` -> `models/Cart.js` + `models/CartItem.js` + `models/Product.js`
- Orders flow:
  `routes/order.route.js` -> `controllers/order.controller.js` -> `models/Order.js` + `models/OrderItem.js` + cart/product models

### 5) Auth Flow
- Auth route: `GET /api/auth/test-login`
  - Uses test user env values (`TEST_USER_EMAIL`, `TEST_USER_NAME`)
  - Finds or creates user in DB
  - Generates JWT and sets it in cookie via `generateTokenAndSetCookie`
- Protected route middleware:
  - First checks `jwt` cookie and verifies token
  - If cookie missing, accepts `x-user-id` header
  - Loads user record and attaches `req.user`

### 6) Key Middleware
- `protectRoute.middleware.js`: authentication and user context
- `validateObjectId.middleware.js`: ObjectId validation for params
- `error.middleware.js`:
  - `notFoundHandler` for unknown routes
  - `errorHandler` for centralized error responses

### 7) Important Environment Variables
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV`
- `TEST_USER_EMAIL`
- `TEST_USER_NAME`

### 8) Backend Commands
- `npm run dev` -> run with nodemon
- `npm start` -> run server with node
- `npm run seed` -> seed database

---

## Frontend (`frontend`)

### 1) Purpose and Stack
- Runtime/build: Vite + React + TypeScript
- Routing: `react-router-dom`
- Data fetching/caching: TanStack Query
- State management: Zustand with `persist`
- UI: component-driven (`src/components`), including shared UI primitives

### 2) High-Level Folder Map
- `src/main.tsx`: React bootstrap
- `src/App.tsx`: query provider + router + route tree
- `src/layouts/`: page shell/layout (`MainLayout`)
- `src/pages/`: route-level screens
- `src/components/`: reusable UI and feature components
- `src/store/`: Zustand stores (`auth`, `cart`, `wishlist`, `order`)
- `src/hooks/`: data hooks (`useProducts`, `useProduct`)
- `src/services/api.ts`: current mock product API layer

### 3) App Bootstrap Flow
1. `index.html` provides `#root`.
2. `src/main.tsx` mounts `<App />`.
3. `App.tsx` wraps application with:
   - `QueryClientProvider`
   - toaster components
   - `BrowserRouter` and routes
4. `MainLayout` wraps main pages with shared header and outlet.

### 4) Frontend Route and Screen Flow
Defined in `App.tsx`:
- Public routes:
  - `/` (home listing)
  - `/product/:id` (product detail)
  - `/auth` (login/signup UI)
- Protected routes (wrapped by `ProtectedRoute`):
  - `/cart`, `/checkout`, `/order-success`, `/wishlist`, `/orders`
- Catch-all route:
  - `*` -> not found page

### 5) State + Data Flow
- Global state (persisted):
  - `authStore`: auth flags and user data
  - `cartStore`: cart items and totals
  - `wishlistStore`: wishlisted product ids
  - `orderStore`: order snapshots/history
- Data fetch:
  - `useProducts` and `useProduct` rely on `services/api.ts`
  - `services/api.ts` currently returns local in-memory product data with artificial delay
- Important consequence:
  - Frontend is not yet connected to backend APIs for products/cart/orders/auth

### 6) Auth and Session Behavior
- `Auth.tsx` performs local/mock login and writes auth state to Zustand
- `ProtectedRoute.tsx` guards private pages and redirects to `/auth`
- `Header.tsx` supports logout via store reset

### 7) API Integration Status
- No real backend HTTP integration in active runtime flow
- `axios` package exists but is not used for live API calls
- No `VITE_*` env-based API base URL wiring yet
- Current API layer is purely mocked in `src/services/api.ts`

### 8) Frontend Commands
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run test`

---

## End-to-End Current Reality
- Backend provides real REST APIs with DB persistence.
- Frontend currently uses mock data for product fetch and local stores for user/cart/wishlist/order state.
- Integration work is required so frontend screens consume `/api/*` backend endpoints.
