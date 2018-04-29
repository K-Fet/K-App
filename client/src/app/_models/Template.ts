export class Template {

    id: Number;
    name: String;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    services: Array<{
        nbMax?: Number,
        name?: String,
        startAt: {
            day: Number,
            hours: Number,
            minutes: Number
        },
        endAt: {
            day: Number,
            hours: Number,
            minutes: Number
        }
    }>;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
