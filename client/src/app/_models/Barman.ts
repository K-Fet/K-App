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
        godFather: number;

        constructor(values: Object = {}) {
            Object.assign(this, values);
        }
    }
