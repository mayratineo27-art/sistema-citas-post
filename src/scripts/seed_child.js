
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Env Vars. URL:", !!supabaseUrl, "Key:", !!supabaseKey);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("👶 Seeding Child Profile...");

    // 1. Create Child Patient
    const childDni = '87654321';
    const { data: existing } = await supabase.from('patients').select('id').eq('dni', childDni).single();

    let childId;

    if (!existing) {
        // Must use 'upsert' or 'insert'
        const { data: newChild, error } = await supabase.from('patients').insert([{
            first_name: 'Mateo',
            last_name: 'Travieso (Hijo)',
            dni: childDni,
            birth_date: '2020-05-15', // 5 years old
            phone: '999999999',
            address: 'Av. Siempre Viva 123',
            history_number: 'H-9999',
            sex: 'MALE',
            insurance_type: 'SIS'
        }]).select('id').single();

        if (error) { console.error("Error creating child", error); return; }
        childId = newChild.id;
        console.log("✅ Child Patient Created");
    } else {
        childId = existing.id;
        console.log("ℹ️ Child Patient already exists");
    }

    // 2. Add some History for Child
    const { data: doctor } = await supabase.from('doctors').select('id').limit(1).single();

    // Appointment
    const { data: appt } = await supabase.from('appointments').insert({
        patient_id: childId,
        doctor_id: doctor.id,
        date_time: new Date(Date.now() - 2592000000).toISOString(),
        status: 'COMPLETED',
        reason: 'Control de Crecimiento'
    }).select('id').single();

    if (appt) {
        // Prescription
        await supabase.from('details').insert({
            appointment_id: appt.id,
            diagnosis: 'Niño Sano',
            treatment: 'Sulfato Ferroso 5 gotas al día.',
            notes: 'Próxima cita en 1 mes.'
        });
        console.log("✅ Child History Seeded");
    }

    // Lab Order
    await supabase.from('lab_orders').insert({
        patient_id: childId,
        doctor_id: doctor.id,
        type: 'Tamizaje de Hemoglobina',
        status: 'PENDING'
    });
    console.log("✅ Child Lab Order Seeded");
}

seed();
