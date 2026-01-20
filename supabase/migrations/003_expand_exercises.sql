-- Add image_url to exercises
alter table public.exercises add column if not exists image_url text;

-- Clear existing data to re-seed with full list
truncate table public.exercises;

-- Bulk Insert 50+ Exercises
insert into public.exercises (name, muscle_group, equipment, difficulty, image_url) values
  -- PECHO
  ('Press de Banca Plano (Barra)', 'Pecho', 'Barra', 'Intermedio', null),
  ('Press de Banca Inclinado (Mancuernas)', 'Pecho', 'Mancuernas', 'Intermedio', null),
  ('Press Declinado', 'Pecho', 'Barra', 'Intermedio', null),
  ('Aperturas (Flyes) con Cable', 'Pecho', 'Cable', 'Principiante', null),
  ('Pec Deck (Mariposa)', 'Pecho', 'Máquina', 'Principiante', null),
  ('Fondos en Paralelas (Dips)', 'Pecho', 'Peso Corporal', 'Avanzado', null),
  ('Flexiones de Brazos (Push-ups)', 'Pecho', 'Peso Corporal', 'Principiante', null),
  ('Pullover con Mancuerna', 'Pecho', 'Mancuernas', 'Intermedio', null),
  ('Press de Banca Inclinado (Máquina)', 'Pecho', 'Máquina', 'Principiante', null),
  
  -- ESPALDA
  ('Dominadas (Pull-ups)', 'Espalda', 'Peso Corporal', 'Intermedio', null),
  ('Chin-ups (Agarre supino)', 'Espalda', 'Peso Corporal', 'Intermedio', null),
  ('Remo con Barra (Bent-over Row)', 'Espalda', 'Barra', 'Avanzado', null),
  ('Remo con Mancuerna a una mano', 'Espalda', 'Mancuernas', 'Principiante', null),
  ('Jalón al Pecho (Lat Pulldown)', 'Espalda', 'Máquina', 'Principiante', null),
  ('Remo Gironda (Sentado)', 'Espalda', 'Cable', 'Principiante', null),
  ('Peso Muerto Convencional', 'Espalda', 'Barra', 'Avanzado', null),
  ('Peso Muerto Rumano', 'Espalda', 'Barra', 'Intermedio', null),
  ('Hiperextensiones', 'Espalda', 'Banco', 'Principiante', null),
  
  -- PIERNAS - CUADRICEPS
  ('Sentadilla Trasera (Squat)', 'Piernas', 'Barra', 'Avanzado', null),
  ('Sentadilla Frontal', 'Piernas', 'Barra', 'Avanzado', null),
  ('Sentadilla Goblet', 'Piernas', 'Mancuernas', 'Principiante', null),
  ('Prensa de Piernas Inclinada', 'Piernas', 'Máquina', 'Principiante', null),
  ('Hack Squat', 'Piernas', 'Máquina', 'Intermedio', null),
  ('Estocadas (Lunges)', 'Piernas', 'Mancuernas', 'Intermedio', null),
  ('Sentadilla Búlgara', 'Piernas', 'Mancuernas', 'Avanzado', null),
  ('Extensiones de Cuádriceps', 'Piernas', 'Máquina', 'Principiante', null),
  
  -- PIERNAS - ISQUIOS/GLUTEO
  ('Curl Femoral Tumbado', 'Piernas', 'Máquina', 'Principiante', null),
  ('Curl Femoral Sentado', 'Piernas', 'Máquina', 'Principiante', null),
  ('Hip Thrust (Empuje de Cadera)', 'Piernas', 'Barra', 'Intermedio', null),
  ('Patada de Glúteo en Polea', 'Piernas', 'Cable', 'Principiante', null),
  ('Elevación de Talones (Gemelos) de Pie', 'Piernas', 'Máquina', 'Principiante', null),
  ('Elevación de Talones Sentado', 'Piernas', 'Máquina', 'Principiante', null),

  -- HOMBROS
  ('Press Militar (Overhead Press)', 'Hombros', 'Barra', 'Intermedio', null),
  ('Press de Hombros con Mancuernas', 'Hombros', 'Mancuernas', 'Principiante', null),
  ('Elevaciones Laterales', 'Hombros', 'Mancuernas', 'Principiante', null),
  ('Elevaciones Frontales', 'Hombros', 'Mancuernas', 'Principiante', null),
  ('Pájaros (Vuelos Posteriores)', 'Hombros', 'Mancuernas', 'Intermedio', null),
  ('Face Pull', 'Hombros', 'Cable', 'Principiante', null),
  ('Remo al Mentón', 'Hombros', 'Barra', 'Intermedio', null),

  -- BICEPS
  ('Curl con Barra (Bíceps)', 'Bíceps', 'Barra', 'Principiante', null),
  ('Curl con Barra Z', 'Bíceps', 'Barra Z', 'Principiante', null),
  ('Curl Martillo', 'Bíceps', 'Mancuernas', 'Principiante', null),
  ('Curl Inclinado', 'Bíceps', 'Mancuernas', 'Intermedio', null),
  ('Curl Predicador (Banco Scott)', 'Bíceps', 'Barra Z', 'Principiante', null),
  ('Curl Concentrado', 'Bíceps', 'Mancuernas', 'Principiante', null),

  -- TRICEPS
  ('Extensiones de Tríceps en Polea', 'Tríceps', 'Cable', 'Principiante', null),
  ('Press Francés (Skullcrushers)', 'Tríceps', 'Barra Z', 'Intermedio', null),
  ('Extensiones Trasnuca con Mancuerna', 'Tríceps', 'Mancuernas', 'Principiante', null),
  ('Fondos entre Bancos', 'Tríceps', 'Peso Corporal', 'Principiante', null),
  ('Patada de Tríceps', 'Tríceps', 'Mancuernas', 'Principiante', null),

  -- CORE
  ('Plancha Abdominal (Plank)', 'Core', 'Peso Corporal', 'Principiante', null),
  ('Crunch Abdominal', 'Core', 'Peso Corporal', 'Principiante', null),
  ('Elevación de Piernas Colgado', 'Core', 'Peso Corporal', 'Intermedio', null),
  ('Rueda Abdominal', 'Core', 'Accesorio', 'Avanzado', null),
  ('Russian Twist', 'Core', 'Mancuernas', 'Principiante', null);
