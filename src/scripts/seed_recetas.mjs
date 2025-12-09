
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase URL or Key");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedRecetas() {
    console.log('💊 Seeding Prescriptions...');

    // 1. Get or Create Patient (12345678)
    const { data: patient } = await supabase.from('patients').select('id').eq('dni', '12345678').single();
    if (!patient) {
        console.error("❌ Patient 12345678 not found. Please run base seeds first.");
        return;
    }
    console.log('✅ Patient found:', patient.id);

    // 2. Get Doctor
    const { data: doctor } = await supabase.from('doctors').select('id').limit(1).single();
    if (!doctor) {
        console.error("❌ No doctor found.");
        return;
    }
    console.log('✅ Doctor found:', doctor.id);

    // 3. Create Past Appointment
    const { data: appointment, error: appError } = await supabase.from('appointments').insert({
        patient_id: patient.id,
        doctor_id: doctor.id,
        date_time: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        status: 'COMPLETED', // Uppercase to match check constraint
        reason: 'Dolor de cabeza y fiebre'
    }).select().single();

    if (appError) {
        console.error("❌ Error creating appointment:", appError);
        return;
    }
    console.log('✅ Appointment created:', appointment.id);

    // 4. Create Prescription (Detail)
    const treatmentText = `1. Paracetamol 500mg
   - Tomar 1 tableta cada 8 horas por 3 días.
   - Si persiste la fiebre, acudir por urgencias.

2. Ibuprofeno 400mg
   - Tomar 1 tableta cada 8 horas si hay dolor (máximo 3 días).

3. Reposo absoluto por 24 horas.
4. Hidratación abundante (2-3 litros de agua al día).
`;

    const { error: detailError } = await supabase.from('details').insert({
        appointment_id: appointment.id,
        diagnosis: 'Infección Respiratoria Aguda (J06.9)',
        treatment: treatmentText,
        notes: 'Paciente presenta buen estado general, signos vitales estables.'
    });

    if (detailError) {
        console.error("❌ Error creating prescription detail:", detailError);
    } else {
        console.log('✅ Prescription created successfully!');
    }
}

seedRecetas();
