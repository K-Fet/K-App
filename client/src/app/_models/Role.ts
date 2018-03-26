import { AssociationChanges, Permission } from './index';

export class Role {

    id: Number;
    name: String;
    description: String;

    // Association
    permissions: Array<Permission>;

    _embedded: {
        permissions?: AssociationChanges
    };

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
