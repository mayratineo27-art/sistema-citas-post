import { Appointment } from "../entities/Appointment";

export interface AppointmentRepository {
    save(appointment: Appointment): Promise<void>;
    findById(id: string): Promise<Appointment | null>;
    findByDoctorAndDate(doctorId: string, date: Date): Promise<Appointment[]>;
    update(appointment: Appointment): Promise<void>;
}
