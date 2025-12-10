import { supabaseClient } from '../infrastructure/db/client';

async function verifyRecetasQuery() {
    console.log("--- Starting Recetas Query Debug ---");

    // 1. Get Patient (Active DNI from seed or default)
    const targetDni = '12345678'; // Default user
    console.log(`Step 1: Fetching patient with DNI: ${targetDni}`);

    const { data: patient, error: pError } = await supabaseClient
        .from('patients')
        .select('*')
        .eq('dni', targetDni)
        .single();

    if (pError || !patient) {
        console.error("❌ Error fetching patient:", pError);
        return;
    }
    console.log(`✅ Patient Found: ${patient.first_name} ${patient.last_name} (ID: ${patient.id})`);

    // 2. Test Direct Query to medical_history (No Join)
    console.log("\nStep 2: Testing SIMPLE select on medical_history");
    const { data: simpleData, error: simpleError } = await supabaseClient
        .from('medical_history')
        .select('*')
        .limit(5);

    if (simpleError) {
        console.error("❌ Error on simple query:", simpleError);
        console.log("   -> Is the table 'medical_history' textually correct? Did migration 08 run?");
    } else {
        console.log(`✅ Simple Query OK. Found ${simpleData.length} records.`);
        console.log("   Sample:", simpleData.slice(0, 1));
    }

    // 3. Test The Frontend Query (With JOIN)
    console.log("\nStep 3: Testing COMPLEX Frontend Query (with appointments!inner)");

    // Note: The frontend uses appointments!inner. 
    // We need to verify if Supabase can infer this relationship from 'medical_history.appointment_id' ref 'appointments.id'
    const { data: joinData, error: joinError } = await supabaseClient
        .from('medical_history')
        .select(`
            id, treatment, diagnosis, notes, created_at,
            appointments!inner (
                id, date_time, patient_id,
                doctors ( firstname, lastname )
            )
        `)
        .eq('appointments.patient_id', patient.id);

    if (joinError) {
        console.error("❌ Error on JOIN query:", joinError);
        console.log("   -> CAUSE: Likely missing relationship name or FK issue.");
        console.log("   -> Try removing '!inner' or checking PostgREST resource embedding.");
    } else {
        console.log(`✅ JOIN Query OK. Found ${joinData.length} records for this patient.`);
        console.log("   Sample:", JSON.stringify(joinData.slice(0, 1), null, 2));
    }
}

verifyRecetasQuery();
