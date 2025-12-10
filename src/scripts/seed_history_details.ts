
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedHistory() {
    console.log("🌱 Seeding Medical History...");

    // 1. Get Patient (default DNI)
    const DNI = '12345678';
    const { data: patient, error: pError } = await supabase
        .from('patients')
        .select('id')
        .eq('dni', DNI)
        .single();

    if (pError || !patient) {
        console.error("Patient not found", pError);
        return;
    }

    console.log(`Found Patient ID: ${patient.id}`);

    // 2. Get a Doctor (General Medicine)
    const { data: doctor, error: dError } = await supabase
        .from('doctors')
        .select('id')
        .limit(1)
        .single();

    if (dError || !doctor) {
        console.error("Doctor not found", dError);
        return;
    }

    // 3. Create Past Appointment (COMPLETED)
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5); // 5 days ago

    const { data: appt, error: aError } = await supabase
        .from('appointments')
        .insert({
            patient_id: patient.id,
            doctor_id: doctor.id,
            date_time: pastDate.toISOString(),
            status: 'COMPLETED',
            reason: 'Dolor de cabeza persistente'
        })
        .select()
        .single();

    if (aError) {
        console.error("Error creating appointment", aError);
        return;
    }

    console.log(`Created Past Appointment: ${appt.id}`);

    // 4. Create Medical Details
    const { error: detError } = await supabase
        .from('details')
        .insert({
            appointment_id: appt.id,
            diagnosis: 'Cefalea Tensional Leve',
            treatment: '1. Paracetamol 500mg cada 8 horas por 3 días.\n2. Descanso médico por 24 horas.\n3. Evitar uso excesivo de pantallas.',
            notes: 'Paciente refiere estrés laboral.'
        });

    if (detError) {
        console.error("Error creating details", detError);
    } else {
        console.log("✅ Medical Details inserted successfully!");
    }
}

seedHistory();
