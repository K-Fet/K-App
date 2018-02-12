export class Category {

    id: Number;
    name: String;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
