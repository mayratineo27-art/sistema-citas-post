-- 01_base_seeds.sql

-- 1. USERS
INSERT INTO public.users (id, email, role, first_name, last_name) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@example.com', 'admin', 'Super', 'Admin'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'doctor1@example.com', 'doctor', 'Juan', 'Perez'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'patient1@example.com', 'patient', 'Maria', 'Gomez')
ON CONFLICT (email) DO NOTHING;

-- 2. SPECIALTIES
INSERT INTO public.specialties (name, description) VALUES
('Medicina General', 'Atención primaria'),
('Pediatría', 'Atención a niños'),
('Ginecología', 'Salud de la mujer'),
('Odontología', 'Salud dental')
ON CONFLICT (name) DO NOTHING;

-- 3. DOCTORS (Link to users)
-- Assuming UUIDs are known or fetched. For seeding, it's easier to use hardcoded UUIDs or subqueries.
INSERT INTO public.doctors (user_id, firstName, lastName, cmp, specialty_id)
SELECT id, first_name, last_name, 'CMP-001', (SELECT id FROM public.specialties WHERE name = 'Medicina General')
FROM public.users WHERE email = 'doctor1@example.com'
ON CONFLICT (cmp) DO NOTHING;

-- 4. PRODUCTS (50 examples)
INSERT INTO public.products (name, code, stock, price)
SELECT 
  'Producto ' || generate_series(1, 50),
  'PROD-' || generate_series(1, 50),
  floor(random() * 100)::int,
  (random() * 100)::decimal(10,2)
ON CONFLICT (code) DO NOTHING;

-- 5. PATIENTS
INSERT INTO public.patients (first_name, last_name, dni, birth_date, phone, user_id)
VALUES
('Maria', 'Gomez', '87654321', '1990-05-15', '999888777', (SELECT id FROM public.users WHERE email = 'patient1@example.com'))
ON CONFLICT (dni) DO NOTHING;
