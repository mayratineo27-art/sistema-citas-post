
-- Insert Child Patient
INSERT INTO public.patients (first_name, last_name, dni, birth_date, phone, address, history_number, sex, insurance_type)
VALUES ('Mateo', 'Travieso (Hijo)', '87654321', '2020-05-15', '999999999', 'Av. Siempre Viva 123', 'H-9999', 'MALE', 'SIS')
ON CONFLICT (dni) DO NOTHING;

-- Insert History for Child
WITH child AS (SELECT id FROM public.patients WHERE dni = '87654321' LIMIT 1),
     doc AS (SELECT id FROM public.doctors LIMIT 1)
INSERT INTO public.appointments (patient_id, doctor_id, date_time, status, reason)
SELECT child.id, doc.id, NOW() - INTERVAL '30 days', 'COMPLETED', 'Control de Crecimiento'
FROM child, doc;

-- Insert Lab Order for Child
WITH child AS (SELECT id FROM public.patients WHERE dni = '87654321' LIMIT 1),
     doc AS (SELECT id FROM public.doctors LIMIT 1)
INSERT INTO public.lab_orders (patient_id, doctor_id, type, status)
SELECT child.id, doc.id, 'Tamizaje de Hemoglobina', 'PENDING'
FROM child, doc;
