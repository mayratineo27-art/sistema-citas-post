-- 07_seed_test_patient.sql
-- Seed a test patient for the "Sacar Cita" prototype flow
-- Matches the hardcoded DNI '12345678' in BookingConfirmation.tsx

INSERT INTO public.patients (first_name, last_name, dni, birth_date, insurance_type, sex, phone, address)
VALUES 
('Paciente', 'Prueba', '12345678', '1990-01-01', 'SIS', 'MALE', '999888777', 'Av. Principal 123')
ON CONFLICT (dni) DO UPDATE 
SET first_name = EXCLUDED.first_name; -- Update to ensure it exists
