# 🚀 Food Delivery Platform

A modern, scalable food delivery system built with microservices architecture using Spring Boot and React.

## 📖 Overview

This platform enables customers to browse restaurants, place orders, and track deliveries in real-time. Administrators can manage restaurants, menus, and order processing through dedicated interfaces.

### 🎯 Features

### 👥 Customer Features
- 🏠 Browse restaurants with search and filter capabilities
- 🍽️ View restaurant menus with dish details
- 🛒 Add items to cart with quantity management
- 💳 Place orders with multiple payment methods
- 📊 Track order status in real-time
- 👤 User profile management with address book

### ⚙️ Admin Features
- 🏪 Restaurant management (CRUD operations)
- 🍲 Dish management per restaurant
- 📦 Order management with status updates
- 👥 User management and role assignment
- 📊 View user order history
- 🔐 Role-based access control (ADMIN role)

## 🏗️ Architecture

### Backend Microservices
| Service | Port | Description | Database |
|---------|------|-------------|----------|
| **user-service** | 8081 | User management, authentication, JWT tokens | user_db |
| **restaurant-service** | 8082 | Restaurants, menus, dish management | restaurant_db |
| **order-service** | 8083 | Orders, carts, payment processing | order_db |

### Frontend
- **Port:** 3000 (React Development Server)
- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6 with protected routes
- **State Management:** Redux Toolkit
- **UI Library:** Material-UI (MUI) v5
- **Build Tool:** Vite

## 🛠️ Technology Stack

### Backend
- Java 17, Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA, PostgreSQL
- MapStruct, Lombok
- Kafka (event-driven architecture)
- Docker, Docker Compose

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router v6 for routing
- Material-UI v5 for components
- Axios for API communication
- Vite as build tool

## 📚 API Documentation

### Swagger UI
- **User Service:** http://localhost:8081/swagger-ui.html
- **Restaurant Service:** http://localhost:8082/swagger-ui.html
- **Order Service:** http://localhost:8083/swagger-ui.html

### OpenAPI Specs
- JSON specs available at `/v3/api-docs` for each service

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Git

### Quick Start with Docker

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd food-delivery-platform