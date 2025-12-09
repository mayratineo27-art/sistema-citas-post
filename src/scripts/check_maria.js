
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data } = await supabase.from('patients').select('first_name').eq('first_name', 'Maria');
    if (data && data.length > 0) {
        console.log("✅ Maria found!");
    } else {
        console.log("❌ Maria NOT found.");
    }
}
check();
