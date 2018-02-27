import { ConnectionInformation } from './index';

export class SpecialAccount {

    id: Number;
    description: String;
    connection: ConnectionInformation;
    createdAt: Date;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
