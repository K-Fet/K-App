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
                `Unable to associate ${instance.name} with provided kommissions`);
        }
    }
}


module.exports = {
    cleanObject,
    setEmbeddedAssociations,
};
