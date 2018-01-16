import { ConnectionInformation, Kommission, Role } from './index';

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
        godFatherId: number;

        // Associations

        connectionInformation: ConnectionInformation;
        godFather: Barman;
        kommissions: Kommission[];
        roles: Role[];

        constructor(values: Object = {}) {
            Object.assign(this, values);
        }
    }
