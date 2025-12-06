import { Doctor } from "../entities/Doctor";

export interface DoctorRepository {
    findById(id: string): Promise<Doctor | null>;
    findAll(): Promise<Doctor[]>;
    findBySpecialty(specialtyId: string): Promise<Doctor[]>;
    save(doctor: Doctor): Promise<void>;
    update(doctor: Doctor): Promise<void>;
}
