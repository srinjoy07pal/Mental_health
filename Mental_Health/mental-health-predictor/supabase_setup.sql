-- ==========================================
-- SUPABASE SCHEMA SETUP
-- Run this in the Supabase SQL Editor
-- ==========================================

-- 1. users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. assessment_history table
CREATE TABLE assessment_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    anxiety_score FLOAT,
    depression_score FLOAT,
    stress_score FLOAT,
    tension_score FLOAT,
    overall_score FLOAT,
    overall_status VARCHAR(50),
    report_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. questionnaire_answers table
CREATE TABLE questionnaire_answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    answers_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. game_metrics table
CREATE TABLE game_metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    memory_score FLOAT,
    focus_score FLOAT,
    reaction_time FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note: Ensure Row Level Security (RLS) is disabled or configured properly
-- if you plan to access these tables directly from the frontend.
-- For backend access via service_role key, RLS is bypassed.
