
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixMariaHistory() {
    console.log("💊 Fixing Prescriptions for ALL 'Maria' patients...");

    // 1. Get all Marias
    const { data: marias, error: pError } = await supabase
        .from('patients')
        .select('id, first_name, last_name')
        .ilike('first_name', 'Mar%');

    if (pError || !marias) {
        console.error("❌ Error finding Marias:", pError);
        return;
    }

    console.log(`Found ${marias.length} Marias. Processing...`);

    // 2. Ensure Doctor exists for prescription
    let { data: doc } = await supabase.from('doctors').select('id').limit(1).single();
    if (!doc) {
        console.log("Creating dummy doctor...");
        const { data: newDoc } = await supabase.from('doctors').insert({ firstName: 'Juan', lastName: 'Perez', cmp: '99999', specialty_id: 1, is_active: true }).select().single();
        doc = newDoc;
    }

    for (const m of marias) {
        console.log(`👉 Processing: ${m.first_name} ${m.last_name} (${m.id})`);

        // Check if has completed appointment?
        const { data: existingAppts } = await supabase
            .from('appointments')
            .select('id')
            .eq('patient_id', m.id)
            .eq('status', 'COMPLETED')
            .limit(1);

        let apptId;

        if (existingAppts && existingAppts.length > 0) {
            apptId = existingAppts[0].id;
            console.log(`   Found existing COMPLETED appointment: ${apptId}`);
        } else {
            // Create one in the past
            console.log(`   Creating new COMPLETED appointment...`);
            const { data: newAppt, error: apptError } = await supabase
                .from('appointments')
                .insert({
                    patient_id: m.id,
                    doctor_id: doc.id,
                    date_time: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                    status: 'COMPLETED',
                    reason: 'Chequeo General (Auto-Seed)'
                })
                .select()
                .single();

            if (apptError) {
                console.error(`   ❌ Failed to create appointment: ${apptError.message}`);
                continue;
            }
            apptId = newAppt.id;
        }

        // Check History
        const { data: existingHist } = await supabase
            .from('medical_history')
            .select('id')
            .eq('appointment_id', apptId);

        if (existingHist && existingHist.length > 0) {
            console.log(`   ✅ History already exists.`);
        } else {
            // Insert History
            const { error: histError } = await supabase
                .from('medical_history')
                .insert({
                    appointment_id: apptId,
                    diagnosis: 'Faringitis Aguda',
                    treatment: 'Amoxicilina 500mg c/8h x 7 días\nParacetamol 500mg c/8h si hay fiebre.',
                    notes: 'Paciente refiere dolor de garganta y fiebre desde ayer.'
                });

            if (histError) console.error(`   ❌ Failed to insert history: ${histError.message}`);
            else console.log(`   ✅ Prescription inserted successfully!`);
        }
    }
}

fixMariaHistory();
