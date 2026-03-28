# Frontend & Docker Setup Design

**Session:** ses_2ce86c080ffedRvvg50U7uPyN5  
**Date:** 2026-03-28  
**Status:** Draft

---

## Overview

Design for implementing a React frontend and Docker setup for the UDAS Member Management application.

## Requirements

- Role-based UI: Regular users (READ_ONLY, READ_WRITE) and Admins (ADMIN)
- Simple admin panel with member CRUD and user management
- Full-stack Docker containerization
- React + Vite frontend framework

---

## Frontend Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| State/Fetching | TanStack Query (React Query) |
| HTTP Client | Axios |
| Styling | CSS Modules |
| Auth | OAuth2 (Google) via backend |

### Pages

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Dashboard | `/` | Authenticated |
| Members List | `/members` | Authenticated |
| Member Form | `/members/new`, `/members/:id/edit` | Authenticated |
| Users List | `/users` | ADMIN only |
| User Form | `/users/new`, `/users/:id/edit` | ADMIN only |

### API Integration

- TypeScript types matching backend OpenAPI schemas
- Service layer: `src/api/members.ts`, `src/api/users.ts`
- TanStack Query hooks for each API operation with caching

### Component Structure

```
src/
├── api/
│   ├── members.ts    # Member API calls
│   ├── users.ts      # User API calls
│   └── types.ts      # TypeScript interfaces
├── components/
│   ├── Layout/       # App shell with nav
│   ├── Table/        # Reusable data table
│   ├── Modal/       # Dialog for forms
│   ├── Button/      # Styled buttons
│   └── Input/       # Form inputs
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Members/
│   │   ├── MemberList.tsx
│   │   └── MemberForm.tsx
│   └── Users/
│       ├── UserList.tsx
│       └── UserForm.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
└── App.tsx
```

---

## Docker Architecture

### Services

| Service | Image | Ports | Purpose |
|---------|-------|-------|---------|
| postgres | postgres:14 | 5432 | Database |
| backend | build from backend/ | 8080 | REST API |
| frontend | build from frontend/ | 5173 | SPA |

### Network

- Shared `app-network` for all services
- Frontend accesses backend via `http://backend:8080`
- Backend connects to postgres via `jdbc:postgresql://postgres:5432`

### Volumes

- `postgres-data` - Persists database across restarts

### Environment

```yaml
# docker-compose.yml environment
POSTGRES_DB: udas_member_management
POSTGRES_USER: udas
POSTGRES_PASSWORD: dev_password

SPRING_PROFILES_ACTIVE: dev
DB_HOST: postgres
DB_PORT: 5432
DB_NAME: udas_member_management
DB_USERNAME: udas
DB_PASSWORD: dev_password

VITE_API_URL: http://localhost:8080/api/v1
```

---

## Security

- OAuth2 flow: Frontend redirects to backend `/oauth2/authorization/google`
- Backend handles OAuth exchange, sets session cookie
- Frontend checks auth state via `/api/v1/users/me`
- Role-based route guards on frontend

---

## Acceptance Criteria

1. [ ] Docker Compose starts all 3 services successfully
2. [ ] Frontend accessible at http://localhost:5173
3. [ ] Google OAuth login works end-to-end
4. [ ] Members CRUD operations functional
5. [ ] ADMIN users can access /users routes
6. [ ] Non-ADMIN users cannot access /users routes
7. [ ] Data persists in PostgreSQL volume

---

## Out of Scope

- CI/CD pipelines
- Production deployment configs
- Email notifications
- File upload/download for members
- Advanced search features
