
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function seedPediatrics() {
    console.log("👶 Seeding Pediatrics & CRED...");

    const specialties = [
        { name: 'Pediatría', desc: 'Atención integral a niños' },
        { name: 'CRED (Crecimiento y Desarrollo)', desc: 'Control de niño sano' },
        { name: 'Nutrición', desc: 'Alimentación saludable' },
        { name: 'Inmunizaciones', desc: 'Vacunación' }
    ];

    const doctors = [
        { first: 'Patricia', last: 'Lopez (Pedi)', cmp: '80001', spec: 'Pediatría' },
        { first: 'Luisa', last: 'Mendez (CRED)', cmp: '80002', spec: 'CRED (Crecimiento y Desarrollo)' },
        { first: 'Roberto', last: 'Salas (Nutri)', cmp: '80003', spec: 'Nutrición' },
        { first: 'Enfermera', last: 'Juana (Inmun)', cmp: '80004', spec: 'Inmunizaciones' }
    ];

    // 1. Upsert Specialties
    for (const s of specialties) {
        const { error } = await supabase.from('specialties').upsert({ name: s.name }, { onConflict: 'name' });
        if (error) console.error("Error spec:", error);
    }
    console.log("✅ Specialties ensured.");

    // 2. Map IDs and Upsert Doctors
    for (const d of doctors) {
        // Get Spec ID
        const { data: spec } = await supabase.from('specialties').select('id').eq('name', d.spec).single();

        if (spec) {
            const { error: docError } = await supabase.from('doctors').upsert({
                firstName: d.first,
                lastName: d.last,
                cmp: d.cmp, // CMP must be unique
                specialty_id: spec.id,
                is_active: true
            }, { onConflict: 'cmp' });

            if (docError) console.error(`Error seeding doctor ${d.last}:`, docError);
            else console.log(`   + Doctor ${d.last} assigned to ${d.spec}`);
        } else {
            console.error(`Spec ${d.spec} not found for doctor.`);
        }
    }
    console.log("🏁 Pediatrics Data Seeded.");
}

seedPediatrics();
