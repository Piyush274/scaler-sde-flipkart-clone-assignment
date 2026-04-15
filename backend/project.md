You are a senior full-stack engineer. Build a production-ready e-commerce web application that closely replicates Flipkart's UI/UX and core functionality.

# 🎯 PROJECT OVERVIEW
Create a full-stack Flipkart Clone with product browsing, cart management, and order placement.

The app should look and behave similar to Flipkart (grid layout, product cards, navbar, filters, etc.).

# 🧱 TECH STACK
Frontend:
- React.js (preferred) OR Next.js
- Tailwind CSS (for styling)
- Axios (API calls)
- React Router (if using React)

Backend:
- Node.js with Express.js

Database:
- MySQL (use ORM like Sequelize or Prisma)

# 📁 FOLDER STRUCTURE
Create a clean scalable structure:

/client
  /src
    /components
    /pages
    /services
    /hooks
    /utils

/server
  /controllers
  /routes
  /models
  /middlewares
  /config

# 🧩 CORE FEATURES

## 1. PRODUCT LISTING PAGE
- Grid layout similar to Flipkart
- Product card includes:
  - Image
  - Title
  - Price
  - Discount badge
  - Rating
- Search functionality (by product name)
- Filter by category
- Pagination (optional but preferred)

## 2. PRODUCT DETAIL PAGE
- Image carousel (multiple images)
- Product title, description, specifications
- Price + discount
- Stock availability
- Buttons:
  - Add to Cart
  - Buy Now

## 3. SHOPPING CART
- View all cart items
- Update quantity
- Remove item
- Display:
  - Subtotal
  - Total price

## 4. ORDER PLACEMENT
- Checkout page:
  - Shipping address form
- Order summary before confirmation
- Place order functionality
- Order confirmation page:
  - Show Order ID

# 🧠 DATABASE DESIGN (IMPORTANT)
Design proper relational schema:

Tables:
- Users (id, name, email)
- Products (id, title, description, price, category, stock)
- ProductImages (id, product_id, image_url)
- Cart (id, user_id)
- CartItems (id, cart_id, product_id, quantity)
- Orders (id, user_id, total_price, status, created_at)
- OrderItems (id, order_id, product_id, quantity, price)

Use proper foreign keys and relationships.

# 🔌 API DESIGN

## Product APIs
- GET /api/products
- GET /api/products/:id
- GET /api/products?search=&category=

## Cart APIs
- GET /api/cart
- POST /api/cart
- PUT /api/cart/:id
- DELETE /api/cart/:id

## Order APIs
- POST /api/orders
- GET /api/orders/:id

# 🎨 UI REQUIREMENTS
- Flipkart-like navbar
- Search bar on top
- Clean product grid
- Hover effects
- Consistent spacing and colors
- Responsive design (mobile + desktop)

# 📦 SAMPLE DATA
Seed database with:
- At least 20–30 products
- Multiple categories
- Realistic data

# ⚙️ IMPLEMENTATION DETAILS
- Use REST APIs
- Use environment variables (.env)
- Add error handling middleware
- Use async/await properly
- Maintain clean code and modular structure

# 🚀 BONUS FEATURES (IF TIME PERMITS)
- User authentication (JWT)
- Wishlist feature
- Order history
- Email notification (mock or real)

# 📄 README REQUIREMENTS
Generate README.md including:
- Project setup instructions
- Tech stack
- Folder structure
- API endpoints
- How to run locally
- Deployment steps

# 🌐 DEPLOYMENT
- Frontend: Vercel / Netlify
- Backend: Render / Railway / AWS
- Database: Railway / PlanetScale / AWS RDS

# 🧪 TESTING
- Add basic validation
- Test APIs using Postman

# ⚡ CODING RULES
- Clean, readable code
- Reusable components
- Separation of concerns
- Proper naming conventions

# 🎯 FINAL OUTPUT
- Fully working full-stack app
- GitHub-ready codebase
- Deployment-ready configuration

Start by:
1. Setting up backend (Express + MySQL)
2. Creating database schema
3. Building APIs
4. Then frontend UI
5. Finally integrate everything

Explain important parts in comments.