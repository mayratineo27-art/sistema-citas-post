
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedRecetas() {
    console.log("🌱 Seeding Medical Prescriptions...");

    // 1. Get Test Patient
    const patientDni = '12345678';
    const { data: patient, error: pError } = await supabase.from('patients').select('id').eq('dni', patientDni).single();

    if (pError || !patient) {
        console.error("❌ Patient not found:", pError);
        return;
    }
    console.log(`✅ Patient found: ${patient.id}`);

    // 2. Get a Doctor (General Medicine)
    const { data: doctor, error: dError } = await supabase
        .from('doctors')
        .select('id, specialties!inner(name)')
        .eq('specialties.name', 'Medicina General')
        .limit(1)
        .single();

    if (dError || !doctor) {
        console.error("❌ Doctor not found:", dError);
        return;
    }

    // 3. Create Past Appointments (if not exist, strictly for seeding)
    // We'll create 2 appointments
    const pastDates = [
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) // 30 days ago
    ];

    for (const [index, date] of pastDates.entries()) {
        // Create Appointment
        const { data: appt, error: aError } = await supabase
            .from('appointments')
            .insert({
                patient_id: patient.id,
                doctor_id: doctor.id,
                date_time: date.toISOString(),
                status: 'COMPLETED',
                reason: index === 0 ? 'Fiebre alta y dolor corporal' : 'Control mensual rutinario'
            })
            .select('id')
            .single();

        if (aError) {
            console.error("❌ Error creating appointment:", aError);
            continue;
        }

        // Create Details (Receta)
        const diagnosis = index === 0
            ? 'Infección Respiratoria Aguda (IRA) - Faringitis viral.'
            : 'Chequeo General - Paciente saludable.';

        const treatment = index === 0
            ? `1. Paracetamol 500mg
   - Tomar 1 tableta cada 8 horas por 3 días si hay fiebre.

2. Ibuprofeno 400mg
   - Tomar 1 tableta cada 8 horas por 3 días para inflamación.

3. Reposo absoluto por 48 horas.
4. Hidratación constante (2L de agua al día).`
            : `1. Multivitamínico (Centrum o similar)
   - Tomar 1 cápsula con el desayuno diariamente por 30 días.

2. Mantener dieta balanceada baja en grasas saturadas.
3. Realizar ejercicio cardiovascular 30 min diarios.`;

        const notes = index === 0
            ? "Si la fiebre persiste por más de 3 días, acudir a emergencia."
            : "Próximo control en 6 meses.";

        const { error: dError } = await supabase
            .from('details')
            .insert({
                appointment_id: appt.id,
                diagnosis: diagnosis,
                treatment: treatment,
                notes: notes
            });

        if (dError) {
            console.error("❌ Error creating prescription details:", dError);
        } else {
            console.log(`✅ Prescription created for date: ${date.toLocaleDateString()}`);
        }
    }

    console.log("🏁 Seeding Completed!");
}

seedRecetas();
