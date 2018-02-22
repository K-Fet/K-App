export class Service {

    id: Number;
    name: String;
    startAt: Date;
    endAt: Date;
    nbMax: Number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
