export class Schedule {
    constructor(
        public readonly id: string,
        public doctorId: string,
        public dayOfWeek: number, // 0-6
        public startTime: string, // "HH:mm"
        public endTime: string, // "HH:mm"
        public createdAt: Date
    ) { }
}
