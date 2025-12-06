export enum UserRole {
    ADMIN = 'admin',
    DOCTOR = 'doctor',
    NURSE = 'nurse',
    RECEPTIONIST = 'receptionist',
    PATIENT = 'patient'
}

export class User {
    constructor(
        public readonly id: string,
        public email: string,
        public role: UserRole,
        public firstName: string,
        public lastName: string,
        public createdAt: Date,
        public updatedAt: Date
    ) { }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    isAdmin(): boolean {
        return this.role === UserRole.ADMIN;
    }
}
