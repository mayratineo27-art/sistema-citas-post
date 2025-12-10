
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function seedAllMarias() {
    console.log("🌸 Seeding History for ALL Marias...");

    // 1. Find ALL Marias
    const { data: marias, error } = await supabase.from('patients').select('id, first_name, last_name, dni').ilike('first_name', '%Maria%');

    if (error || !marias || marias.length === 0) {
        console.error("❌ No Marias found OR Error.", error);
        return;
    }

    console.log(`✅ Found ${marias.length} Marias. Processing...`);

    // 2. Find a Doctor
    const { data: doctor } = await supabase.from('doctors').select('id').limit(1).single();

    // 3. Loop through each Maria
    for (const maria of marias) {
        console.log(`   -> Processing: ${maria.first_name} ${maria.last_name} (${maria.dni})`);

        // Create Appointment for EACH
        const { data: appt, error: apptError } = await supabase.from('appointments').insert({
            patient_id: maria.id,
            doctor_id: doctor.id,
            date_time: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            status: 'COMPLETED',
            reason: 'Consulta General'
        }).select('id').single();

        if (appt) {
            // Create Prescription
            await supabase.from('medical_history').insert({
                appointment_id: appt.id,
                diagnosis: 'Resfriado Común',
                treatment: 'Paracetamol 500mg cada 8 horas por 3 días.',
                notes: 'Descanso médico por 24 horas.'
            });
            console.log(`      ✅ Prescription added for ${maria.first_name}`);
        } else {
            console.error(`      ❌ Failed to create appointment for ${maria.first_name}`);
        }
    }
    console.log("🏁 Done seeding all Marias.");
}

seedAllMarias();
