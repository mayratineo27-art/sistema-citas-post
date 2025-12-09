-- 08_lab_orders.sql
-- New table for Laboratory Orders and Analysis
-- Also ensures 'details' table has data for Prescriptions

-- 1. LAB ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.lab_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'Hemograma', 'Rayos X', 'Ecografía', etc.
  status TEXT CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED')) DEFAULT 'PENDING',
  results JSONB, -- Flexible storage for results (text, numeric values, file URLs)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access Lab Orders" ON public.lab_orders;
CREATE POLICY "Public Access Lab Orders" ON public.lab_orders FOR ALL USING (true) WITH CHECK (true);

-- 3. SEED DATA (For Patient 12345678)
DO $$
DECLARE
  p_id UUID;
  d_id UUID;
  appt_id UUID;
BEGIN
  -- Get Patient
  SELECT id INTO p_id FROM public.patients WHERE dni = '12345678' LIMIT 1;
  
  -- Get a Doctor (General)
  SELECT id INTO d_id FROM public.doctors LIMIT 1;

  IF p_id IS NOT NULL AND d_id IS NOT NULL THEN
    -- A) Insert Lab Orders
    INSERT INTO public.lab_orders (patient_id, doctor_id, type, status, created_at)
    VALUES 
    (p_id, d_id, 'Hemograma Completo', 'COMPLETED', NOW() - INTERVAL '5 days'),
    (p_id, d_id, 'Colesterol y Triglicéridos', 'PENDING', NOW());

    -- B) Ensure an Appointment exists for history
    INSERT INTO public.appointments (patient_id, doctor_id, date_time, status, reason)
    VALUES (p_id, d_id, NOW() - INTERVAL '10 days', 'COMPLETED', 'Chequeo General')
    ON CONFLICT DO NOTHING
    RETURNING id INTO appt_id;
    
    -- If we just created it (or found one), add details (Prescription)
    -- We need ID of an appointment. Let's find one if insert failed (due to conflict or logic)
    IF appt_id IS NULL THEN
        SELECT id INTO appt_id FROM public.appointments WHERE patient_id = p_id AND status = 'COMPLETED' LIMIT 1;
    END IF;

    IF appt_id IS NOT NULL THEN
        INSERT INTO public.details (appointment_id, diagnosis, treatment, notes)
        VALUES (appt_id, 'Faringitis Aguda', 'Amoxicilina 500mg c/8h x 5 dias', 'Beber abundantes líquidos.')
        ON CONFLICT DO NOTHING; -- details usage needs conflict check if ID provided, but here we let UUID gen
    END IF;

  END IF;
END $$;
