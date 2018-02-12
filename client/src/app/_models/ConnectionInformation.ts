export class ConnectionInformation {

    id: Number;
    username: String;
    password: String;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
