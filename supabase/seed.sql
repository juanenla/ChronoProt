-- ChronoPro - Seed Data
-- Datos iniciales para el proyecto

-- Crear admin inicial (reemplazar email)
INSERT INTO admin_users (email) VALUES ('admin@chronopro.com')
ON CONFLICT (email) DO NOTHING;
