export class Member {

    id: number;
    lastName: string;
    firstName: string;
    school: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    active: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
