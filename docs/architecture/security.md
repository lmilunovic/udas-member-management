# Security & Authentication

## Authentication

The application uses **Google OAuth2** for authentication. Users must have a valid Google account to log in.

### Login Flow

1. User visits the application
2. Redirected to Google login page
3. After successful Google authentication, user is created/updated in `application_users` table
4. User is assigned a role (default: READ_ONLY)
5. JWT token is issued for subsequent API calls

## Authorization

### Roles

| Role | Description |
|------|-------------|
| READ_ONLY | Can view members |
| READ_WRITE | Can view and manage members |
| ADMIN | Full access including user management |

### Permission Matrix

| Endpoint | READ_ONLY | READ_WRITE | ADMIN |
|----------|-----------|------------|-------|
| GET /api/v1/members | ✓ | ✓ | ✓ |
| GET /api/v1/members/{id} | ✓ | ✓ | ✓ |
| POST /api/v1/members | ✗ | ✓ | ✓ |
| PUT /api/v1/members/{id} | ✗ | ✓ | ✓ |
| DELETE /api/v1/members/{id} | ✗ | ✓ | ✓ |
| GET /api/v1/users | ✗ | ✗ | ✓ |
| POST /api/v1/users | ✗ | ✗ | ✓ |
| PUT /api/v1/users/{id} | ✗ | ✗ | ✓ |
| DELETE /api/v1/users/{id} | ✗ | ✗ | ✓ |

## Security Configuration

Security is configured in `SecurityConfig.java`:

- CSRF is disabled
- Public endpoints: `/api/v1/health`, `/api/v1`
- All other endpoints require authentication
- Method-level security enabled via `@EnableMethodSecurity`

## OAuth2 Implementation

- **CustomOAuth2UserService** - Handles user creation/update on login
- **CustomOAuth2User** - Custom OAuth2 user principal
- **ApplicationUser** entity stores: email, name, role, googleId
