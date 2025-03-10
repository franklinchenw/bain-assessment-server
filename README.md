# Distance Calculation Service

Distance Calculation backend service

# Documentation

```bash
http://ec2-3-225-45-11.compute-1.amazonaws.com:4000/api-docs
```

# Live endpoint

```bash
http://ec2-3-225-45-11.compute-1.amazonaws.com:4000/
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Docker Commands

# Build and start all services

```bash
docker-compose up --build
```

# Docker Services

- `server`: Node.js application (port 4000)
- `postgres`: PostgreSQL database (port 5432)

# Remove containers, networks, and volumes

```bash
docker-compose down -v
```

## Manual Installation (Without Docker)

```bash
npm install
```

```bash
npm run start
```

This will start the server in development mode with hot reloading.
