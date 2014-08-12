var passport = require('passport');
module.exports = {
    getMiddleware: function(controllerObj, gateway) {
        var self = this;
        return function(req, res, next) {
        	 if (req.isAuthenticated()) { return next(); }
    	 	var forbidden=self._engine.getError('Forbidden', 'You have to be logged in to access this area ');

            res.send(forbidden);
            return;
        }
    }
};