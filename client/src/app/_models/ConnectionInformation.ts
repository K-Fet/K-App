export class ConnectionInformation {

    id?: Number;
    username?: String;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
