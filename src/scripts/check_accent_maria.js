
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkAccent() {
    console.log("Re-checking patient names...");
    // Fetch generic 'Mar' to catch Maria, María, Mario, etc.
    const { data: patients } = await supabase.from('patients').select('id, first_name, last_name, dni').ilike('first_name', 'Mar%');

    if (patients) {
        console.log("Found patients starting with 'Mar':");
        patients.forEach(p => console.log(` - ${p.first_name} ${p.last_name} (ID: ${p.id})`));
    }
}
checkAccent();
