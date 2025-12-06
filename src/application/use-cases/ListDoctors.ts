import { DoctorRepository } from "../../domain/repositories/DoctorRepository";
import { Doctor } from "../../domain/entities/Doctor";

export class ListDoctors {
    constructor(private doctorRepository: DoctorRepository) { }

    async execute(): Promise<Doctor[]> {
        return this.doctorRepository.findAll();
    }
}
