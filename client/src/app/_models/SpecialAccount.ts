import { AssociationChanges, ConnectionInformation, Permission } from './index';

export class SpecialAccount {

    id: Number;
    description: String;
    createdAt: Date;
    code: Number;
    password: String;

    // Association
    connection: ConnectionInformation;
    permissions: Array<Permission>;

    _embedded: {
        permissions?: AssociationChanges
    };

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
