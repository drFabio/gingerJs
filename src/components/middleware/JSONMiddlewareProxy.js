var async=require('async');
/**
 * Makes the role of a middleware stack for JSON RPC
 * @type {Object}
 */
module.exports = {
    getMiddleware: function(controllerObj, gateway,controllerData) {
    	var getComponent=this._engine.getComponent.bind(this._engine);
    	return function(req,res,next){
    		var action=req.jsonRPC.method;
    		/**
    		 * @todo clean code to this middleware does'nt have to use _routerHandlerComponent directlry
    		 */
    		var middlewares=gateway._routerHandlerComponent.getRouteData(controllerData.name,action).middlewares;
    		if(middlewares.length==0){
    			next();
    			return;
    		}
    		var functionsToExecute=[];
    		var buildReqFunction=function(middleware){
				var middlewareFunc=middleware.getMiddleware(controllerObj,gateway,controllerData);
    			return function(cb){
    				middlewareFunc(req,res,cb);
    			};
    		}
			middlewares.forEach(function(m){
				var middleware=getComponent('middleware.'+m);
				functionsToExecute.push(buildReqFunction(middleware));
			},this);

    		async.series(functionsToExecute,function(err){
    			next(err);
    		});
    	}
    }
};