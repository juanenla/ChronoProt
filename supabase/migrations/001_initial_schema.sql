-- ChronoPro - Initial Database Schema
-- Run this in Supabase SQL Editor

-- Tabla principal de respuestas de usuarios
CREATE TABLE IF NOT EXISTS user_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Perfil del usuario
    chronotype TEXT NOT NULL CHECK (chronotype IN ('morning', 'intermediate', 'evening')),
    training_time TEXT NOT NULL CHECK (training_time IN ('morning', 'midday', 'afternoon', 'night')),
    frequency TEXT NOT NULL CHECK (frequency IN ('low', 'moderate', 'high')),
    diet TEXT NOT NULL,
    experience TEXT NOT NULL CHECK (experience IN ('beginner', 'intermediate', 'advanced')),
    supplements TEXT[] DEFAULT '{}',
    goal TEXT NOT NULL CHECK (goal IN ('hypertrophy', 'strength', 'both')),
    
    -- Metadata
    ip_hash TEXT,
    user_agent TEXT,
    
    -- Plan generado (opcional)
    plan_generated JSONB
);

-- Índices para queries admin
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON user_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_chronotype ON user_responses(chronotype);
CREATE INDEX IF NOT EXISTS idx_responses_diet ON user_responses(diet);

-- Row Level Security
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Solo service_role puede acceder (API routes)
CREATE POLICY "Service role full access" ON user_responses
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Tabla de admins (para auth)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role access admin_users" ON admin_users
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);
