
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listPatients() {
    console.log("Listing all patients...");
    const { data, error } = await supabase.from('patients').select('id, first_name, last_name, dni');

    if (error) console.error(error);
    else {
        const marias = data.filter(p => p.first_name.toLowerCase().includes('maria'));
        console.log(`Found ${marias.length} potential Marias:`);
        marias.forEach(m => console.log(`ID: ${m.id} | Name: ${m.first_name} ${m.last_name} | DNI: ${m.dni}`));
    }
}

listPatients();
