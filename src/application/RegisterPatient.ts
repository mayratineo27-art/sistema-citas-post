import { Patient } from "../domain/entities/Patient";
import { PatientRepository } from "../domain/repositories/PatientRepository";
import { v4 as uuidv4 } from 'uuid';

export class RegisterPatient {
    constructor(private patientRepository: PatientRepository) { }

    async execute(input: {
        firstName: string;
        lastName: string;
        dni: string;
        birthDate: Date;
        phone: string;
        historyNumber: string;
    }): Promise<Patient> {

        // Check if patient already exists
        const existingPatient = await this.patientRepository.findByDni(input.dni);
        if (existingPatient) {
            throw new Error(`Patient with DNI ${input.dni} already exists`);
        }

        // Create new patient
        const patient = new Patient(
            uuidv4(),
            input.firstName,
            input.lastName,
            input.dni,
            input.birthDate,
            input.phone,
            input.historyNumber,
            new Date(),
            new Date()
        );

        // Persist
        await this.patientRepository.save(patient);

        return patient;
    }
}
