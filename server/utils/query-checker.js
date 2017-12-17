/**
 * Check if the data object has the wanted structure.
 *
 * @param data {Object} Object to check
 * @param requiredParams {Array<string>} Array of field names
 * @return {boolean} True if the structure is good, false otherwise
 */
function checkStructure(data, requiredParams) {
    return requiredParams.every(p => !!data[p]);
}

module.exports = {
    checkStructure
};
