module.exports= {
	getMiddleware: function(controllerObj,gateway) {
		return function(req,res,next){
			if (req.isAuthenticated()) { 
				return next();
			}
			res.status(500).send('DEU MERDA AE');
		}
	}
};