export class Service {

    id: Number;
    name: String;
    startingDate: Date;
    endingDate: Date;
    nbMax: Number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
