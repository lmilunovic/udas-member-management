# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UDAS Member Management is a full-stack web app for managing organization members. It uses Google OAuth2 for authentication with role-based access control (READ_ONLY, READ_WRITE, ADMIN).

## General notes

- NEVER use System.getenv() to access environment variables. Variables should be passed via application properties.
- ALWAYS build and run tests when finished
- NEVER exclude tests from coverage report unless explicitly told

## Commands

### Docker (primary development method)
```bash
docker-compose up           # Start all services (postgres, backend, frontend)
docker-compose up --build   # Rebuild images first
docker-compose down         # Stop services
```

### Backend (Spring Boot / Maven)
```bash
cd backend
./mvnw spring-boot:run      # Run dev server (port 8080)
./mvnw test                 # Run all tests
./mvnw test -Dtest=MemberServiceTest  # Run single test class
./mvnw package              # Build JAR
```

### Frontend (Vite / React)
```bash
cd frontend
npm run dev                 # Dev server on port 5173
npm run build               # TypeScript compile + Vite build
npm run lint                # ESLint with TypeScript
npm run preview             # Preview production build
```

## Architecture

### Backend (`backend/`)
Spring Boot 3.2.2, Java 17, PostgreSQL. Package root: `ba.rs.udas.udas_member_management`.

Key packages:
- `configuration/` — `SecurityConfig` (OAuth2 + CORS + role authorization), `AppProperties` (@ConfigurationProperties), `AdminBootstrap` (seeds admin user on startup)
- `controller/` — REST endpoints: `MemberController`, `ApplicationUserController`, `LogoutController`
- `service/` — Business logic + OAuth2 user loading via `CustomOidcUserService` (creates/syncs users on first Google login)
- `entity/` — `MemberEntity`, `ApplicationUser`, `UserRole` enum (READ_ONLY, READ_WRITE, ADMIN)
- `mapper/` — MapStruct mappers for DTO conversion
- `repository/` — Spring Data JPA repositories

Database migrations managed by Flyway (`src/main/resources/db/migration/`).

API prefix: `/api/v1`. Endpoint security by role:
- Public: `/api/v1/health`, `/api/v1/auth/logout`
- READ_ONLY+: `GET /api/v1/members/**`
- READ_WRITE+: `POST/PUT/DELETE /api/v1/members/**`
- ADMIN only: `/api/v1/users/**`

### Frontend (`frontend/`)
React 18 + TypeScript + Vite. TailwindCSS for styling. TanStack React Query for server state.

Key files:
- `src/App.tsx` — Route definitions with `PrivateRoute` guard
- `src/context/AuthContext.tsx` — Auth state (user info, loading, authenticated flag)
- `src/api/` — Axios-based API calls (`members.ts`, `users.ts`, `types.ts`)
- `src/pages/` — Login, Dashboard, Members (list + form), Users (list + form, admin only)

Auth flow: Frontend redirects to Google → backend `/oauth2/authorization/google` → Google callback → backend creates/syncs `ApplicationUser` → session established.

### Configuration

Profiles: `dev` (default, uses localhost postgres) and `prod` (uses env vars).

Key env vars in `.env` (used by docker-compose):
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth2 credentials
- `ADMIN_EMAIL` — Email that gets ADMIN role on first login
- `DB_*` — Database connection settings
- `VITE_API_URL` — Backend URL for frontend (default: `http://localhost:8080/api/v1`)

### Testing

Backend tests use TestContainers (PostgreSQL) for integration tests. Test fixtures in `src/test/java/.../fixtures/`. Integration tests in `src/test/java/.../integration/`.
