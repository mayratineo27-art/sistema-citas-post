import { supabaseClient } from "../db/client";

// Simple Domain Interface inline for now (should be in domain/repositories/UserRepository.ts)
export interface User {
    id: string;
    email: string;
    role: string;
}

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) return null;
        return data as User;
    }

    async create(user: Omit<User, 'id'>): Promise<User | null> {
        const { data, error } = await supabaseClient
            .from('users')
            .insert(user)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as User;
    }
}
