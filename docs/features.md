# Features

## Implemented Features

### Member Management ✓

- [x] Create new member
- [x] List members with pagination
- [x] Filter members by firstName, lastName, email, phone, city, country
- [x] Get member by ID
- [x] Update member
- [x] Delete member

### User Management ✓

- [x] Create application user
- [x] List all users
- [x] Get user by ID
- [x] Update user
- [x] Delete user

### Authentication ✓

- [x] Google OAuth2 login
- [x] JWT token-based API access
- [x] Role-based access control (READ_ONLY, READ_WRITE, ADMIN)

### Database ✓

- [x] PostgreSQL database
- [x] Flyway migrations
- [x] JSONB support for arrays (emails, phones)

### API ✓

- [x] OpenAPI 3.0 specification
- [x] Auto-generated API code from OpenAPI
- [x] Standard REST patterns

### Testing ✓

- [x] Unit tests for services
- [x] Unit tests for mappers
- [x] Controller tests
- [x] Integration tests with Testcontainers

## Planned Features

- [ ] Member search functionality
- [ ] Member export (CSV/PDF)
- [ ] Audit logging
- [ ] Email notifications
- [ ] Member photo upload
- [ ] Activity tracking

## Data Model

### Member

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| firstName | string | Member's first name |
| lastName | string | Member's last name |
| email | string[] | List of email addresses |
| phone | string[] | List of phone numbers |
| dateOfBirth | date | Date of birth |
| dateOfDeath | date | Date of death (if applicable) |
| ssn | string | Social security number |
| street | string | Street address |
| city | string | City |
| postalCode | string | Postal code |
| country | string | Country |

### ApplicationUser

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| email | string | User's email (unique) |
| name | string | Display name |
| role | enum | READ_ONLY, READ_WRITE, ADMIN |
| active | boolean | Is user active |
| createdAt | timestamp | Account creation time |
| googleId | string | Google account ID |
