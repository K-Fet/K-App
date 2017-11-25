/**
 * This class represents a service.
 */
class Service {
    /**+
     * Constructor.
     * Initialize class fields
     */
    constructor() {
        this.id = '';
        this.name = '';
        this.startingDate = '';
        this.finishDate = '';
        this.nbMax = '';
        this.categoryId='';
    }

    /**
     * Generate a JSON object with only visible field.
     * Will be used by {@link JSON}: https://stackoverflow.com/a/34607330/5285167
     *
     * @returns {{id: string, name: string, startingDate: string, finishDate: string, nbMax: string, categoryId: string}}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            startingDate: this.startingDate,
            finishDate: this.finishDate,
            nbMax: this.nbMax,
            categoryId: this.categoryId
        };
    }
}

module.exports = Service;