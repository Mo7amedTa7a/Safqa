# Safqa

## 🛒 Group Purchasing Platform

Safqa is a full-stack group purchasing platform developed as the **Final Project for the NTI MEAN Stack Track**.

The platform connects buyers and suppliers and allows users to create purchasing requests, join group buying pools, receive supplier offers, and manage deals and orders.

## 🚀 Features

### 👤 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-based authorization
* Support for Buyer, Supplier, Admin, and Shipping Partner roles

### 🛍️ Products

* Product management
* Product categories
* Supplier product management

### 📋 Buying Requests

* Create and manage buying requests
* Support for direct and group purchasing

### 👥 Buying Pools

* Create group buying pools
* Buyers can join pools
* Manage pool members
* Close pools when the required conditions are met

### 💰 Supplier Offers

* Suppliers can submit offers
* MOQ-based offer eligibility
* Quantity-based pricing
* Supplier offer selection

### 🤝 Deals & Orders

* Select the appropriate supplier offer
* Create deals from buying pools or direct requests
* Generate orders for pool members
* Track order status

## 🛠️ Technologies

### Frontend

* Angular
* TypeScript
* HTML
* CSS

### Backend

* Node.js
* Express.js
* JavaScript
* REST APIs

### Database

* MongoDB
* Mongoose

### Tools

* Git & GitHub
* Postman
* VS Code

## 🏗️ Backend Architecture

The backend follows a layered architecture:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

This structure helps separate responsibilities and keeps the backend easier to maintain and extend.

## 🌐 Live Demo

[Safqa](https://safqa-xi.vercel.app/)

## 👨‍💻 Team

Developed as a team project for the **NTI MEAN Stack Track**.

## 📌 Project Status

Final project completed and presented as part of the NTI MEAN Stack Track.
