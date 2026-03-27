# Architecture Overview

## Tech Stack

- **Framework:** Spring Boot 3.2.2
- **Language:** Java 17
- **Database:** PostgreSQL with Flyway migrations
- **Authentication:** Spring Security + OAuth2 (Google)
- **API:** REST with OpenAPI 3.0
- **Build:** Maven

## Key Dependencies

| Dependency | Purpose |
|------------|---------|
| spring-boot-starter-security | Authentication & authorization |
| spring-boot-starter-data-jpa | Database access |
| spring-boot-starter-oauth2-client | Google OAuth2 login |
| flyway-core | Database migrations |
| mapstruct | DTO mapping |
| lombok | Boilerplate reduction |
| testcontainers | Integration testing |

## Project Structure

```
src/main/java/ba/rs/udas/udas_member_management/
├── controller/      # REST endpoints
│   ├── MemberController.java
│   ├── ApplicationUserController.java
│   └── ApiController.java
├── service/         # Business logic
│   ├── MemberService.java
│   ├── ApplicationUserService.java
│   └── CustomOAuth2UserService.java
├── repository/      # Data access
│   ├── MemberRepository.java
│   └── ApplicationUserRepository.java
├── entity/          # JPA entities
│   ├── MemberEntity.java
│   ├── ApplicationUser.java
│   └── UserRole.java
├── mapper/          # MapStruct mappers
│   ├── MemberMapper.java
│   └── ApplicationUserMapper.java
├── configuration/  # App configuration
│   ├── SecurityConfig.java
│   ├── AppProperties.java
│   └── AdminBootstrap.java
└── exception/       # Error handling
    └── GlobalExceptionHandler.java
```

## Core Concepts

### Member vs ApplicationUser

- **Member** - An individual within the UDAS organization that the system tracks (name, contact info, address, date of birth, etc.)
- **ApplicationUser** - A user who can log into the application with specific permissions (READ_ONLY, READ_WRITE, ADMIN)

A Member is the data being managed; an ApplicationUser is who manages it.

## Database

Database schema is managed via Flyway migrations in `src/main/resources/db/migration/`:

- V1__create_members_table.sql
- V2__create_application_users_table.sql

## Configuration

Configuration is managed via `application.properties` (not committed) with defaults in `application-default.properties` if present.

Key properties:
- `spring.datasource.*` - Database connection
- `spring.security.oauth2.client.registration.google.*` - OAuth2 config
