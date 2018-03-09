const { createUserError } = require('./errors');

/**
 * Clean an object by removing 'undefined' fields.
 *
 * Needed because sequelize does not make difference between null and undefined
 * (see https://github.com/sequelize/sequelize/issues/7056).
 *
 * @param obj Object to clean
 * @return {*} The object cleaned
 */
function cleanObject(obj) {
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);
    return obj;
}

/**
 * Add and remove associations from an object.
 *
 * @param key {String} Association key, all in lowercase.
 * @param value {{add:Array<number>,remove:Array<number>}} Association value.
 * @param instance {Model} Sequelize model with the good associations.
 * @param transaction Sequelize transaction.
 * @param preventRemove {Boolean} When true, throw an error if the user try to remove an association.
 * @returns {Promise<void>}
 */
async function setEmbeddedAssociations(key, value, instance, transaction, preventRemove = false) {
    const upperKey = key.charAt(0).toUpperCase() + key.slice(1);

    if (value.add && value.add.length > 0) {
        try {
            await instance[`add${upperKey}`](value.add, { transaction });
        } catch (err) {
            await transaction.rollback();
            throw createUserError(`Unknown${ upperKey}`,
                `Unable to associate ${instance.name} with provided ${upperKey}`);
        }
    }

    if (value.remove && value.remove.length > 0) {
        if (preventRemove) {
            throw createUserError('RemovedValueProhibited',
                `When creating a ${instance.name}, impossible to add removed value`);
        }

        try {
            await instance[`remove${upperKey}`](value.remove, { transaction });
        } catch (err) {
            await transaction.rollback();
            throw createUserError(`Unknown${upperKey}`,
                `Unable to associate ${instance.name} with provided ${upperKey}`);
        }
    }
}

/**
 * Parse start and end date from query.
 *
 * Will throw if one is missing and if start > end
 *
 * @param query
 * @returns {{start: Date, end: Date}}
 */
function parseStartAndEnd(query) {
    if (!query.start || !query.end) {
        throw createUserError('BadRequest', '\'start\' & \'end\' query parameters are required');
    }

    const start = new Date(+query.start);
    const end = new Date(+query.end);

    if (start > end) {
        throw createUserError('BadRequest', '\'start\' parameter must be inferior to \'end\' parameter');
    }

    return { start, end };
}

module.exports = {
    cleanObject,
    setEmbeddedAssociations,
    parseStartAndEnd,
};
