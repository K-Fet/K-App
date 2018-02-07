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


module.exports = {
    cleanObject
};
