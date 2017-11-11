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
     * @returns {string}
     */
    toJSON() {
        return JSON.stringify({
            id: this.id,
            createdAt: this.createdAt,
            firstName: this.firstName,
            lastName: this.lastName,
            school: this.school
        });
    }
}

module.exports = Member;
