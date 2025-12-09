import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) process.exit(1);

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('🔍 Checking Database Content...');

    // 1. Check Patient
    const { data: patient } = await supabase.from('patients').select('*').eq('dni', '12345678');
    console.log('👤 Patient (12345678):', patient?.length ? 'FOUND' : 'MISSING', patient);

    // 2. Check Specialties
    const { data: specialties } = await supabase.from('specialties').select('*');
    console.log('🏥 Specialties:', specialties?.map(s => s.name));

    // 3. Check Doctors
    const { data: doctors } = await supabase.from('doctors').select('*, specialties(name)');
    console.log('👨‍⚕️ Doctors:', doctors?.map(d => `${d.firstName} ${d.lastName} (${d.specialties?.name})`));
}

check();
