
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function seedTopico() {
    console.log("🩹 Seeding Tópico Doctor...");

    // 1. Ensure Specialty
    const { data: specData, error: specError } = await supabase.from('specialties').upsert({ name: 'Tópico' }, { onConflict: 'name' }).select('id').single();

    if (!specData) {
        // Try fetching if upsert didn't return id (if existing)
        var { data: existingSpec } = await supabase.from('specialties').select('id').eq('name', 'Tópico').single();
    }
    const specId = specData?.id || existingSpec?.id;

    if (!specId) {
        console.error("❌ Could not get Tópico ID");
        return;
    }

    // 2. Assign Doctor
    const { error: docError } = await supabase.from('doctors').upsert({
        firstName: 'Enfermero',
        lastName: 'Jorge (Tópico)',
        cmp: '90005', // Unique
        specialty_id: specId,
        is_active: true
    }, { onConflict: 'cmp' });

    if (docError) console.error("Error seeding doctor:", docError);
    else console.log("✅ Doctor Jorge assigned to Tópico.");
}

seedTopico();
