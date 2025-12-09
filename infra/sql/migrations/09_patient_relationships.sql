
-- 9. PATIENT RELATIONSHIPS (For 'Mis Familiares')
-- Add parent_id to link dependents to a main patient

ALTER TABLE public.patients
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.patients(id) ON DELETE SET NULL;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_patients_parent_id ON public.patients(parent_id);

-- Update RLS (Optional for now as we use permissive policy)
-- But ensuring parents can see children would be good. 
-- Existing policy is USING (true) so it's fine for prototype.

-- SEED RELATIONSHIP
-- Link 'Mateo' (87654321) to 'Test Patient' (12345678)
DO $$
DECLARE
    v_parent_id UUID;
    v_child_id UUID;
BEGIN
    SELECT id INTO v_parent_id FROM public.patients WHERE dni = '12345678';
    SELECT id INTO v_child_id FROM public.patients WHERE dni = '87654321';

    IF v_parent_id IS NOT NULL AND v_child_id IS NOT NULL THEN
        UPDATE public.patients SET parent_id = v_parent_id WHERE id = v_child_id;
    END IF;
END $$;
