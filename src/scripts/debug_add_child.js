
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Using ANON key to match client-side behavior

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Env Vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log("1. Fetching Parent (DNI 12345678)...");
    const { data: parent, error: pError } = await supabase
        .from('patients')
        .select('id')
        .eq('dni', '12345678')
        .single();

    if (pError || !parent) {
        console.error("Parent not found or error:", pError);
        return;
    }
    console.log("Parent ID:", parent.id);

    console.log("2. Attempting Insert of Child 'Pedrito'...");
    const { data, error } = await supabase.from('patients').insert({
        first_name: 'Pedrito',
        last_name: 'Debug',
        dni: '11223344',
        birth_date: '2020-01-01',
        sex: 'MALE',
        parent_id: parent.id,
        password: '11223344',
        role: 'patient',
        insurance_type: 'SIS'
    }).select();

    if (error) {
        console.error("❌ INSERT ERROR:", JSON.stringify(error, null, 2));
    } else {
        console.log("✅ Insert Success:", data);

        // Cleanup
        await supabase.from('patients').delete().eq('dni', '11223344');
    }
}

testInsert();
