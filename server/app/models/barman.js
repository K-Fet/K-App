const { User } = require('./user');

/**
 * This class represents fa barman.
 */
class Barman extends User {
    /**
     * Constructor.
     * Initialize class fields
     */
    constructor() {
        super();
        // Change id for a `userId` field to match database
        this.userId = this.id;
        this.id = undefined;

        // Init other field
        this.nickname = '';
        this.facebook = '';
        this.godFather = 0;
        this.dateOfBirth = 0;
        this.flow = '';
    }

    /**
     * Generate a JSON object with only visible field.
     * Will be used by {@link JSON}: https://stackoverflow.com/a/34607330/5285167
     *
     * @returns {Object}
     */
    toJSON() {
        return {
            ...super.toJSON(),
            nickname: this.nickname,
            facebook: this.facebook,
            godFather: this.godFather,
            dateOfBirth: this.dateOfBirth,
            flow: this.flow
        };
    }
}

module.exports = {
    Barman
};
