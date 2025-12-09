
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

async function fixAge() {
    console.log('👶 Updating Maria to be a child...');

    const { error } = await supabase
        .from('patients')
        .update({ birth_date: '2017-05-15' }) // 8 years old
        .eq('dni', '87654321');

    if (error) {
        console.error("❌ Error updating age:", error);
    } else {
        console.log('✅ Maria is now a child (DOB: 2017)');
    }
}

fixAge();
