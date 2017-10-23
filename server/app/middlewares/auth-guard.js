function authGuard(req, res, next) {
    // TODO Check jwt
    return next();
}

module.exports = authGuard;
