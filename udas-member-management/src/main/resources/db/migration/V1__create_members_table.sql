-- V1__create_members_table.sql
-- Creates the members table for UDAS Member Management

CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email JSONB NOT NULL DEFAULT '[]',
    phone JSONB NOT NULL DEFAULT '[]',
    date_of_birth DATE,
    date_of_death DATE,
    ssn VARCHAR(50),
    street VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100)
);

CREATE INDEX idx_members_first_name ON members(first_name);
CREATE INDEX idx_members_last_name ON members(last_name);
CREATE INDEX idx_members_city ON members(city);
CREATE INDEX idx_members_country ON members(country);
