export class Specialty {
    constructor(
        public readonly id: string,
        public name: string,
        public description: string | null,
        public createdAt: Date
    ) { }
}
