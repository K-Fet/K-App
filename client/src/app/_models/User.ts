export class User {

    id: number;
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    school: string;
    active: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
