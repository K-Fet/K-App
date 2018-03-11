import { ConnectionInformation, Permission, AssociationChanges } from './index';

export class SpecialAccount {

    id: Number;
    description: String;
    createdAt: Date;
    code: Number;

    // Association
    connection: ConnectionInformation;
    permissions: Permission[];

    _embedded: {
        permissions?: AssociationChanges,
    };

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
