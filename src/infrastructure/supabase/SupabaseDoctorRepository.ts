import { DoctorRepository } from "../../domain/repositories/DoctorRepository";
import { Doctor } from "../../domain/entities/Doctor";
import { supabaseClient } from "../db/client";

export class SupabaseDoctorRepository implements DoctorRepository {

    async findById(id: string): Promise<Doctor | null> {
        const { data, error } = await supabaseClient
            .from('doctors')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async findAll(): Promise<Doctor[]> {
        const { data, error } = await supabaseClient
            .from('doctors')
            .select('*');

        if (error) throw new Error(error.message);
        return data.map(this.mapToEntity);
    }

    async findBySpecialty(specialtyId: string): Promise<Doctor[]> {
        const { data, error } = await supabaseClient
            .from('doctors')
            .select('*')
            .eq('specialty_id', specialtyId);

        if (error) throw new Error(error.message);
        return data.map(this.mapToEntity);
    }

    async save(doctor: Doctor): Promise<void> {
        const { error } = await supabaseClient
            .from('doctors')
            .insert({
                id: doctor.id,
                user_id: doctor.userId,
                // Match SQL column names (camelCase to snake_case mapping if needed, 
                // but assuming current setup uses similar names or needs mapping)
                firstName: doctor.firstName, // Note: SQL migration used "firstName" (mixed case) or "first_name"?
                // Checking SQL migration: "firstName TEXT NOT NULL" (camelCase in SQL definitions at Step 93, wait)
                // Step 93 SQL: "firstName TEXT NOT NULL, lastName TEXT NOT NULL"
                // actually looking closer at Step 93 SQL for doctors:
                // firstName TEXT NOT NULL,
                // lastName TEXT NOT NULL,
                // cmp TEXT UNIQUE NOT NULL,
                // specialty_id UUID...
                // So columns are firstName/lastName.
                lastName: doctor.lastName,
                cmp: doctor.cmp,
                specialty_id: doctor.specialtyId,
                is_active: doctor.isActive,
                created_at: doctor.createdAt
            });

        if (error) throw new Error(error.message);
    }

    async update(doctor: Doctor): Promise<void> {
        const { error } = await supabaseClient
            .from('doctors')
            .update({
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                specialty_id: doctor.specialtyId,
                is_active: doctor.isActive
            })
            .eq('id', doctor.id);

        if (error) throw new Error(error.message);
    }

    private mapToEntity(data: any): Doctor {
        return new Doctor(
            data.id,
            data.user_id,
            data.firstName,
            data.lastName,
            data.cmp,
            data.specialty_id,
            data.is_active,
            new Date(data.created_at)
        );
    }
}
