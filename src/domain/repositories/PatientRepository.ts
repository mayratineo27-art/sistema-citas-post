import { Patient } from "../entities/Patient";

export interface PatientRepository {
    findById(id: string): Promise<Patient | null>;
    findByDni(dni: string): Promise<Patient | null>;
    save(patient: Patient): Promise<void>;
    update(patient: Patient): Promise<void>;
    findAll(limit?: number, offset?: number): Promise<Patient[]>;
}
