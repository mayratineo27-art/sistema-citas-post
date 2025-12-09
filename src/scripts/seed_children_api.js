
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use Service Key if available for bypass RLS, otherwise Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Credentials missing in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("👶 Seeding Maria and Jose...");

    // 1. Get Parent ID
    const { data: parent, error: pError } = await supabase
        .from('patients')
        .select('id')
        .eq('dni', '12345678') // Test Patient
        .single();

    if (pError || !parent) {
        console.error("❌ Parent not found. Seed cancelled.", pError);
        return;
    }

    const parentId = parent.id;

    // 2. Prepare Data
    const children = [
        {
            dni: 'CHILD001',
            first_name: 'Maria',
            last_name: 'Perez (Hija)',
            birth_date: '2019-05-15',
            sex: 'FEMALE',
            insurance_type: 'SIS',
            parent_id: parentId
        },
        {
            dni: 'CHILD002',
            first_name: 'Jose',
            last_name: 'Perez (Hijo)',
            birth_date: '2016-08-20',
            sex: 'MALE',
            insurance_type: 'SIS',
            parent_id: parentId
        }
    ];

    // 3. Insert or Update
    const { data, error } = await supabase
        .from('patients')
        .upsert(children, { onConflict: 'dni' })
        .select();

    if (error) {
        console.error("❌ Error seeding children:", error);
    } else {
        console.log("✅ Successfully seeded Maria and Jose!", data.length, "records.");
    }
}

seed();
