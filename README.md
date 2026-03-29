# UDAS Member Management

[![CI](https://github.com/lmilunovic/udas-member-management/actions/workflows/ci.yml/badge.svg)](https://github.com/lmilunovic/udas-member-management/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=lmilunovic_udas-member-management&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=lmilunovic_udas-member-management)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=lmilunovic_udas-member-management&metric=coverage)](https://sonarcloud.io/summary/new_code?id=lmilunovic_udas-member-management)
![Java](https://img.shields.io/badge/Java-21-007396?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.2-6DB33F?logo=springboot&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

## About

UDAS Member Management is a web application for managing organization members. It supports creating, editing, filtering, and paginating member records. Access is secured via Google OAuth2 with role-based permissions: **READ_ONLY**, **READ_WRITE**, and **ADMIN**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 3.2.2, Java 21 |
| Database | PostgreSQL 14+ |
| Migrations | Flyway |
| API | REST · OpenAPI 3.0 |
| Frontend | React 18, TypeScript, Vite |
| Auth | Google OAuth2 |

## Prerequisites

- **Java 21+** — backend runtime
- **Node.js 18+** — frontend tooling
- **Docker & Docker Compose** — recommended for local development
- **PostgreSQL 14+** — only needed if running without Docker
- **Google OAuth2 credentials** — Client ID and Secret from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

## Getting Started

### Option A — Docker Compose (recommended)

```bash
cp .env.example .env
# Edit .env: fill in GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and ADMIN_EMAIL
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

### Option B — Native

**Backend**

```bash
cd backend
./mvnw spring-boot:run
```

API available at `http://localhost:8080`. Requires a running PostgreSQL instance — see `.env.example` for the expected database configuration.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

UI available at `http://localhost:5173`.

## Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |
| `ADMIN_EMAIL` | Email address that receives the ADMIN role on first login |
| `POSTGRES_PASSWORD` | Database password |
| `DB_HOST` | Database host (`postgres` in Docker, `localhost` otherwise) |
