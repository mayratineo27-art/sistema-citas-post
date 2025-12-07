import { AppointmentRepository } from "../../domain/repositories/AppointmentRepository";
import { Appointment, AppointmentStatus } from "../../domain/entities/Appointment";
import { supabaseClient } from "../db/client";

export class SupabaseAppointmentRepository implements AppointmentRepository {

    async findById(id: string): Promise<Appointment | null> {
        const { data, error } = await supabaseClient
            .from('appointments')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapToEntity(data);
    }

    async findByDoctorAndDate(doctorId: string, date: Date): Promise<Appointment[]> {
        // Logic to filter by doctor and date range (start of day to end of day)
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabaseClient
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctorId)
            .gte('date_time', startOfDay.toISOString())
            .lte('date_time', endOfDay.toISOString());

        if (error) throw new Error(error.message);
        return data.map((d) => this.mapToEntity(d));
    }

    async save(appointment: Appointment): Promise<void> {
        const { error } = await supabaseClient
            .from('appointments')
            .insert({
                id: appointment.id,
                patient_id: appointment.patientId,
                doctor_id: appointment.doctorId,
                date_time: appointment.dateTime.toISOString(),
                status: appointment.status,
                reason: appointment.reason
            });

        if (error) throw new Error(error.message);
    }

    async update(appointment: Appointment): Promise<void> {
        const { error } = await supabaseClient
            .from('appointments')
            .update({
                status: appointment.status,
                date_time: appointment.dateTime.toISOString(),
                reason: appointment.reason
            })
            .eq('id', appointment.id);

        if (error) throw new Error(error.message);
    }

    // Helper for mapping DB result to Entity
    private mapToEntity(data: any): Appointment {
        return new Appointment(
            data.id,
            data.patient_id,
            data.doctor_id,
            new Date(data.date_time),
            data.status as AppointmentStatus,
            data.reason
        );
    }
}
