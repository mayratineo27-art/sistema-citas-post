import { PatientRepository } from "../../domain/repositories/PatientRepository";
import { Patient } from "../../domain/entities/Patient";
import { supabaseClient } from "../db/client";

export class SupabasePatientRepository implements PatientRepository {

    async findById(id: string): Promise<Patient | null> {
        const { data, error } = await supabaseClient
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async findByDni(dni: string): Promise<Patient | null> {
        const { data, error } = await supabaseClient
            .from('patients')
            .select('*')
            .eq('dni', dni)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async save(patient: Patient): Promise<void> {
        const { error } = await supabaseClient
            .from('patients')
            .insert({
                id: patient.id,
                first_name: patient.firstName,
                last_name: patient.lastName,
                dni: patient.dni,
                birth_date: patient.birthDate,
                phone: patient.phone,
                history_number: patient.historyNumber,
                created_at: patient.createdAt,
                updated_at: patient.updatedAt
            });

        if (error) throw new Error(error.message);
    }

    async update(patient: Patient): Promise<void> {
        const { error } = await supabaseClient
            .from('patients')
            .update({
                first_name: patient.firstName,
                last_name: patient.lastName,
                phone: patient.phone,
                updated_at: new Date()
            })
            .eq('id', patient.id);

        if (error) throw new Error(error.message);
    }

    async findAll(limit: number = 20, offset: number = 0): Promise<Patient[]> {
        const { data, error } = await supabaseClient
            .from('patients')
            .select('*')
            .range(offset, offset + limit - 1);

        if (error) throw new Error(error.message);
        return data.map(this.mapToEntity);
    }

    private mapToEntity(data: any): Patient {
        return new Patient(
            data.id,
            data.first_name,
            data.last_name,
            data.dni,
            new Date(data.birth_date),
            data.phone,
            data.history_number,
            new Date(data.created_at),
            new Date(data.updated_at)
        );
    }
}
