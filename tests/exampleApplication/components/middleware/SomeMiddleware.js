module.exports= {
    getMiddleware: function(controllerObj,gateway) {
    	return function(req, res, next) {
    		next(req,res);
    	}
    }
};