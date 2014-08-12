var passport = require('passport');
module.exports = {
    getMiddleware: function(controllerObj, gateway) {
        var self = this;
        return function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
                if (err) {
                	var internal=self._engine.getError('Internal', 'A error ocurred while checking user');
                    res.send(internal);

                    return;
                }
                if (!user) {
                	var forbidden=self._engine.getError('Forbidden', 'You have to be logged in to access this area ');

                    res.send(forbidden);
                    return;
                }
                req.logIn(user, function(err) {
                	var internal=self._engine.getError('Internal', 'A error ocurred while login the user');
                    if (err) {
                        res.send(internal);
                        return;
                    }
                    next();
                });
            })(req, res, next);
        }
    }
};