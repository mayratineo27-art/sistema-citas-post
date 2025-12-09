
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("❌ DATABASE_URL is missing in .env");
    process.exit(1);
}

async function run() {
    console.log("🐘 Connecting to Postgres...");
    // Accept self-signed certs for Supabase/Neon
    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("✅ Connected.");

        // 1. Read Migration 09
        const migrationPath = path.join(__dirname, '../../infra/sql/migrations/09_patient_relationships.sql');
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');

        console.log("📜 Executing Migration 09...");
        await client.query(migrationSql);
        console.log("✅ Migration 09 Applied.");

        // 2. Insert Data manually if not exists (Seed Child)
        console.log("👶 Seeding Child Data (SQL)...");
        const seedSql = `
            -- Insert Child Patient
            INSERT INTO public.patients (first_name, last_name, dni, birth_date, phone, address, history_number, sex, insurance_type)
            VALUES ('Mateo', 'Travieso (Hijo)', '87654321', '2020-05-15', '999999999', 'Av. Siempre Viva 123', 'H-9999', 'MALE', 'SIS')
            ON CONFLICT (dni) DO NOTHING;

            -- Update Parent Relation (Just in case migration didn't catch it due to race condition)
            DO $$
            DECLARE parent_id UUID; child_id UUID;
            BEGIN
                SELECT id INTO parent_id FROM public.patients WHERE dni = '12345678';
                SELECT id INTO child_id FROM public.patients WHERE dni = '87654321';
                IF parent_id IS NOT NULL AND child_id IS NOT NULL THEN
                    UPDATE public.patients SET parent_id = parent_id WHERE id = child_id;
                END IF;
            END $$;
        `;
        await client.query(seedSql);
        console.log("✅ Child Data Seeded.");

    } catch (err) {
        console.error("❌ Error executing migration:", err);
    } finally {
        await client.end();
    }
}

run();
