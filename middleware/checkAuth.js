var HttpError = require('lib/errors').HttpError;

module.exports = function(req, res, next) {
    if (!req.session.user) {
        return next(new HttpError(401, "You are not authorized"));
    }

    next();
};
