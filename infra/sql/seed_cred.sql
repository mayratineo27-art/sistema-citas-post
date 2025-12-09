
-- Insert CRED specialty
INSERT INTO public.specialties (name)
VALUES ('CRED (Crecimiento y Desarrollo)')
ON CONFLICT (name) DO NOTHING;

-- Insert a Doctor for CRED so booking works
WITH spec AS (SELECT id FROM public.specialties WHERE name = 'CRED (Crecimiento y Desarrollo)' LIMIT 1)
INSERT INTO public.doctors (firstName, lastName, cmp, specialty_id)
SELECT 'Lucia', 'Fernandez (CRED)', '50005', id FROM spec
ON CONFLICT (cmp) DO NOTHING;
