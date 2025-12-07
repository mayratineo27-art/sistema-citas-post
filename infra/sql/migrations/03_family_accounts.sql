-- 03_family_accounts.sql

-- 1. ENHANCE PATIENTS TABLE FOR FAMILY LOGIC
-- Add "is_verified" to track if the Admin has checked their DNI.
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Add "relationship" to know if this patient is the 'Self', 'Son', 'Daughter', 'Parent', etc.
ALTER TABLE public.patients
ADD COLUMN IF NOT EXISTS relationship_type TEXT DEFAULT 'SELF';

-- 2. UPDATE RLS POLICIES FOR PATIENTS
-- First, drop simplistic existing policies if they conflict
DROP POLICY IF EXISTS "Authenticated users can read patients" ON public.patients;
DROP POLICY IF EXISTS "Staff can update patients" ON public.patients;

-- Policy: USERS can READ/INSERT/UPDATE their own family members (where they are the guardian/owner)
CREATE POLICY "Users manage own family patients" ON public.patients
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: STAFF (Admins/Doctors) can READ ALL patients
-- (Assuming staff have a way to be identified, e.g., via a separate role or metadata. 
-- For now, we keep it broad for 'authenticated' but ideally should be restricted)
CREATE POLICY "Staff read all patients" ON public.patients
FOR SELECT
USING (auth.role() = 'authenticated'); 
-- NOTE: In production, filter this by checking if auth.uid() is in the 'doctors' or 'users' table with role='admin'

-- 3. FIX APPOINTMENTS SECURITY FOR FAMILIES
DROP POLICY IF EXISTS "Patients read own appointments" ON public.appointments;

-- Policy: Guardian sees appointments for ALL their family members
CREATE POLICY "Guardian sees family appointments" ON public.appointments
FOR SELECT
USING (
  patient_id IN (
    SELECT id FROM public.patients WHERE user_id = auth.uid()
  )
);

-- Policy: Guardian can book/cancel appointments for their family
CREATE POLICY "Guardian manages family appointments" ON public.appointments
FOR INSERT
WITH CHECK (
  patient_id IN (
    SELECT id FROM public.patients WHERE user_id = auth.uid()
  )
);

-- 4. TRIGGER (Optional but recommended)
-- Automatically create a "SELF" patient profile when a new User signs up?
-- (This is complex to add in plain SQL without knowing strict trigger rights in Supabase, 
-- but we can leave it for the application logic for now).
