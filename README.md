# LuxeStore — Premium MERN E-Commerce Platform with AI Copilot

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express.js-green?logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**LuxeStore** is a feature-rich, high-performance full-stack e-commerce application built on the MERN stack (MongoDB, Express.js, React, Node.js). Designed with modern UI/UX aesthetics, glassmorphism accents, and an interactive **Luxe AI Shopping Assistant**, LuxeStore offers a seamless online shopping experience alongside a protected executive **Admin Control Panel** for full inventory, order, and user management.

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Variables](#-environment-variables)
- [API Reference Overview](#-api-reference-overview)
- [Admin Control Panel](#-admin-control-panel)
- [Luxe AI Shopping Assistant](#-luxe-ai-shopping-assistant)
- [Deployment Information](#-deployment-information)
- [Testing & Build Verification](#-testing--build-verification)
- [Future Enhancements & Roadmap](#-future-enhancements--roadmap)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## ✨ Key Features

### 🛍️ Customer Storefront
- **Modern Responsive Interface**: Crafted with React 19 and Tailwind CSS, featuring dark-mode elements, fluid micro-interactions, and mobile drawer navigation.
- **Dynamic Product Catalog**: Interactive product cards with rating stars, price discount calculation (INR formatting), stock status badges, and quick-view modals.
- **Real-Time Filtering & Instant Search**: Filter products by category, rating, maximum price slider, and keyword search with immediate feedback.
- **Cart & Wishlist Management**: Dynamic slide-over drawers with quantity adjustments, subtotal computation, and persistent local/backend state synchronization.
- **JWT Authentication**: Secure user registration, login, profile persistence via JWT tokens, and protected routes.
- **Checkout & Order Management**: Multi-step checkout with address collection, total cost calculation, Razorpay integration readiness, and order status tracking.
- **Luxe AI Copilot**: Floating interactive AI shopping drawer that assists users with product discovery, styling recommendations, and store inquiry support.

### 🛡️ Protected Executive Admin Panel
- **Role-Based Access Control (RBAC)**: Secure access restricted to authorized administrator accounts (`role === 'admin'`).
- **Executive Dashboard Metrics**: Live KPI statistic cards summarizing total revenue, total orders, total product count, active customers, pending orders, and delivered sales.
- **Product Inventory Management (Full CRUD)**:
  - Add new products with image URLs, category tags, original/discount pricing, and stock levels.
  - Edit existing product specifications, stock counts, and descriptions.
  - Delete products with confirmation safety checks.
- **Order Fulfillment Tracking**: Search, inspect order shipping destinations, item lists, transaction references, and update fulfillment statuses (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`).
- **Registered User Directory**: Searchable directory displaying user accounts, contact emails, joined dates, and assigned account permissions.

---

## 🛠️ Tech Stack

### **Frontend Framework & Styling**
- **React 19**: Modern UI component library with Hooks and Context API for global state management.
- **Vite 6**: Next-generation frontend build tool providing hot module replacement (HMR).
- **Tailwind CSS 3**: Utility-first CSS framework for custom responsive design tokens.
- **Lucide React**: Modern icon set for clean user interfaces.

### **Backend & Database**
- **Node.js**: Asynchronous event-driven JavaScript runtime environment.
- **Express.js**: Fast, unopinionated Web Framework for building REST APIs.
- **MongoDB**: NoSQL document-oriented database for scalable data storage.
- **Mongoose ODM**: Object Data Modeling library for schema definitions, validation, and database operations.

### **Authentication & Security**
- **JSON Web Tokens (JWT)**: Stateless user authentication and authorization headers.
- **BcryptJS**: Secure salted password hashing for user credential storage.
- **CORS**: Cross-Origin Resource Sharing middleware.

### **Payment Gateway & Utilities**
- **Razorpay Node SDK**: SDK integration for online payment processing.
- **Dotenv**: Centralized environment variable management.

---

## 📁 Project Architecture & Directory Structure

```
website/
├── public/                     # Public static assets & favicon
├── src/
│   ├── assets/                 # Brand logos, graphics & static media
│   ├── components/             # Reusable UI Components
│   │   ├── admin/              # Executive Admin Control Panel Views
│   │   │   ├── AdminDashboard.jsx  # KPI metrics & recent sales
│   │   │   ├── AdminLayout.jsx     # Protected admin layout & navigation
│   │   │   ├── AdminOrders.jsx     # Order fulfillment manager
│   │   │   ├── AdminProducts.jsx   # Product CRUD catalog inventory
│   │   │   └── AdminUsers.jsx      # User account directory
│   │   ├── ai/                 # Luxe AI Copilot Assistant components
│   │   │   ├── LuxeAIButton.jsx    # Floating trigger widget
│   │   │   └── LuxeAIDrawer.jsx    # AI assistant chat interface
│   │   ├── AuthModal.jsx       # Login & Register modal
│   │   ├── CartDrawer.jsx      # Slide-over Shopping Cart
│   │   ├── Categories.jsx      # Home categories grid
│   │   ├── CheckoutModal.jsx   # Order checkout process
│   │   ├── FeaturedProducts.jsx# Product collection grid & filters
│   │   ├── FlashSaleBanner.jsx # Discount promotional banner
│   │   ├── Footer.jsx          # Site footer component
│   │   ├── Hero.jsx            # Hero carousel & banner
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── ProductCard.jsx     # Reusable product card component
│   │   ├── QuickViewModal.jsx  # Product detail preview modal
│   │   ├── Toast.jsx           # Notification toast container
│   │   ├── TrendingProducts.jsx# Trending items carousel
│   │   ├── WhyChooseUs.jsx     # Trust badges & value props
│   │   └── WishlistDrawer.jsx  # Saved items drawer
│   ├── context/
│   │   └── ShopContext.jsx     # Global state (Cart, Wishlist, Auth, Products)
│   ├── data/
│   │   └── products.js         # Fallback product data & category constants
│   ├── services/
│   │   └── api.js              # Centralized HTTP client & REST API service
│   ├── utils/
│   │   ├── api.js              # Re-exported API fetch helper
│   │   └── formatters.js       # INR currency & number formatting helpers
│   ├── App.jsx                 # Application entry route router & layout
│   ├── index.css               # Global Tailwind CSS directives
│   └── main.jsx                # Application root DOM mount point
├── backend/                    # Express.js REST API server & Mongoose models
│   ├── config/                 # Database connection setup
│   ├── controllers/            # Route controllers for Auth, Products, Orders
│   ├── middleware/             # Auth & Admin JWT verification middlewares
│   ├── models/                 # Mongoose schemas (User, Product, Order)
│   ├── routes/                 # REST API route handlers
│   └── server.js               # Express server entry point
├── .env.example                # Environment variable placeholder template
├── package.json                # Project dependencies and script runner
├── tailwind.config.js          # Tailwind design tokens and theme extension
├── vercel.json                 # Production deployment configuration
└── vite.config.js              # Vite compiler and proxy settings
```

---

## 🚀 Getting Started & Local Setup

Follow these step-by-step instructions to clone, configure, and run the project on your local workstation.

### **Prerequisites**
- **Node.js**: `v18.0.0` or higher installed
- **npm**: `v9.0.0` or higher (or `yarn` / `pnpm`)
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` or a **MongoDB Atlas** cloud URI.

### **1. Clone the Repository**
```bash
git clone https://github.com/Mohd-Safwan07/luxe-ai-ecommerce.git
cd luxe-ai-ecommerce
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment Variables**
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```
*(Refer to the [Environment Variables](#-environment-variables) section below for required variable placeholders).*

### **4. Start the Local Development Server**
```bash
npm run dev
```
The application will launch locally at `http://localhost:5173`.

### **5. Build for Production**
To generate the optimized static production bundle:
```bash
npm run build
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory. Use the following placeholders:

```env
# Frontend API Base URL
VITE_API_URL=http://localhost:5000

# Backend Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection String
MONGODB_URI=mongodb://localhost:27017/luxe_store

# JSON Web Token Secret
JWT_SECRET=your_jwt_secret_key_here

# Payment Gateway Keys (Optional)
RAZORPAY_KEY_ID=your_razorpay_key_id_placeholder
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_placeholder
```

> **Security Note**: Never commit actual passwords, private keys, or API tokens to source control. Always keep `.env` included in your `.gitignore` file.

---

## 📡 API Reference Overview

The Express backend provides clean, modular RESTful JSON endpoints for clients:

### 🔓 Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all active catalog products |
| `GET` | `/api/products/:id` | Fetch specific product details by ID |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |

### 🔒 Protected User Endpoints (`Bearer Token Required`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/cart` | Get current user's shopping cart |
| `POST` | `/api/cart` | Add item to user's cart |
| `DELETE` | `/api/cart/:productId` | Remove item from user's cart |
| `GET` | `/api/wishlist` | Get user's saved wishlist items |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders/my-orders` | Get order history for logged-in user |

### 👑 Admin Protected Endpoints (`Admin Role Required`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Retrieve executive sales & inventory metrics |
| `POST` | `/api/products` | Create a new product in the catalog |
| `PUT` | `/api/products/:id` | Update an existing product's details/stock |
| `DELETE` | `/api/products/:id` | Delete a product from the catalog |
| `GET` | `/api/admin/orders` | Fetch all customer orders |
| `PUT` | `/api/admin/orders/:id/status` | Update order fulfillment and payment status |
| `GET` | `/api/admin/users` | Retrieve directory of registered users |

---

## 🛡️ Admin Control Panel

The **LuxeAdmin Control Panel** provides enterprise-level store administration:

1. **Dashboard Overview**: Access total revenue calculations, order counts, product counts, and active customer statistics.
2. **Catalog Inventory**: Full administrative CRUD permissions to adjust product pricing, original list prices, stock availability, category assignments, and featured badges.
3. **Fulfillment Pipeline**: Filter customer orders by status (`Pending`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`), view buyer shipping addresses and payment IDs, and update fulfillment tracking in real-time.
4. **User Directory**: Monitor registered user accounts, view email addresses, registration timestamps, and administrative permissions.

---

## 🤖 Luxe AI Shopping Assistant

The **Luxe AI Assistant** is an integrated interactive shopping guide:
- **Intelligent Discovery**: Assists shoppers in discovering products based on personal style preferences, budget limits, or occasion requirements.
- **Instant Guidance**: Answers store policy questions regarding delivery, returns, payment options, and warranty coverage.
- **Seamless UI Integration**: Accessible via a persistent floating action widget that opens an elegant slide-over drawer without disrupting the user's browsing flow.

---

## ☁️ Deployment Information

- **Frontend Hosting**: Deployed on **Vercel** with automatic deployment triggers connected to the `main` branch. Single Page Application (SPA) routing fallback configured via `vercel.json`.
- **Backend Hosting**: Deployed on **Vercel / Cloud Infrastructure** as Node.js microservices.
- **Production API URL**: `https://backend-three-pi-83.vercel.app`

---

## 🧪 Testing & Build Verification

The application is thoroughly verified to ensure build stability and zero console runtime errors.

- **Vite Production Bundle Verification**:
  ```bash
  npm run build
  ```
  *Output: 100% clean production bundle generation without linting or compilation errors.*

- **API Connectivity**: Verified that product fetching, authorization headers, order status updates, and user session management function seamlessly with backend REST services.

---

## 🔮 Future Enhancements & Roadmap

- [ ] **Stripe & PayPal Integration**: Expand payment gateways alongside Razorpay.
- [ ] **AI-Powered Image Search**: Allow shoppers to upload photos to find matching clothing and accessories.
- [ ] **Customer Reviews & Ratings**: Allow authenticated buyers to leave text reviews and photo uploads.
- [ ] **Automated Email Notifications**: Send transactional email confirmations via Nodemailer / SendGrid upon order completion.
- [ ] **Multi-Currency Support**: Support international currency toggling (USD, EUR, GBP, INR).

---

## 👨‍💻 Author & Acknowledgments

Developed by **Mohd Safwan**.

- **GitHub**: [@Mohd-Safwan07](https://github.com/Mohd-Safwan07)
- **Project Repository**: [Mohd-Safwan07/luxe-ai-ecommerce](https://github.com/Mohd-Safwan07/luxe-ai-ecommerce)

---
*Built with ❤️ using the MERN Stack and Tailwind CSS.*
