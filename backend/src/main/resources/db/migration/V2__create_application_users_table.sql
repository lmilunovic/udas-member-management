-- V2__create_application_users_table.sql
-- Creates the application users table for authentication

CREATE TABLE application_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'READ_ONLY',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    google_id VARCHAR(255)
);

CREATE INDEX idx_application_users_email ON application_users(email);
CREATE INDEX idx_application_users_role ON application_users(role);
