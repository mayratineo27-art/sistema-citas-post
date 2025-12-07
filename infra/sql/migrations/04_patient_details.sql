-- 04_patient_details.sql
-- Add missing columns to patients table to support the Appointment Booking UI

ALTER TABLE public.patients
ADD COLUMN IF NOT EXISTS sex TEXT CHECK (sex IN ('MALE', 'FEMALE', 'OTHER')),
ADD COLUMN IF NOT EXISTS insurance_type TEXT DEFAULT 'SIS'; -- e.g., 'SIS', 'ESSALUD', 'PRIVATE', 'NONE'

COMMENT ON COLUMN public.patients.insurance_type IS 'Type of health insurance (Seguro)';
