-- 08_rename_details_to_medical_history.sql

-- 1. Create new table medical_history with same structure
CREATE TABLE IF NOT EXISTS public.medical_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Migrate Data from details to medical_history
INSERT INTO public.medical_history (id, appointment_id, diagnosis, treatment, notes, created_at)
SELECT id, appointment_id, diagnosis, treatment, notes, created_at
FROM public.details;

-- 3. Enable RLS on new table
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies (Same as details)
DROP POLICY IF EXISTS "Public Access Medical History" ON public.medical_history;
CREATE POLICY "Public Access Medical History" ON public.medical_history FOR ALL USING (true) WITH CHECK (true);

-- 5. Drop old table (Optionally, we could keep it, but user wants compliance)
-- We will keep 'details' for now but emptied or just ignore it, 
-- but to ensure "frontend shows it", we should swap usage. 
-- Let's DROP it to force errors if we missed something, OR rename it to backup.
ALTER TABLE public.details RENAME TO details_backup;
