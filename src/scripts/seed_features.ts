
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Env Vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("🌱 Seeding Features...");

    // 1. Create Table via SQL (RPC or just raw query if we had a backend, but client generic query might fail for DDL)
    // Supabase JS client cannot run "CREATE TABLE" directly unless we use RPC or we rely on the migration file being run manually.
    // BUT we can insert data if tables exist.
    // WAIT: I cannot create tables via supabase-js client unless I use postgres function `exec`.
    // I will Assume the USER runs the SQL or I use a workaround.
    // Actually, I can allow the user to see the `notify_user` asking to run migration.
    // OR I can try to use the dashboard logic.

    // Better strategy: I will ASK user to run the migration 08 manually because DDL via client is risky/blocked.
    // BUT I can try to INSERT data assuming table exists, if it fails I tell user.

    // Let's try to just insert data into 'details' for prescriptions which ALREADY exists.
    // LAB ORDERS requires the table.

    console.log("Check if lab_orders table exists...");
    const { error: checkError } = await supabase.from('lab_orders').select('id').limit(1);

    if (checkError && checkError.code === '42P01') {
        console.error("❌ Table `lab_orders` does NOT exist. You must run `infra/sql/migrations/08_lab_orders.sql` in Supabase SQL Editor.");
        return;
    }

    console.log("✅ Table `lab_orders` exists (or at least queried). Seeding...");

    // Get Patient
    const { data: patient } = await supabase.from('patients').select('id').eq('dni', '12345678').single();
    if (!patient) { console.log("Patient not found"); return; }

    // Get Doctor
    const { data: doctor } = await supabase.from('doctors').select('id').limit(1).single();

    // Insert Lab Orders
    await supabase.from('lab_orders').insert([
        { patient_id: patient.id, doctor_id: doctor.id, type: 'Hemograma Completo', status: 'COMPLETED', results: { pdf: 'url' }, created_at: new Date(Date.now() - 432000000).toISOString() },
        { patient_id: patient.id, doctor_id: doctor.id, type: 'Colesterol y Triglicéridos', status: 'PENDING' }
    ]);

    console.log("✅ Lab Orders Seeded");

    // Create Appointment + Details (Receta)
    const { data: appt } = await supabase.from('appointments').insert({
        patient_id: patient.id,
        doctor_id: doctor.id,
        date_time: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
        status: 'COMPLETED',
        reason: 'Dolor de garganta'
    }).select('id').single();

    if (appt) {
        await supabase.from('details').insert({
            appointment_id: appt.id,
            diagnosis: 'Faringitis',
            treatment: 'Ibuprofeno 400mg c/8h',
            notes: 'Reposo'
        });
        console.log("✅ Prescription (Details) Seeded");
    }
}

seed();
