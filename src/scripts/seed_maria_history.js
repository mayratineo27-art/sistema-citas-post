
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) { console.error("Missing Env"); process.exit(1); }

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMaria() {
    console.log("🌸 Seeding History for Maria...");

    // 1. Find Maria
    const { data: marias } = await supabase.from('patients').select('id, first_name').ilike('first_name', '%Maria%');

    if (!marias || marias.length === 0) {
        console.error("❌ Maria not found to seed.");
        return;
    }

    const maria = marias[0];
    console.log(`✅ Found Maria ID: ${maria.id}`);

    // 2. Find a Doctor
    const { data: doctor } = await supabase.from('doctors').select('id').limit(1).single();

    // 3. Create Appointment (Past date)
    const { data: appt, error: apptError } = await supabase.from('appointments').insert({
        patient_id: maria.id,
        doctor_id: doctor.id,
        date_time: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
        status: 'COMPLETED',
        reason: 'Dolor de garganta'
    }).select('id').single();

    if (apptError) {
        console.error("Error creating appointment", apptError);
        return;
    }

    // 4. Create Medical History (Prescription)
    // IMPORTANT: Using 'medical_history' table as per new schema
    const { error: histError } = await supabase.from('medical_history').insert({
        appointment_id: appt.id,
        diagnosis: 'Faringitis Aguda',
        treatment: 'Amoxicilina 500mg c/8h x 7 días.\nParacetamol 500mg si hay fiebre.',
        notes: 'Beber abundantes líquidos.'
    });

    if (histError) console.error("Error creating history", histError);
    else console.log("✅ Prescription created for Maria!");
}

seedMaria();
