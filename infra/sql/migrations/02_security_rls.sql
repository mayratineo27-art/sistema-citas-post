-- 02_security_rls.sql

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apoderados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.details ENABLE ROW LEVEL SECURITY;

-- POLICIES (Simplified for demonstration)

-- 1. USERS: Read own profile
CREATE POLICY "Users can read own data" ON public.users
FOR SELECT USING (auth.uid() = id);

-- 2. PATIENTS: Doctors/Nurses/Admin can read all.
-- Note: In a real app, strict role checks are needed.
-- Here we allow authenticated users for simplicity of testing the flow.
CREATE POLICY "Authenticated users can read patients" ON public.patients
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can update patients" ON public.patients
FOR UPDATE USING (auth.role() = 'authenticated'); -- Needs specific role check function

-- 3. DOCTORS: Publicly readable (to book appointments)
CREATE POLICY "Public can read doctors" ON public.doctors
FOR SELECT USING (true);

-- 4. APPOINTMENTS:
-- Patients can read their own
CREATE POLICY "Patients read own appointments" ON public.appointments
FOR SELECT USING (auth.uid() = patient_id);

-- Doctors see their schedule
CREATE POLICY "Doctors read managed appointments" ON public.appointments
FOR SELECT USING (auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id));

-- STAFF see all (Admin override for simplicity)
CREATE POLICY "Staff see all appointments" ON public.appointments
FOR ALL USING (auth.role() = 'service_role');
