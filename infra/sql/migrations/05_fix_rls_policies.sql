-- 05_fix_rls_policies.sql
-- Run this in your Supabase SQL Editor to ensure the App can Read/Write data

-- 1. Enable RLS on tables (Best practice, though we will open them up for prototype)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

-- 2. Create "Allow All" policies for Anonymous access (Prototype Mode)
-- NOTE: In production, you would restrict this to authenticated users only.

-- Patients
CREATE POLICY "Public Access Patients" ON public.patients
FOR ALL USING (true) WITH CHECK (true);

-- Doctors
CREATE POLICY "Public Access Doctors" ON public.doctors
FOR ALL USING (true) WITH CHECK (true);

-- Appointments
CREATE POLICY "Public Access Appointments" ON public.appointments
FOR ALL USING (true) WITH CHECK (true);

-- Specialties
CREATE POLICY "Public Access Specialties" ON public.specialties
FOR ALL USING (true) WITH CHECK (true);

-- 3. Verify Doctor Data exists (Optional Seed)
INSERT INTO public.specialties (name) VALUES 
('Medicina General'), ('Obstetricia'), ('Psicología'), ('Dental')
ON CONFLICT (name) DO NOTHING;

-- Insert a dummy doctor if none exists, so appointments can be linked
INSERT INTO public.doctors (firstName, lastName, cmp, specialty_id, is_active)
SELECT 'Juan', 'Medico', '99999', id, true
FROM public.specialties WHERE name = 'Medicina General'
LIMIT 1
ON CONFLICT (cmp) DO NOTHING;
