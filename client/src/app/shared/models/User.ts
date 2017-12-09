export class User {

    _id: Number;
    lastName: String;
    firstName: String;
    email: String;
    dateNaissance: Date;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    school: String;
    active: Boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
