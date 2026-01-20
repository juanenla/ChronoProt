-- Create exercises table
create table if not exists public.exercises (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  muscle_group text not null, -- 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'
  equipment text, -- 'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight'
  difficulty text, -- 'Beginner', 'Intermediate', 'Advanced'
  description text
);

-- Enable RLS
alter table public.exercises enable row level security;

-- Policy: Everyone can read exercises
create policy "Exercises are viewable by everyone" 
  on public.exercises for select 
  using (true);

-- Policy: Only admins can insert/update/delete (using service role for now)
-- In a real app we'd check auth.uid() against admin_users table

-- Seed Initial Data
insert into public.exercises (name, muscle_group, equipment, difficulty) values
  ('Press de Banca (Barra)', 'Pecho', 'Barra', 'Intermedio'),
  ('Press de Banca Inclinado (Mancuernas)', 'Pecho', 'Mancuernas', 'Intermedio'),
  ('Aperturas con Cable', 'Pecho', 'Cable', 'Principiante'),
  ('Fondos en Paralelas', 'Pecho', 'Peso Corporal', 'Avanzado'),
  ('Flexiones de Brazos', 'Pecho', 'Peso Corporal', 'Principiante'),
  
  ('Dominadas', 'Espalda', 'Peso Corporal', 'Intermedio'),
  ('Remo con Barra', 'Espalda', 'Barra', 'Avanzado'),
  ('Jalón al Pecho', 'Espalda', 'Máquina', 'Principiante'),
  ('Remo Gironda', 'Espalda', 'Cable', 'Principiante'),
  ('Peso Muerto', 'Espalda', 'Barra', 'Avanzado'),
  
  ('Sentadilla Trasera', 'Piernas', 'Barra', 'Avanzado'),
  ('Prensa de Piernas', 'Piernas', 'Máquina', 'Principiante'),
  ('Estocadas (Zancadas)', 'Piernas', 'Mancuernas', 'Intermedio'),
  ('Extensiones de Cuádriceps', 'Piernas', 'Máquina', 'Principiante'),
  ('Curl Femoral', 'Piernas', 'Máquina', 'Principiante'),
  ('Elevación de Talones', 'Piernas', 'Máquina', 'Principiante'),
  
  ('Press Militar (Hombros)', 'Hombros', 'Barra', 'Intermedio'),
  ('Elevaciones Laterales', 'Hombros', 'Mancuernas', 'Principiante'),
  ('Pájaros (Posterior)', 'Hombros', 'Mancuernas', 'Intermedio'),
  
  ('Curl con Barra', 'Bíceps', 'Barra', 'Principiante'),
  ('Curl Martillo', 'Bíceps', 'Mancuernas', 'Principiante'),
  ('Extensiones de Tríceps en Polea', 'Tríceps', 'Cable', 'Principiante'),
  ('Press Francés', 'Tríceps', 'Barra Z', 'Intermedio'),
  
  ('Plancha Abdominal', 'Core', 'Peso Corporal', 'Principiante'),
  ('Crunch Abdominal', 'Core', 'Peso Corporal', 'Principiante'),
  ('Elevación de Piernas', 'Core', 'Peso Corporal', 'Intermedio');
