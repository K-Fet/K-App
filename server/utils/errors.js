/**
 * Create a new user error with a name and a message.
 * It will also add a `userError` field.
 *
 * @param name Name of the error
 * @param message Message for the error
 * @return {Error} Error
 */
function createUserError(name, message) {
    const e = new Error(message);
    e.name = name;
    e.userError = true;
    return e;
}

/**
 * Create a new server error with a name and a message.
 *
 * @param name Name of the error
 * @param message Message for the error
 * @return {Error} Error
 */
function createServerError(name, message) {
    const e = new Error(message);
    e.name = name;
    return e;
}


module.exports = {
    createUserError,
    createServerError,
};
