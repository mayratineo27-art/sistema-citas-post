
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function simulateBooking() {
    console.log("🍼 Simulating Booking for Child (Maria/Mateo)...");

    // 1. Get Child by First Name or DNI
    const { data: child, error: childError } = await supabase.from('patients')
        .select('*')
        .ilike('first_name', '%Maria%')
        .limit(1)
        .single();

    if (childError || !child) {
        console.error("❌ Child not found.", childError);
        return;
    }
    console.log(`✅  Child found: ${child.first_name} (ID: ${child.id})`);

    // 2. Find Specialty
    const specialtyName = "Medicina General";
    const { data: specData, error: specError } = await supabase
        .from('specialties')
        .select('id, name')
        .ilike('name', `%${specialtyName}%`)
        .limit(1)
        .single();

    if (specError) {
        console.error("❌ Specialty not found", specError);
        return;
    }
    console.log(`✅ Specialty found: ${specData.name}`);

    // 3. Find Doctor
    const { data: docData, error: docError } = await supabase
        .from('doctors')
        .select('id, firstname')
        .eq('specialty_id', specData.id)
        .limit(1)
        .single();

    if (docError) {
        console.error("❌ Doctor lookup failed", docError);
        // This might be the issue?
        return;
    }
    console.log(`✅ Doctor found: ${docData?.firstName || 'Unknown'}`);

    // 4. Insert Appointment
    const payload = {
        patient_id: child.id,
        doctor_id: docData.id,
        date_time: new Date().toISOString(),
        status: 'PENDING',
        reason: 'Debug Booking Child'
    };

    const { data: insertData, error: insertError } = await supabase
        .from('appointments')
        .insert(payload)
        .select()
        .single();

    if (insertError) {
        console.error("❌ INSERT FAILED:", insertError);
        if (insertError.code === '23505') console.log("   -> Constraint Violation?");
        if (insertError.code === '42501') console.log("   -> RLS Policy Violation?");
    } else {
        console.log("✅ BOOKING SUCCESSFUL - ID:", insertData.id);
        console.log("   -> Ticket generation logic in frontend should work if this works.");
    }
}

simulateBooking();
