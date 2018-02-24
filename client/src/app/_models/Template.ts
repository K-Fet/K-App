export class Template {

    id: Number;
    name: String;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    services: Array<{
        nbMax?: Number,
        name?: String,
        categoryId: Number,
        startAt: {
            day: Number,
            hour: Number,
            minute: Number
        },
        endAt: {
            day: Number,
            hour: Number,
            minute: Number
        }
    }>;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
