
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSpecialties() {
    console.log("🔍 Checking Specialties...");
    const { data, error } = await supabase.from('specialties').select('*');
    if (error) console.error(error);
    else {
        console.table(data);
        console.log("Checking for 'Pediatría' or 'CRED':");
        const missing = !data.some(s => s.name.includes('Pediatria') || s.name.includes('CRED') || s.name.includes('Niño'));
        if (missing) {
            console.log("⚠️  Potential Issue: Pediatric specialties MISSING.");
        } else {
            console.log("✅ Pediatric specialties present.");
        }
    }
}

checkSpecialties();
