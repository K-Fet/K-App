import { ConnectionInformation, Kommission, Role, AssociationChanges } from './index';

export class Barman {

    id: number;
    lastName: string;
    firstName: string;
    nickname: string;
    username: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    facebook: string;
    dateOfBirth: Date;
    flow: string;
    active: boolean;

    // Associations

    connectionInformation: ConnectionInformation;
    godFather: Barman;
    kommissions: Kommission[];
    roles: Role[];

    _embeded: {
        godFather: Number;
        kommissions: AssociationChanges[],
        roles: AssociationChanges[],
    };

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
