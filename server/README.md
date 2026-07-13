# BookMyVenue - Backend Server

Backend service for **BookMyVenue**, built with **Spring Boot**, **Java 21**, and **Maven**.

The project uses **PostgreSQL** running inside Docker. The backend application can be run either from an IDE (recommended for backend developers) or inside Docker (recommended for frontend developers and deployment).

---

# Tech Stack

* **Language:** Java 21
* **Framework:** Spring Boot 3.5.14
* **Build Tool:** Apache Maven
* **Database:** PostgreSQL
* **Containerization:** Docker & Docker Compose

---

# Prerequisites

Before running the project, make sure the following are installed.

## 1. Java 21

Check installed version:

```bash
java -version
```

---

## 2. Docker & Docker Compose

Check installation:

```bash
docker --version
docker compose version
```

---

# Running the Project

## Step 1: Configure Environment Variables

Inside the `server/` directory, create a local `.env` file from the example template:

```bash
cp ..env.example ..env
```

Verify the values:

```env
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_NAME=bookmyvenue_db

JWT_SECRET=<your-secret>
JWT_ACCESS_TOKEN_EXPIRATION=900000
JWT_REFRESH_TOKEN_EXPIRATION=604800000
```

---

# Backend Developer Setup (Recommended)

Backend developers should run PostgreSQL in Docker and run Spring Boot from IntelliJ IDEA.

## Step 1: Start PostgreSQL

```bash
docker compose up -d postgres
```

Verify:

```bash
docker ps
```

You should see:

```text
bmv-postgres-db
```

## Step 2: Run Spring Boot

Run the application from IntelliJ IDEA or:

```bash
./mvnw spring-boot:run
```

When you see:

```text
Started ServerApplication
```

the backend server is running.

The application will be available at:

```text
http://localhost:8080
```

---

# Frontend Developer Setup

Frontend developers do not need Java, Maven, or IntelliJ.

Start the entire backend stack using Docker:

```bash
docker compose up --build
```

This starts:

* PostgreSQL
* Spring Boot Backend

The API will be available at:

```text
http://localhost:8080
```

---

# Stopping Containers

Stop all services:

```bash
docker compose down
```

Database data will remain safe because Docker volumes are persisted.

To remove all database data and start fresh:

```bash
docker compose down -v
```

---

# Project Structure

```text
server/
├── src/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── pom.xml
├── mvnw
└── README.md
```

---

# Deployment

Build and start all services:

```bash
docker compose up -d --build
```

This will:

1. Start PostgreSQL
2. Build the Spring Boot Docker image
3. Start the backend container
4. Apply Flyway migrations

---

# Notes

* Ensure Docker is running before starting the project.
* Use Java 21 for compatibility.
* PostgreSQL runs inside Docker for consistency across environments.
* Backend developers are encouraged to run Spring Boot from IntelliJ for easier debugging and faster development.
* Frontend developers can run the full backend stack using Docker only.
