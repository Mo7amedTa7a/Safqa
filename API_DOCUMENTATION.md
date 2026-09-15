# 📚 Safqa B2B E-commerce API Documentation

This document provides a comprehensive overview of the endpoints available in the Safqa system. The API is RESTful and uses standard HTTP methods and status codes.

> **Base URL:** `http://localhost:3000` (or your production domain).
> **Authentication:** Most routes require a valid JWT token passed in the `Authorization` header as `Bearer <token>`.

---

## 1️⃣ Auth & Users 👤
*Manages authentication, user accounts, and supplier profiles.*

| Method | Endpoint | Description | Auth/Roles |
|--------|----------|-------------|------------|
| **POST** | `/api/auth/register` | Register a new user | Public |
| **POST** | `/api/auth/login` | Login and get JWT token | Public |
| **GET** | `/api/users/me` | Get current logged-in user profile | Any Logged-in |
| **PATCH**| `/api/users/me` | Update current user profile | Any Logged-in |
| **GET** | `/api/users` | Get all users | `ADMIN` |
| **GET** | `/api/users/:id` | Get user by ID | `ADMIN` |
| **DELETE**| `/api/users/:id` | Deactivate user account | `ADMIN` |
| **POST** | `/api/supplier-profiles` | Create a supplier profile | `SUPPLIER` |
| **PATCH**| `/api/supplier-profiles/:id/approve` | Approve a supplier profile | `ADMIN` |
| **PATCH**| `/api/supplier-profiles/:id/reject` | Reject a supplier profile | `ADMIN` |

---

## 2️⃣ Products & Categories 📦
*Manages the catalog, categories, and products.*

| Method | Endpoint | Description | Auth/Roles |
|--------|----------|-------------|------------|
| **GET** | `/api/categories` | Get all categories | Public |
| **GET** | `/api/categories/:id` | Get category by ID | Public |
| **POST** | `/api/categories` | Create a new category | `ADMIN` |
| **PATCH**| `/api/categories/:id` | Update a category | `ADMIN` |
| **DELETE**| `/api/categories/:id` | Deactivate a category | `ADMIN` |
| **GET** | `/api/products` | Get all products (with search/filter) | Public |
| **GET** | `/api/products/:id` | Get product details | Public |
| **POST** | `/api/products` | Create a new product | `SUPPLIER` |
| **PATCH**| `/api/products/:id` | Update product details | `SUPPLIER` |
| **DELETE**| `/api/products/:id` | Delete/Deactivate product | `ADMIN` |

---

## 3️⃣ B2B Purchasing & Deals 🤝
*Handles buying requests, pools, offers, deals, and final orders.*

| Method | Endpoint | Description | Auth/Roles |
|--------|----------|-------------|------------|
| **GET** | `/api/buying-requests` | List all buying requests | Any Logged-in |
| **POST** | `/api/buying-requests` | Create a buying request | `BUYER` |
| **GET** | `/api/buying-pools` | List all active buying pools | Any Logged-in |
| **POST** | `/api/buying-pools` | Create a buying pool | `BUYER` |
| **POST** | `/api/buying-pools/:id/close` | Close a pool | `ADMIN` |
| **GET** | `/api/pool-members` | List members of pools | Any Logged-in |
| **POST** | `/api/pool-members` | Join a buying pool | `BUYER` |
| **GET** | `/api/supplier-offers` | List offers from suppliers | Any Logged-in |
| **POST** | `/api/supplier-offers` | Supplier makes an offer | `SUPPLIER` |
| **GET** | `/api/deals` | List all deals | `ADMIN` |
| **GET** | `/api/deals/:id` | Get specific deal | `ADMIN`, `SUPPLIER` |
| **PATCH**| `/api/deals/:id/status`| Update deal status | `ADMIN`, `SUPPLIER` |
| **POST** | `/api/deal-selections` | Select a deal | `BUYER` |
| **POST** | `/api/direct-deal-selections` | Select direct deal | `BUYER` |
| **GET** | `/api/orders` | Get list of orders | `ADMIN`, `SUPPLIER`, `BUYER` |
| **POST** | `/api/orders` | Create an order from a deal | `BUYER` |
| **PATCH**| `/api/orders/:id/status`| Update order status | `ADMIN` |

---

## 4️⃣ Fulfillment & Financials (Member 5) 🚚💳
*Handles shipments, payments, settlements, and post-sale operations.*

| Method | Endpoint | Description | Auth/Roles |
|--------|----------|-------------|------------|
| **GET** | `/api/shipments` | List shipments | `SHIPPING_PARTNER`, `SUPPLIER`, `ADMIN` |
| **POST** | `/api/orders/:orderId/shipments` | Create shipment for an order | `ADMIN` |
| **PATCH**| `/api/shipments/:id/assign` | Assign shipping partner | `ADMIN` |
| **PATCH**| `/api/shipments/:id/status` | Update shipment tracking status | `SHIPPING_PARTNER`, `ADMIN` |
| **POST** | `/api/shipments/:id/pickup-proof`| Add pickup proof document/image | `SHIPPING_PARTNER` |
| **GET** | `/api/payments` | List payments | `ADMIN` |
| **POST** | `/api/orders/:orderId/payments` | Process payment for order | `BUYER` |
| **GET** | `/api/settlements` | List supplier settlements | `SUPPLIER`, `ADMIN` |
| **POST** | `/api/orders/:orderId/settlement`| Create settlement entry | `ADMIN` (System) |
| **GET** | `/api/disputes` | List disputes | `ADMIN` |
| **POST** | `/api/orders/:orderId/dispute` | Open a dispute against order | `BUYER`, `SUPPLIER` |
| **PATCH**| `/api/disputes/:id/resolve` | Resolve a dispute | `ADMIN` |
| **GET** | `/api/returns` | List returns | `ADMIN` |
| **POST** | `/api/orders/:orderId/return` | Request an order return | `BUYER` |
| **PATCH**| `/api/returns/:id/process` | Process return (approve/reject) | `ADMIN`, `SUPPLIER` |
| **GET** | `/api/refunds` | List refunds | `ADMIN` |
| **POST** | `/api/returns/:returnId/refund` | Issue refund for a return | `ADMIN` |
| **GET** | `/api/reviews` | List product/supplier reviews | Public |
| **POST** | `/api/orders/:orderId/review` | Submit a review | `BUYER` |
| **GET** | `/api/notifications` | Get user notifications | Any Logged-in |
| **PATCH**| `/api/notifications/:id/read` | Mark notification as read | Any Logged-in |

---
