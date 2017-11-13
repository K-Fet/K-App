/**
 * Return a 403 if the user is not authenticated.
 * Else pass through
 *
 * @param req Request
 * @param res Response
 * @param next Next function
 * @returns {*}
 */
function authGuard(req, res, next) {
    // TODO Check jwt
    return next();
}

module.exports = authGuard;
