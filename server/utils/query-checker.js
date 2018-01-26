/**
 * Check if the data object has the wanted structure.
 *
 * Will return false if the data is null or undefined
 *
 * @param data {Object} Object to check
 * @param requiredParams {Array<string>} Array of field names
 * @return {boolean} True if the structure is good, false otherwise
 */
function checkStructure(data, requiredParams) {
    if (!data) return false;
    return requiredParams.every(p => !!data[p]);
}

module.exports = {
    checkStructure
};
