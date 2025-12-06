import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing in environment variables');
}

// Client for client-side operations (safe for public)
export const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Client for server-side admin operations (bypasses RLS) - USE WITH CAUTION
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

export const getAuth = () => supabaseClient.auth;
export const getStorage = () => supabaseClient.storage;

// Helper to check connection
export const checkSupabaseConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabaseClient.from('users').select('count', { count: 'exact', head: true });
        if (error && error.code !== 'PGRST116') { // Ignore "relation not found" if tables aren't created yet
            console.error('Supabase connection error:', error.message);
            return false;
        }
        return true;
    } catch (e) {
        console.error('Supabase connection exception:', e);
        return false;
    }
};
