export class Member {

    id: Number;
    lastName: String;
    firstName: String;
    school: String;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    active: Boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
