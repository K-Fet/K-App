import { AssociationChanges, ConnectionInformation, Kommission, Role, Service } from './index';

export class Barman {

    id: Number;
    lastName: String;
    firstName: String;
    nickname: String;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    facebook: String;
    dateOfBirth: Date;
    flow: String;
    active: Boolean;

    // Associations

    connection: ConnectionInformation;
    godFather: Barman;
    kommissions: Array<Kommission>;
    roles: Array<Role>;
    services: Array<Service>;

    _embedded: {
        godFather?: Number;
        kommissions?: AssociationChanges,
        roles?: AssociationChanges,
    };

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
