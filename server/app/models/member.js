/**
 * This class represents a member.
 */
class Member {
    /**
     * Constructor.
     * Initialize class fields
     */
    constructor() {
        this.id = '';
        this.createdAt = '';
        this.firstName = '';
        this.lastName = '';
        this.school = '';
    }

    /**
     * Generate a JSON object with only visible field.
     * Will be used by {@link JSON}: https://stackoverflow.com/a/34607330/5285167
     *
     * @returns {{id: string, createdAt: string, firstName: string, lastName: string, school: string}}
     */
    toJSON() {
        return {
            id: this.id,
            createdAt: this.createdAt,
            firstName: this.firstName,
            lastName: this.lastName,
            school: this.school
        };
    }
}

module.exports = Member;
