
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Env Vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("🌱 Seeding Features...");

    // 1. Check Table
    const { error: checkError } = await supabase.from('lab_orders').select('id').limit(1);

    if (checkError && checkError.code === '42P01') {
        console.error("❌ Table `lab_orders` does NOT exist. RUN SQL 08 MANUALLY.");
        return;
    }

    console.log("✅ Table `lab_orders` exists. Seeding...");

    // Get Patient
    const { data: patient } = await supabase.from('patients').select('id').eq('dni', '12345678').single();
    if (!patient) { console.log("Patient not found"); return; }

    // Get Doctor
    const { data: doctor } = await supabase.from('doctors').select('id').limit(1).single();

    // Insert Lab Orders
    await supabase.from('lab_orders').insert([
        { patient_id: patient.id, doctor_id: doctor.id, type: 'Hemograma Completo', status: 'COMPLETED', results: { pdf: 'url' }, created_at: new Date(Date.now() - 432000000).toISOString() },
        { patient_id: patient.id, doctor_id: doctor.id, type: 'Colesterol y Triglicéridos', status: 'PENDING' }
    ]);

    console.log("✅ Lab Orders Seeded");

    // Insert Prescription
    const { data: appt } = await supabase.from('appointments').insert({
        patient_id: patient.id,
        doctor_id: doctor.id,
        date_time: new Date(Date.now() - 864000000).toISOString(),
        status: 'COMPLETED',
        reason: 'Dolor de garganta'
    }).select('id').single();

    if (appt) {
        await supabase.from('details').insert({
            appointment_id: appt.id,
            diagnosis: 'Faringitis Aguda',
            treatment: 'Ibuprofeno 400mg c/8h x 3 días\nBeber mucha agua.',
            notes: 'Paciente requiere descanso médico x 2 días.'
        });
        console.log("✅ Prescription Seeded");
    }
}

seed();
