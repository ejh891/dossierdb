const boom = require('boom');

/**
 * wraps an async function in a catch block that automatically calls the next middleware when an error is thrown
 */
module.exports = (asyncFunction) => {
    return (req, res, next) => {
        Promise.resolve(asyncFunction(req, res, next)).catch((err) => {
            if (!err.isBoom) {
                return next(boom.badImplementation(err));
            }

            return next(err);
        });
    };
}
