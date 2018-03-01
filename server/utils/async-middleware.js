/**
 * Tricky function to catch all errors off an async function...
 * You can see more here : https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
 *
 * @param fn Take the middleware function
 * @return {function(req, res, next): Promise} Promise which will fail if async function fails
 */
module.exports = function am(fn) {
    return (req, res, next) =>
        Promise
            .resolve(fn(req, res, next))
            .catch(next);
};
