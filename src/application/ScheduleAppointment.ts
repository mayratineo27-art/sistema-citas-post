import { Appointment, AppointmentStatus } from "../domain/entities/Appointment";
import { AppointmentRepository } from "../domain/repositories/AppointmentRepository";
import { v4 as uuidv4 } from 'uuid';

export class ScheduleAppointment {
    constructor(private appointmentRepository: AppointmentRepository) { }

    async execute(input: {
        patientId: string;
        doctorId: string;
        dateTime: Date;
        reason?: string;
    }): Promise<Appointment> {

        // Validate availability
        // In a real scenario, we would check if the doctor has another appointment at this time
        // For now, we assume a simple rule: no overlaps for the same doctor at the exact same time
        const existingAppointments = await this.appointmentRepository.findByDoctorAndDate(input.doctorId, input.dateTime);

        // Check for exact time match (simplified logic)
        const conflict = existingAppointments.find(app =>
            app.dateTime.getTime() === input.dateTime.getTime() &&
            app.status !== AppointmentStatus.CANCELLED
        );

        if (conflict) {
            throw new Error("Doctor is not available at this time");
        }

        const appointment = new Appointment(
            uuidv4(),
            input.patientId,
            input.doctorId,
            input.dateTime,
            AppointmentStatus.PENDING,
            input.reason || null,
            new Date(),
            new Date()
        );

        await this.appointmentRepository.save(appointment);

        return appointment;
    }
}
