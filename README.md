# RESTAURA — Premium Full-Stack Restaurant Ordering & Management Platform

Restaura is an elevated culinary ordering and management system crafted for fine-dining restaurants, epicurean bistros, and bespoke gastronomic lounges. It features a modern React client, Express API, and relational MySQL persistence.

---

## Key Features

### Premium Customer Experience
- **Responsive Themes**: Coordinated Dark & Light themes honoring system preferences with persistent toggle.
- **Gastronomic Menu**: Multi-category filtering, dietary classification (Vegetarian, Non-Vegetarian, Vegan), keyword search, price range sorting, and pagination.
- **Food Details**: High-resolution image showcases, preparation time, calories, spice indicators, and sommelier pairing notes.
- **Cart & White-Glove Delivery**: Real-time order calculations with complimentary delivery milestone progress.
- **Interactive Checkout**: Multi-address management, delivery instructions, and choice between Cash on Delivery and verified digital payments.
- **Live Order Beacon**: 6-stage kitchen tracking timeline (PLACED -> CONFIRMED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED).
- **Patron Portal**: Wishlist, past orders history with instant cancel capabilities, and profile credentials.

### Executive Administration Portal
- **Operational Command Center**: Total orders, live active orders, revenue summaries, and real-time database aggregations.
- **Catalog Management (CRUD)**: Create, update, archive, and delete dishes with instant availability toggles.
- **Taxonomy Management (CRUD)**: Culinary categories with custom display order and imagery.
- **Order Pipeline Control**: Safe, validated status transitions from Placed to Delivered.
- **Customer Directory**: Inspect patron profiles, order frequencies, lifetime spend, and status toggle.
- **Restaurant Configuration**: Manage operational hours, contact details, tax surcharge rate, delivery fees, and broadcast banners.
- **Financial Intelligence**: Categorical gross sales and 30-day timeline analysis.

---

## Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide React, Axios, React Context API.
- **Backend**: Node.js (ES Modules), Express.js, MySQL (mysql2 pool with promises), JWT Authentication, bcryptjs, Helmet, CORS, express-rate-limit.
- **Database**: MySQL 8.0+ (`restaurant_db`).

---

## Directory Architecture

```
food/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── addressController.js
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── cartController.js
│   │   │   ├── categoryController.js
│   │   │   ├── foodController.js
│   │   │   ├── orderController.js
│   │   │   ├── settingsController.js
│   │   │   └── wishlistController.js
│   │   ├── database/
│   │   │   ├── migrate.js
│   │   │   ├── schema.sql
│   │   │   └── seed.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   └── routes/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminHeader.jsx
│   │   │   │   └── AdminSidebar.jsx
│   │   │   └── common/
│   │   │       ├── CartDrawer.jsx
│   │   │       ├── FoodCard.jsx
│   │   │       ├── Footer.jsx
│   │   │       ├── Navbar.jsx
│   │   │       └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AddressesPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── FoodDetailPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MenuPage.jsx
│   │   │   ├── MyOrdersPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   └── WishlistPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## Setup & Execution Guide

### 1. Database Configuration
Ensure MySQL 8.0 is running locally. Configure your MySQL credentials in `backend/.env`:
```env
PORT=5005
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=restaurant_db
JWT_SECRET=restaura_super_secure_jwt_secret_key_2026_987654321
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 2. Migration and Seeding
From the `backend` folder:
```bash
npm run migrate
npm run seed
```
This initializes the database schema, sets up default restaurant configuration, and populates initial gourmet menu items, categories, demo users, addresses, and sample orders.

### 3. Start the Backend API
From the `backend` folder:
```bash
npm start
```
The API listens on `http://localhost:5005`. Health endpoint: `http://localhost:5005/api/health`.

### 4. Start the Frontend
From the `frontend` folder:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Initial Credentials

### Executive Admin Account
- **Email**: `admin@restaura.com`
- **Password**: `Admin@12345`
- **Access**: Full Executive Portal (`/admin`), Menu CRUD, Orders Management, Settings, Analytics.

### Demo Patron Account
- **Email**: `customer@restaura.com`
- **Password**: `Customer@12345`
- **Access**: Ordering, Cart, Wishlist, Saved Addresses, Order Tracking.

*(Both accounts feature 1-click quick-fill buttons on the login page for effortless evaluation.)*

---

## API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register patron account
- `POST /api/auth/login` — Sign in and acquire JWT
- `GET /api/auth/me` — Retrieve verified user profile
- `PUT /api/auth/profile` — Update account profile details
- `PUT /api/auth/change-password` — Change password with current credential validation
- `POST /api/auth/forgot-password` — Generate token for credential recovery
- `POST /api/auth/reset-password` — Reset password using verified token

### Menu Catalog (`/api/foods`)
- `GET /api/foods` — Filtered catalog (search, category, dietary, pricing, sorting, pagination)
- `GET /api/foods/:idOrSlug` — Single dish preview with related courses
- `POST /api/foods` *(Admin)* — Add new culinary dish
- `PUT /api/foods/:id` *(Admin)* — Modify dish specifications
- `PATCH /api/foods/:id/toggle-availability` *(Admin)* — Toggle dish availability
- `DELETE /api/foods/:id` *(Admin)* — Delete dish

### Categories (`/api/categories`)
- `GET /api/categories` — Active category list
- `GET /api/categories/:slug` — Category courses
- `POST /api/categories` *(Admin)* — Create category
- `PUT /api/categories/:id` *(Admin)* — Update category
- `DELETE /api/categories/:id` *(Admin)* — Delete category

### Bag & Wishlist (`/api/cart`, `/api/wishlist`)
- `GET /api/cart` — Patron bag with tax, delivery, and subtotal calculation
- `POST /api/cart/add` — Add item to bag
- `PUT /api/cart/item/:id` — Update quantity
- `DELETE /api/cart/item/:id` — Remove item
- `DELETE /api/cart/clear` — Clear bag
- `GET /api/wishlist` — Saved patron wishlist
- `POST /api/wishlist/toggle` — Toggle wishlist dish

### Orders & Tracking (`/api/orders`)
- `POST /api/orders` — Transact new order with item snapshots
- `GET /api/orders` — List current patron's order history
- `GET /api/orders/:id` — Order status and tracking manifest
- `POST /api/orders/:id/cancel` — Cancel pending order

### Executive Management (`/api/admin`)
- `GET /api/admin/dashboard` — Live operations overview & 14-day velocity
- `GET /api/admin/orders` — All orders with status filtering
- `PATCH /api/admin/orders/:id/status` — Advance or transition order status
- `GET /api/admin/customers` — Patron list and spending volume
- `PATCH /api/admin/customers/:id/toggle-status` — Deactivate or reactivate patron
- `GET /api/admin/analytics` — 30-day gross revenue and category metrics
- `GET /api/settings` — Public restaurant configuration
- `PUT /api/settings` *(Admin)* — Update restaurant settings
