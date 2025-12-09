
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) process.exit(1);

// Using ANON key to simulate Frontend
const supabase = createClient(supabaseUrl, supabaseKey);

async function simulate() {
    console.log("🔵 Simulating Booking...");

    // 1. Get Patient
    const { data: patient } = await supabase.from('patients').select('id').eq('dni', '12345678').single();
    if (!patient) { console.error("❌ Patient Missing"); return; }
    console.log("✅ Patient:", patient.id);

    // 2. Get Specialty
    const { data: spec } = await supabase.from('specialties').select('id').ilike('name', '%Medicina General%').single();
    if (!spec) { console.error("❌ Specialty Missing"); return; }
    console.log("✅ Specialty:", spec.id);

    // 3. Get Doctor
    const { data: doctor } = await supabase.from('doctors').select('id').eq('specialty_id', spec.id).limit(1).single();
    if (!doctor) { console.error("❌ Doctor Missing"); return; }
    console.log("✅ Doctor:", doctor.id);

    // 4. Insert Appointment
    const { error } = await supabase.from('appointments').insert({
        patient_id: patient.id,
        doctor_id: doctor.id,
        date_time: new Date().toISOString(),
        status: 'PENDING',
        reason: 'Simulation Script'
    });

    if (error) {
        console.error("❌ Insert Error:", error);
    } else {
        console.log("✅ SUCCESS: Appointment Inserted!");
    }
}

simulate();
