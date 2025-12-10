
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePatientName() {
    console.log('Updating patient name...');

    const { data, error } = await supabase
        .from('patients')
        .update({
            first_name: 'Mayra',
            last_name: 'Tineo'
        })
        .eq('dni', '12345678')
        .select();

    if (error) {
        console.error('Error updating patient:', error);
    } else {
        console.log('Successfully updated patient:', data);
    }
}

updatePatientName();
