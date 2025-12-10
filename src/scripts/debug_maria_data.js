
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function debugMariaData() {
    console.log("🔍 Checking DB for 'Maria'...");

    const { data: patients, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name, dni')
        .ilike('first_name', '%Maria%');

    if (error) {
        console.error("Error fetching patients:", error);
        return;
    }

    console.log(`Found ${patients.length} Marias.`);

    for (const p of patients) {
        // Count Appointments
        const { count: apptCount } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('patient_id', p.id);

        // Check for Medical History (via appointments)
        // medical_history links to appointment_id.
        // We need appointments IDs first.
        const { data: appts } = await supabase.from('appointments').select('id').eq('patient_id', p.id);
        const apptIds = appts.map(a => a.id);

        let historyCount = 0;
        if (apptIds.length > 0) {
            const { count } = await supabase
                .from('medical_history')
                .select('*', { count: 'exact', head: true })
                .in('appointment_id', apptIds);
            historyCount = count || 0;
        }

        console.log(`👤 ${p.first_name} ${p.last_name} (DNI: ${p.dni}) | ID: ${p.id}`);
        console.log(`   📅 Appointments: ${apptCount} | 💊 Rx/History: ${historyCount}`);
        if (historyCount === 0) console.log("   ⚠️ NO PRESCRIPTIONS!");
        else console.log("   ✅ Has Prescriptions.");
        console.log("---");
    }
}

debugMariaData();
