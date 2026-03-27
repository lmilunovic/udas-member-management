# API Reference

## Overview

The API is documented using OpenAPI 3.0. The full specification is available in [`backend/src/main/resources/openapi.yaml`](../../backend/src/main/resources/openapi.yaml).

## Base URL

```
http://localhost:8080/api/v1
```

## Authentication

All endpoints require OAuth2 authentication. See [Security Documentation](../architecture/security.md).

## Endpoints

### Members

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | /members | List members (paginated, filterable) | READ_ONLY |
| POST | /members | Create a member | READ_WRITE |
| GET | /members/{id} | Get member by ID | READ_ONLY |
| PUT | /members/{id} | Update member | READ_WRITE |
| DELETE | /members/{id} | Delete member | READ_WRITE |

### Users

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | /users | List all users | ADMIN |
| POST | /users | Create a user | ADMIN |
| GET | /users/{id} | Get user by ID | ADMIN |
| PUT | /users/{id} | Update user | ADMIN |
| DELETE | /users/{id} | Delete user | ADMIN |

## Query Parameters (Members)

| Parameter | Type | Default | Description |
|------------|------|---------|-------------|
| firstName | string | - | Filter by first name |
| lastName | string | - | Filter by last name |
| email | string | - | Filter by email |
| phone | string | - | Filter by phone |
| city | string | - | Filter by city |
| country | string | - | Filter by country |
| page | integer | 0 | Page number |
| size | integer | 20 | Page size |
| sort | string | id,asc | Sort field and direction |

## OpenAPI Generation

API code is generated from `openapi.yaml` using the OpenAPI Generator Maven plugin:

```bash
cd backend
mvn compile
```

Generated code:
- API interfaces: `ba.rs.udas.udas_member_management.api`
- Model classes: `ba.rs.udas.udas_member_management.model`
