
-- Insert Maria Perez (5 years old)
INSERT INTO public.patients (first_name, last_name, dni, birth_date, phone, address, history_number, sex, insurance_type)
VALUES ('Maria', 'Perez (Hija)', 'CHILD001', '2019-05-15', '999999999', 'Av. Siempre Viva 123', 'H-CHILD1', 'FEMALE', 'SIS')
ON CONFLICT (dni) DO NOTHING;

-- Insert Jose Perez (8 years old)
INSERT INTO public.patients (first_name, last_name, dni, birth_date, phone, address, history_number, sex, insurance_type)
VALUES ('Jose', 'Perez (Hijo)', 'CHILD002', '2016-08-20', '999999999', 'Av. Siempre Viva 123', 'H-CHILD2', 'MALE', 'SIS')
ON CONFLICT (dni) DO NOTHING;

-- Link them to Parent (Test Patient 12345678)
DO $$
DECLARE
    v_parent_id UUID;
    v_maria_id UUID;
    v_jose_id UUID;
BEGIN
    SELECT id INTO v_parent_id FROM public.patients WHERE dni = '12345678';
    
    SELECT id INTO v_maria_id FROM public.patients WHERE dni = 'CHILD001';
    SELECT id INTO v_jose_id FROM public.patients WHERE dni = 'CHILD002';

    IF v_parent_id IS NOT NULL THEN
        UPDATE public.patients SET parent_id = v_parent_id WHERE id IN (v_maria_id, v_jose_id);
    END IF;
END $$;
