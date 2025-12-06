import { supabaseClient } from '../../src/infrastructure/db/client';

describe('Supabase Integration', () => {
    // Skip if no credentials (local CI/CD without env)
    const runTest = process.env.SUPABASE_URL ? it : it.skip;

    runTest('should connect to Supabase', async () => {
        const { data, error } = await supabaseClient.from('users').select('count', { count: 'exact', head: true });
        expect(error).toBeNull();
    });

    runTest('should have users table', async () => {
        const { error } = await supabaseClient.from('users').select('*').limit(1);
        expect(error).toBeNull();
    });
});
