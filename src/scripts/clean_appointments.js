
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function cleanBadAppointments() {
    console.log("🧹 Cleaning up invalid 3 AM appointments...");

    // Fetch appointments to identify IDs (Supabase delete with filters is safe but checking helps logging)
    const { data: appts } = await supabase.from('appointments').select('id, date_time');

    // Filter purely in JS for safety or DB logic
    // We want to remove times where hour is < 7 (before 7 AM)

    // Actually, SQL delete is easier:
    // Extract hour from timestamptz is tricky in Postgres depending on timezone. 
    // Easier to iterate if few.

    if (!appts) return;

    let count = 0;
    for (const a of appts) {
        const date = new Date(a.date_time);
        const hour = date.getHours();
        // 3 AM is hour 3. 7:30 AM is hour 7.
        // So delete anything < 7.
        if (hour < 7) {
            console.log(`Deleting ${a.id} at ${a.date_time} (Hour: ${hour})`);
            await supabase.from('appointments').delete().eq('id', a.id);
            count++;
        }
    }
    console.log(`✅ Deleted ${count} invalid appointments.`);
}

cleanBadAppointments();
