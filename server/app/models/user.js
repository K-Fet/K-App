/**
 * This class represents a member.
 */
class User {

    /**
     * Read raw data and create User instance from it.
     *
     * @param data Raw data
     * @return {User} User with related data
     */
    static parse(data) {
        if (!data) return null;

        const u = new User();

        u.id = data.id;
        u.createdAt = data.createdAt;
        u.updatedAt = data.updatedAt;
        u.deletedAt = data.deletedAt;
        u.email = data.email;
        u.password = data.password;
        u.firstName = data.firstName;
        u.lastName = data.lastName;
        u.school = data.school;
        u.active = data.active;

        return u;
    }


    /**
     * Constructor.
     * Initialize class fields
     */
    constructor() {
        this.id = 0;
        this.createdAt = 0;
        this.updatedAt = 0;
        this.deletedAt = 0;
        this.email = '';
        this.password = '';
        this.firstName = '';
        this.lastName = '';
        this.school = '';
        this.active = true;
    }

    /**
     * Generate a JSON object with only visible field.
     * Will be used by {@link JSON}: https://stackoverflow.com/a/34607330/5285167
     *
     * @returns {{id: number, createdAt: number, updatedAt: number, deletedAt: number, email: string, firstName: string, lastName: string, school: string, active: boolean}}
     */
    toJSON() {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            school: this.school,
            active: this.active,
        };
    }
}

module.exports = {
    User
};
