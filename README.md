# Food Delivery Platform

Microservice-based food delivery system built with Spring Boot and React.

## Architecture

- **user-service** (8081) - user management and authentication
- **restaurant-service** (8082) - restaurants and menus
- **order-service** (8083) - orders and carts
- **React frontend** (3000) - client application

Each service uses its own PostgreSQL database.

## Quick Start

### 1. Database Management (Docker)

```bash
# Start all databases
docker-compose up -d

# Stop all databases  
docker-compose down

# Check container status
docker ps

# View database logs
docker-compose logs
```

