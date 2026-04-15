# Chatalaxy Backend API Documentation

This backend currently provides e-commerce APIs for:
- Products
- Cart
- Orders

Base URL (local):
- `http://localhost:5000`

---

## 1) Setup and Run

### Prerequisites
- Node.js 18+
- MongoDB connection string

### Environment Variables
Create a `.env` file in project root with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Install and start
If `package.json` is not yet added in this backend folder, create it first and install your dependencies (`express`, `mongoose`, `dotenv`, `cookie-parser`).

Typical start command after setup:
```bash
node src/server.js
```

---

## 2) Authentication Model Used by APIs

There is no JWT login flow currently wired for these APIs.

Protected routes expect this request header:
- `x-user-id: <MongoDB User ObjectId>`

If missing or invalid, API returns `401` or `400`.

---

## 3) API Endpoints

## Products API

### GET `/api/products`
Get all products with optional search/category filters.

Query params:
- `search` (optional): product title search (case-insensitive)
- `category` (optional): exact category match

Example:
```http
GET /api/products?search=phone&category=electronics
```

Success response `200`:
```json
[
  {
    "_id": "661111111111111111111111",
    "title": "iPhone 14",
    "description": "128GB Blue",
    "price": 69999,
    "category": "electronics",
    "stock": 10,
    "createdAt": "2026-04-14T07:00:00.000Z",
    "updatedAt": "2026-04-14T07:00:00.000Z",
    "images": ["https://.../image1.jpg", "https://.../image2.jpg"]
  }
]
```

### GET `/api/products/:id`
Get product details by product ID.

Success response `200`:
```json
{
  "_id": "661111111111111111111111",
  "title": "iPhone 14",
  "description": "128GB Blue",
  "price": 69999,
  "category": "electronics",
  "stock": 10,
  "createdAt": "2026-04-14T07:00:00.000Z",
  "updatedAt": "2026-04-14T07:00:00.000Z",
  "images": ["https://.../image1.jpg", "https://.../image2.jpg"]
}
```

Error responses:
- `400` invalid product id
- `404` product not found

---

## Cart API (Protected via `x-user-id`)

### GET `/api/cart`
Get current user cart. If no cart exists, backend creates one.

Headers:
```http
x-user-id: 661aaaaaaaaaaaaaaaaaaaaa
```

Success response `200`:
```json
{
  "cartId": "662222222222222222222222",
  "items": [
    {
      "_id": "663333333333333333333333",
      "cart": "662222222222222222222222",
      "product": {
        "_id": "661111111111111111111111",
        "title": "iPhone 14",
        "price": 69999,
        "category": "electronics",
        "stock": 10
      },
      "quantity": 2
    }
  ],
  "subtotal": 139998,
  "totalPrice": 139998
}
```

### POST `/api/cart`
Add product to cart.

Headers:
```http
x-user-id: 661aaaaaaaaaaaaaaaaaaaaa
Content-Type: application/json
```

Body:
```json
{
  "productId": "661111111111111111111111",
  "quantity": 1
}
```

Success response `201`:
- Returns latest cart snapshot (`cartId`, `items`, `subtotal`, `totalPrice`)

Error responses:
- `400` missing/invalid payload
- `404` product not found

### PUT `/api/cart/:id`
Update cart item quantity.

Headers:
```http
x-user-id: 661aaaaaaaaaaaaaaaaaaaaa
Content-Type: application/json
```

Body:
```json
{
  "quantity": 3
}
```

Success response `200`:
- Returns latest cart snapshot

Error responses:
- `400` invalid cart item id or quantity
- `404` cart item not found

### DELETE `/api/cart/:id`
Remove one cart item by cart item ID.

Headers:
```http
x-user-id: 661aaaaaaaaaaaaaaaaaaaaa
```

Success response `200`:
- Returns latest cart snapshot

Error responses:
- `400` invalid cart item id
- `404` cart item not found

---

## Orders API (Protected via `x-user-id`)

### POST `/api/orders`
Place order using current user cart items.

Headers:
```http
x-user-id: 661aaaaaaaaaaaaaaaaaaaaa
```

Success response `201`:
```json
{
  "message": "Order placed successfully.",
  "orderId": "664444444444444444444444"
}
```

Error responses:
- `400` cart empty
- `400` insufficient stock

### GET `/api/orders/:id`
Get one order by ID (only if it belongs to current user).

Headers:
```http
x-user-id: 661aaaaaaaaaaaaaaaaaaaaa
```

Success response `200`:
```json
{
  "_id": "664444444444444444444444",
  "user": "661aaaaaaaaaaaaaaaaaaaaa",
  "totalPrice": 139998,
  "status": "pending",
  "createdAt": "2026-04-14T08:00:00.000Z",
  "updatedAt": "2026-04-14T08:00:00.000Z",
  "items": [
    {
      "_id": "665555555555555555555555",
      "order": "664444444444444444444444",
      "product": {
        "_id": "661111111111111111111111",
        "title": "iPhone 14",
        "category": "electronics"
      },
      "quantity": 2,
      "price": 69999
    }
  ]
}
```

Error responses:
- `400` invalid order id
- `404` order not found for this user

---

## 4) Quick Postman Testing Flow

1. Create at least one `User`, `Product`, and `ProductImage` document in MongoDB.
2. Copy user `_id` and use it as `x-user-id` header in protected requests.
3. Call `GET /api/products` to fetch products.
4. Call `POST /api/cart` to add item.
5. Call `GET /api/cart` to verify subtotal/total.
6. Call `POST /api/orders` to place order.
7. Call `GET /api/orders/:id` using returned `orderId`.

---

## 5) Frontend Integration (Axios)

Create a shared API client:

```js
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const withUser = (userId) => ({
  headers: { "x-user-id": userId },
});
```

Examples:

```js
// Products
const { data: products } = await api.get("/products", {
  params: { search: "phone", category: "electronics" },
});

// Cart
await api.post("/cart", { productId, quantity: 1 }, withUser(userId));
const { data: cart } = await api.get("/cart", withUser(userId));

// Orders
const { data: placed } = await api.post("/orders", {}, withUser(userId));
const { data: order } = await api.get(`/orders/${placed.orderId}`, withUser(userId));
```

---

## 6) Common Errors

- `401 Missing x-user-id header for user context.`
- `400 Invalid x-user-id value.`
- `400 Invalid id.` (for invalid route ObjectId params)
- `404 Route not found: <METHOD> <PATH>`

---

## 7) Current Limitations

- No signup/login endpoints are wired right now.
- You must pass `x-user-id` manually from frontend for protected APIs.
- Seed script is not added yet; test data should be inserted manually for now.
