# UDAS Member Management API

API backend for managing organization members.

## Prerequisites

- **Java 17** or higher
- **PostgreSQL 14+** (for local development)
- **Maven** (or use the included Maven wrapper)

## Database Setup

### Local PostgreSQL

1. Create a PostgreSQL database:

```sql
CREATE DATABASE udas_member_management;
```

2. Create a user (optional - you can use your existing PostgreSQL user):

```sql
CREATE USER udas WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE udas_member_management TO udas;
```

### Running the Application

**Development mode (uses application-dev.yaml):**

```bash
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

**Production mode:**

```bash
export SPRING_PROFILES_ACTIVE=prod
export DB_HOST=your-production-host
export DB_PORT=5432
export DB_NAME=udas_member_management
export DB_USERNAME=your-username
export DB_PASSWORD=your-password

./mvnw spring-boot:run
```

## Configuration

Configuration is managed through Spring profiles:

| File | Purpose | Use |
|------|---------|-----|
| `application.yaml` | Shared defaults | All environments |
| `application-dev.yaml` | Local development | `./mvnw spring-boot:run` |
| `application-prod.yaml` | Production | Set `SPRING_PROFILES_ACTIVE=prod` |

### Development Configuration (application-dev.yaml)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/udas_member_management
    username: udas
    password: dev_password
```

### Production Configuration (application-prod.yaml)

Uses environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | - |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | - |
| `DB_USERNAME` | Database username | - |
| `DB_PASSWORD` | Database password | - |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/members` | Create a new member |
| GET | `/api/v1/members` | List all members (paginated, filterable) |
| GET | `/api/v1/members/{id}` | Get a member by ID |
| PUT | `/api/v1/members/{id}` | Update a member |
| DELETE | `/api/v1/members/{id}` | Delete a member |

### Query Parameters (GET /members)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | 0 | Page number |
| `size` | Integer | 20 | Page size |
| `sort` | String | id,asc | Sort format: field,direction |
| `firstName` | String | - | Filter by first name |
| `lastName` | String | - | Filter by last name |
| `email` | String | - | Filter by email |
| `phone` | String | - | Filter by phone |
| `city` | String | - | Filter by city |
| `country` | String | - | Filter by country |

### Example Requests

```bash
# List members (paginated)
curl http://localhost:8080/api/v1/members?page=0&size=10

# Filter members
curl http://localhost:8080/api/v1/members?lastName=Smith&city=London

# Get single member
curl http://localhost:8080/api/v1/members/123e4567-e89b-12d3-a456-426614174000

# Create member
curl -X POST http://localhost:8080/api/v1/members \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John", "lastName": "Doe", "email": ["john@example.com"]}'
```

## Database Migrations

Database schema is managed via **Flyway**. Migrations are located in:

```
src/main/resources/db/migration/
```

On application startup, Flyway automatically runs any pending migrations.

## Project Structure

```
src/main/java/ba/rs/udas/udas_member_management/
├── configuration/       # Configuration properties
├── controller/          # REST controllers
├── entity/              # JPA entities
├── exception/           # Exception handling
├── model/               # API models (generated from OpenAPI)
├── repository/          # JPA repositories
└── service/            # Business logic
```

## Building

```bash
# Compile
./mvnw compile

# Package
./mvnw package

# Run tests
./mvnw test
```
