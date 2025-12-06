import { Schedule } from "../entities/Schedule";

export interface ScheduleRepository {
    findByDoctorId(doctorId: string): Promise<Schedule[]>;
    save(schedule: Schedule): Promise<void>;
    delete(id: string): Promise<void>;
}
