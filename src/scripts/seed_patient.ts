import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Falta configuración de Supabase en .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('🌱 Sembrando Paciente de Prueba...');

    const { error } = await supabase
        .from('patients')
        .upsert({
            first_name: 'Paciente',
            last_name: 'Prueba',
            dni: '12345678',
            birth_date: '1990-01-01',
            insurance_type: 'SIS',
            sex: 'MALE',
            phone: '999888777',
            address: 'Av. Principal 123'
        }, { onConflict: 'dni' })
        .select();

    if (error) {
        console.error('❌ Error insertando paciente:', error.message);
    } else {
        console.log('✅ Paciente de prueba insertado correctamente con DNI 12345678');
    }
}

seed();
