import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Access environment variables securely for Vite
// NOTE: Vite requires variables to start with VITE_ to be exposed to the client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ [Supabase] Credentials missing! Check your .env file and ensure variables start with VITE_');
}

// Create a single instance of the client
// We use a fallback if credentials are missing to prevent immediate crash, though queries will fail.
export const supabaseClient: SupabaseClient = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

// Helpers to access specific services
export const getAuth = () => supabaseClient.auth;
export const getStorage = () => supabaseClient.storage;

// Connection check helper
export const checkSupabaseConnection = async (): Promise<boolean> => {
    try {
        if (!supabaseUrl || !supabaseAnonKey) return false;
        // Simple lightweight check (e.g. check if we can reach the server)
        const { error } = await supabaseClient.from('appointments').select('count', { count: 'exact', head: true });

        // It's considered a success if we get a response, even if it's "table not found" or actual data
        // We only care if the network/client configuration fails
        if (error && error.code === 'PGRST116') return true; // Table missing but connected
        if (error) {
            console.error('[Supabase] Connection check error:', error.message);
            return false;
        }
        return true;
    } catch (e) {
        console.error('[Supabase] Connection check exception:', e);
        return false;
    }
};
