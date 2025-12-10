
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function forceSeed() {
    console.log("🔥 Force Seeding History for DNI 87654321...");

    // 1. Get Patient ID by DNI
    const { data: patient } = await supabase.from('patients').select('id, first_name').eq('dni', '87654321').single();

    if (!patient) {
        console.error("❌ Patient with DNI 87654321 not found!");
        return;
    }
    console.log(`✅ Found Patient: ${patient.first_name} (${patient.id})`);

    // 2. Get Doctor
    const { data: doctor } = await supabase.from('doctors').select('id').limit(1).single();

    // 3. Create Appointment (TIMESTAMP IS KEY - MAKE IT PAST)
    const { data: appt } = await supabase.from('appointments').insert({
        patient_id: patient.id,
        doctor_id: doctor.id,
        date_time: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        status: 'COMPLETED',
        reason: 'Chequeo General'
    }).select('id').single();

    // 4. Create Medical History
    await supabase.from('medical_history').insert({
        appointment_id: appt.id,
        diagnosis: 'Control Sano',
        treatment: 'Vitamina C 1 ampolla mensual.',
        notes: 'Todo en orden.'
    });

    console.log("✅ History Inserted for 87654321");
}

forceSeed();
