-- 06_master_appointment_migration.sql
-- Consolidated migration for Appointment System (Idempotent)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PATIENTS TABLE (snake_case convention verified in Repo)
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dni TEXT UNIQUE NOT NULL,
  birth_date DATE NOT NULL,
  phone TEXT,
  address TEXT,
  history_number TEXT UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns needed for Booking Flow (BookingConfirmation.tsx)
ALTER TABLE public.patients
ADD COLUMN IF NOT EXISTS sex TEXT CHECK (sex IN ('MALE', 'FEMALE', 'OTHER')),
ADD COLUMN IF NOT EXISTS insurance_type TEXT DEFAULT 'SIS';

-- 3. SPECIALTIES TABLE
CREATE TABLE IF NOT EXISTS public.specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DOCTORS TABLE
-- Note: We use unquoted names to match the existing schema (firstname/lastname)
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  firstName TEXT NOT NULL, 
  lastName TEXT NOT NULL,
  cmp TEXT UNIQUE NOT NULL,
  specialty_id UUID REFERENCES public.specialties(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  date_time TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')) DEFAULT 'PENDING',
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DETAILS TABLE (For Recetas/Historial expansion)
CREATE TABLE IF NOT EXISTS public.details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS SECURITY POLICIES (Open for Prototype)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts if they exist
DROP POLICY IF EXISTS "Public Access Patients" ON public.patients;
DROP POLICY IF EXISTS "Public Access Doctors" ON public.doctors;
DROP POLICY IF EXISTS "Public Access Appointments" ON public.appointments;
DROP POLICY IF EXISTS "Public Access Specialties" ON public.specialties;
DROP POLICY IF EXISTS "Public Access Details" ON public.details;

-- Create Permissive Policies
CREATE POLICY "Public Access Patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Doctors" ON public.doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Specialties" ON public.specialties FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access Details" ON public.details FOR ALL USING (true) WITH CHECK (true);

-- 8. DATA SEEDING (Idempotent)

-- Specialties
INSERT INTO public.specialties (name) VALUES 
('Medicina General'), ('Obstetricia'), ('Psicología'), ('Dental'), ('Tópico'), ('Emergencia')
ON CONFLICT (name) DO NOTHING;

-- Doctors
-- We map specialties to IDs to insert doctors
WITH spec AS (SELECT id, name FROM public.specialties)
INSERT INTO public.doctors (firstName, lastName, cmp, specialty_id)
SELECT 'Juan', 'Perez (General)', '10001', id FROM spec WHERE name = 'Medicina General'
UNION ALL
SELECT 'Ana', 'Gomez (Obs)', '20002', id FROM spec WHERE name = 'Obstetricia'
UNION ALL
SELECT 'Carlos', 'Ruiz (Psic)', '30003', id FROM spec WHERE name = 'Psicología'
UNION ALL
SELECT 'Maria', 'Diaz (Dent)', '40004', id FROM spec WHERE name = 'Dental'
ON CONFLICT (cmp) DO NOTHING;
