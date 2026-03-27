# OAuth2 User Authentication - Design Spec

**Date:** 2026-03-27  
**Status:** Approved

## Overview

Restructure OAuth2 authentication to require pre-registration of users in the database, with admin bootstrapping via environment variable.

## Security Model

| Config | Purpose |
|--------|---------|
| `allowed-domain` | Security boundary - only Google accounts from this domain can authenticate |
| `ADMIN_EMAIL` (env) | First admin bootstrapped from environment variable on startup |

## User Authentication Flow

```
User → Google OAuth → Check allowed-domain → Check user exists in DB → 
  If exists → Grant role from DB → Allow login
  If not exists → Reject (403 Forbidden)
```

## Admin Bootstrapping

On application startup:

1. `ApplicationReadyEvent` listener checks if `application_users` table is empty
2. If empty, reads `ADMIN_EMAIL` environment variable
3. Creates admin user with:
   - Email from `ADMIN_EMAIL`
   - Role: `ADMIN`
   - Active: `true`
4. Admin can then OAuth in and manage other users via API

## Changes

### 1. Remove Admin Emails Config

**File:** `backend/src/main/java/ba/rs/udas/udas_member_management/configuration/AppProperties.java`
- Remove `adminEmails` from `Security` record

**File:** `backend/src/main/resources/application.yaml`
- Remove `admin-emails` property

### 2. Update CustomOAuth2UserService

**File:** `backend/src/main/java/ba/rs/udas/udas_member_management/service/CustomOAuth2UserService.java`

Changes:
- Remove `createNewUser()` logic
- Remove admin email check logic
- Add validation: if user not found in DB → throw `OAuth2AuthenticationException("Access denied. User not registered.")`
- Keep domain validation from `allowed-domain`
- Keep active user check

### 3. Create Admin Bootstrap Component

**New File:** `backend/src/main/java/ba/rs/udas/udas_member_management/configuration/AdminBootstrap.java`

```java
@Component
@EventListener(ApplicationReadyEvent.class)
public class AdminBootstrap {
    // Seeds admin from ADMIN_EMAIL env var if DB is empty
}
```

### 4. Update ApplicationUserService

**File:** `backend/src/main/java/ba/rs/udas/udas_member_management/service/ApplicationUserService.java`

Changes:
- Add `createAdminUser(String email)` method for bootstrap

## API Endpoints (Unchanged)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/users` | Create user | ADMIN only |
| GET | `/api/v1/users` | List users | ADMIN only |
| GET | `/api/v1/users/{id}` | Get user | ADMIN only |
| PUT | `/api/v1/users/{id}` | Update user role | ADMIN only |
| DELETE | `/api/v1/users/{id}` | Delete user | ADMIN only |
| GET | `/api/v1/members` | List members | READ_ONLY, READ_WRITE, ADMIN |
| POST/PUT/DELETE | `/api/v1/members/**` | Manage members | READ_WRITE, ADMIN |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_EMAIL` | First startup only | Initial admin user's Google email |
| `ALLOWED_DOMAIN` | Yes | Domain allowed for authentication (e.g., "company.com") |

## Example Configuration

```yaml
app:
  security:
    allowed-domain: "company.com"
```

```bash
ADMIN_EMAIL=admin@company.com ./mvnw spring-boot:run
```

## Rollback Considerations

- Admin user can be deleted via API, but a new one requires:
  1. Set `ADMIN_EMAIL` env var
  2. Restart application (if no users exist)
