var User      = require('models/user');
var AuthErr   = require('lib/errors').AuthError;
var HttpError = require('lib/errors').HttpError;

exports.get = function(req, res, next) {
    res.render('login');
};

exports.post = function(req, res, next) {
    User.authorize(
        req.body.username,
        req.body.password,
        function(err, user) {
            if (err) {
                if (err instanceof AuthErr) {
                    return next(new HttpError(403, err.message));
                } else {
                    return next(err);
                }
            }

            req.session.user = user._id;
            res.send({})
        }
    )
};
