export class Patient {
    constructor(
        public readonly id: string,
        public firstName: string,
        public lastName: string,
        public dni: string,
        public birthDate: Date,
        public phone: string,
        public historyNumber: string,
        public createdAt: Date,
        public updatedAt: Date
    ) { }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    updateDetails(data: Partial<Omit<Patient, 'id' | 'dni' | 'historyNumber'>>): void {
        if (data.firstName) this.firstName = data.firstName;
        if (data.lastName) this.lastName = data.lastName;
        if (data.phone) this.phone = data.phone;
        this.updatedAt = new Date();
    }
}
