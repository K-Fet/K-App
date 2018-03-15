export class Permission {

    id: Number;
    name: String;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
