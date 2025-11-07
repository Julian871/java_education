# 🚀 Food Delivery Platform

A modern, scalable food delivery system built with microservices architecture using Spring Boot and React.

## 📖 Overview

This platform enables customers to browse restaurants, place orders, and track deliveries in real-time. Administrators can manage restaurants, menus, and order processing through dedicated interfaces.

### 🎯 Features

**👥 Customer Features**
- Browse restaurants and menus
- Add items to cart
- Place and track orders
- User profile management

**⚙️ Admin Features**
- Restaurant and menu management
- Order status management
- User management
- Analytics dashboard

## 🏗️ Architecture

### Backend Microservices
| Service | Port | Description | Database |
|---------|------|-------------|----------|
| **user-service** | 8081 | User management, authentication, JWT tokens | user_db |
| **restaurant-service** | 8082 | Restaurants, menus, dish management | restaurant_db |
| **order-service** | 8083 | Orders, carts, payment processing | order_db |

### Frontend
- **React Application** (Port 3000) - Responsive UI with role-based views
- **State Management** - Redux for authentication, cart, and user data
- **API Communication** - Axios for REST API calls

## 🛠️ Technology Stack

### Backend
- Java 17, Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA, PostgreSQL
- MapStruct, Lombok
- Kafka (event-driven architecture)
- Docker, Docker Compose

### Frontend
- React 18, React Router
- Redux Toolkit
- Axios for API calls
- Modern CSS/UI framework

## 📚 API Documentation

### Swagger UI
- **User Service:** http://localhost:8081/swagger-ui.html
- **Restaurant Service:** http://localhost:8082/swagger-ui.html
- **Order Service:** http://localhost:8083/swagger-ui.html

### OpenAPI Specs
- JSON specs available at `/v3/api-docs` for each service

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Database Setup

```bash
# Start all databases using Docker
docker-compose up -d

# Check container status
docker ps

# View database logs
docker-compose logs

# Stop databases
docker-compose down