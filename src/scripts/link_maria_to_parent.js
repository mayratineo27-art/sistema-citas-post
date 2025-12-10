
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function linkMariaToParent() {
    console.log('Connecting to Supabase...');

    // 1. Get the Parent (Usuario Principal)
    const { data: parent, error: parentError } = await supabase
        .from('patients')
        .select('id, first_name, last_name')
        .eq('dni', '12345678')
        .single();

    if (parentError || !parent) {
        console.error('Error finding Parent (12345678):', parentError);
        return;
    }

    console.log(`Found Parent: ${parent.first_name} ${parent.last_name} (${parent.id})`);

    // 2. Find Marias
    const { data: marias, error: mariaError } = await supabase
        .from('patients')
        .select('id, first_name, last_name, parent_id')
        .ilike('first_name', 'Mar%');

    if (mariaError) {
        console.error('Error finding Marias:', mariaError);
        return;
    }

    console.log(`Found ${marias.length} potential family members.`);

    // 3. Link them
    for (const maria of marias) {
        if (maria.id === parent.id) continue; // Don't link start to self

        const { error: updateError } = await supabase
            .from('patients')
            .update({ parent_id: parent.id })
            .eq('id', maria.id);

        if (updateError) {
            console.error(`Failed to link ${maria.first_name}:`, updateError);
        } else {
            console.log(`SUCCESS: Linked ${maria.first_name} ${maria.last_name} to Parent.`);
        }
    }
}

linkMariaToParent();
