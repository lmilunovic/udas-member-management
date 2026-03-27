# UDAS Member Management - Documentation

Welcome to the UDAS Member Management backend documentation.

## Quick Links

- [Architecture Overview](architecture/overview.md)
- [Security & Authentication](architecture/security.md)
- [API Reference](api/README.md)
- [Features](features.md)

## Getting Started

See [Architecture Overview](architecture/overview.md) for setup instructions.

## Project Structure

```
backend/
├── src/main/java/ba/rs/udas/udas_member_management/
│   ├── controller/    # REST controllers
│   ├── service/       # Business logic
│   ├── repository/    # Data access
│   ├── entity/        # JPA entities
│   ├── mapper/        # MapStruct mappers
│   ├── configuration/ # App configuration
│   └── exception/     # Exception handling
├── src/main/resources/
│   ├── openapi.yaml   # API specification
│   └── db/migration/  # Flyway migrations
```
