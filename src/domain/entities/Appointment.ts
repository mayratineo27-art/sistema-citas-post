export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export class Appointment {
    constructor(
        public readonly id: string,
        public patientId: string,
        public doctorId: string,
        public dateTime: Date,
        public status: AppointmentStatus,
        public reason: string | null,
        public createdAt: Date,
        public updatedAt: Date
    ) { }

    confirm(): void {
        if (this.status === AppointmentStatus.CANCELLED) {
            throw new Error("Cannot confirm a cancelled appointment");
        }
        this.status = AppointmentStatus.CONFIRMED;
        this.updatedAt = new Date();
    }

    cancel(): void {
        if (this.status === AppointmentStatus.COMPLETED) {
            throw new Error("Cannot cancel a completed appointment");
        }
        this.status = AppointmentStatus.CANCELLED;
        this.updatedAt = new Date();
    }

    complete(): void {
        if (this.status !== AppointmentStatus.CONFIRMED) {
            throw new Error("Only confirmed appointments can be completed");
        }
        this.status = AppointmentStatus.COMPLETED;
        this.updatedAt = new Date();
    }
}
