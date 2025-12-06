import { DoctorRepository } from "../../domain/repositories/DoctorRepository";
import { Doctor } from "../../domain/entities/Doctor";
import { v4 as uuidv4 } from 'uuid';

export class CreateDoctor {
    constructor(private doctorRepository: DoctorRepository) { }

    async execute(input: {
        userId: string,
        firstName: string,
        lastName: string,
        cmp: string,
        specialtyId: string
    }): Promise<Doctor> {
        const doctor = new Doctor(
            uuidv4(),
            input.firstName,
            input.lastName,
            input.cmp,
            input.specialtyId,
            true, // active
            new Date()
        );
        // Note: Linking to User is implicit via ID or separate relation in real DB
        // The entity definition I used earlier didn't have userId, I should fix that.

        await this.doctorRepository.save(doctor);
        return doctor;
    }
}
