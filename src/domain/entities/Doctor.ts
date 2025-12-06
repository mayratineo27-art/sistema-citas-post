export class Doctor {
    constructor(
        public readonly id: string,
        public userId: string,
        public firstName: string,
        public lastName: string,
        public cmp: string, // Colegio Médico del Perú
        public specialtyId: string,
        public isActive: boolean,
        public createdAt: Date
    ) { }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    deactivate(): void {
        this.isActive = false;
    }

    activate(): void {
        this.isActive = true;
    }
}
