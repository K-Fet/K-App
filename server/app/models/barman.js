/**
 * This class represents a barman.
 */
class Barman{
    /**
     * Constructor.
     * Initialize class fields
     */
     constructor() {
        this.id = '';
        this.email = '';
        this.password = '';
        this.surnom = '';
        this.createdAt = '';
        this.code = '';
        this.firstName = '';
        this.lastName = '';
        this.birth = '';
        this.facebook = '';
        this.godfather = '';
        this.cheminement = '';
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
            email: this.email,
            password: this.password,
            surnom: this.surnom,
            createdAt: this.createdAt,
            code: this.code,
            firstName: this.firstName,
            lastName: this.lastName,
            birth: this.birth,
            facebook: this.facebook,
            godfather: this.godfather,
            cheminement: this.cheminement
        };
    }
}

module.exports = Barman;
