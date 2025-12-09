
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAnalisis() {
    console.log("🧪 Seeding Lab Orders...");

    // 1. Get Patient
    const patientDni = '12345678';
    const { data: patient, error: pError } = await supabase.from('patients').select('id').eq('dni', patientDni).single();

    if (pError || !patient) {
        console.error("❌ Patient not found:", pError);
        return;
    }
    console.log(`✅ Patient found: ${patient.id}`);

    // 2. Get Doctor
    const { data: doctor } = await supabase.from('doctors').select('id').limit(1).single();

    if (!doctor) {
        console.error("❌ No doctor found");
        return;
    }

    // 3. Create PENDING Order (Unlocks the booking UI)
    const { error: oError1 } = await supabase
        .from('lab_orders')
        .insert({
            patient_id: patient.id,
            doctor_id: doctor.id,
            type: 'Hemograma Completo + Perfil Bioquímico',
            status: 'PENDING',
            created_at: new Date().toISOString()
        });

    if (oError1) console.error("Error creating pending order:", oError1);
    else console.log("✅ Created PENDING order (Hemograma)");

    // 4. Create COMPLETED Order (Shows history)
    const { error: oError2 } = await supabase
        .from('lab_orders')
        .insert({
            patient_id: patient.id,
            doctor_id: doctor.id,
            type: 'Rayos X - Tórax AP/LAT',
            status: 'COMPLETED',
            created_at: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
            results: { note: "Sin hallazgos patológicos significativos." }
        });

    if (oError2) console.error("Error creating completed order:", oError2);
    else console.log("✅ Created COMPLETED order (Rayos X)");

    console.log("🏁 Analisis Seeding Done!");
}

seedAnalisis();
