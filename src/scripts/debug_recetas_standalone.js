
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function debug() {
    console.log("Initializing Supabase...");
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("Missing Env Vars");
        // Fallback for debug if env fails (using known values from previous context if available, else fail)
        // Hardcoding standard dev key not recommended but user is in blocked state. 
        // I will rely on dotenv.
        return;
    }

    const supabase = createClient(url, key);

    console.log("Querying medical_history...");

    // Test the JOIN query used in Recetas.tsx
    // medical_history ( diagnosis, treatment ), appointments!inner ( ... )

    // Note: The Recetas query is:
    // .select(` id, ..., appointments!inner ( ... ) `)
    // .eq('appointments.patient_id', ID)

    const targetDni = '12345678';
    const { data: pData } = await supabase.from('patients').select('id').eq('dni', targetDni).single();

    if (pData) {
        console.log("Patient ID:", pData.id);

        const { data, error } = await supabase
            .from('medical_history')
            .select(`
                id, diagnosis, treatment,
                appointments!inner (
                    id, date_time, patient_id,
                    doctors ( firstname, lastname )
                )
            `)
            .eq('appointments.patient_id', pData.id);

        if (error) {
            console.error("Query Error:", error);
            if (error.code === 'PGRST200') {
                console.log("Hint: Relationship not found. Try explicit FK or removing !inner");
            }
        } else {
            console.log("Records found:", data?.length);
            console.log(JSON.stringify(data, null, 2));
        }
    } else {
        console.error("Patient not found");
    }
}

debug();
