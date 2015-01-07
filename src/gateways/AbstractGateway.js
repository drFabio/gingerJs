var _=require('lodash');
module.exports={
	_engine:null,
	_controllerFactory:null,
	_params:null,
	_name:null,

	init: function(engine,params) {
		this._configParams(engine,params);
		this._log=engine.getComponent('Log');
		this._authorization=engine.getComponent('Authorization');
	},
	start:function(cb){
		this._initExpress();
		this.buildRoutes();
		cb();

	},
	_getRouterHandlerComponent:function(){
		return this._engine.getRouterHandler('Default');

	},
	_configParams:function(engine,params){
		this._controllerFactory=engine.getBootstrap('ControllerFactory');
		this._engine=engine;
		this._params=params;
		this._routerHandlerComponent=this._getRouterHandlerComponent();
	},
	end:function(cb){
		cb();
	},
	_handleControllerRoutes:function(controllerData){
		var controllerObj=this._createController(controllerData);
		var actions=controllerObj.getActions();
		for(var x in actions){
			this._handleControllerAction(x,controllerObj,controllerData);
		}
	},
	_handleControllerAction:function(action,controllerObj,controllerData){
		var prefix=this._params.prefix || '';

		var url=this._routerHandlerComponent.buildUrl(prefix,controllerData.name,action);
		this._addRouteToApp(action,url,controllerObj,controllerData);
		
	},
	_createController:function(controllerData){
		return this._controllerFactory.create(controllerData.name,this._engine);
	},
	buildRoutes:function(cb) {
		var controllerList=this._controllerFactory._getNameMap();
		for(var index in controllerList){
			this._handleControllerRoutes(controllerList[index]);
		}
	},
	_getHTTPVerb:function(routeVerb){
		if(routeVerb){
			return routeVerb;
		}
		return 'get';
	},	
	_getDefaultMiddlewares:function(){
		return [];
	},
	_addRouteToApp:function(action,url,controllerObj,controllerData){
		var routeData=this._routerHandlerComponent.getRouteData(controllerData.name,action);
		var verb=this._getHTTPVerb(routeData.verb);
		var middlewares=this._getDefaultMiddlewares();
		var self=this;
		var controllerFunction=this._getControllerFunction(controllerData.name,action,controllerObj);
		if(routeData.middlewares){
			middlewares=middlewares.concat(routeData.middlewares);
		} 
		if(middlewares.length==0){	
			this._app[verb](url,function(req,res){	
			controllerFunction(req,res);
			});
			
		}
		else{
			var argsToAdd=[url];
			middlewares.forEach(function(m){
				var middleware=this._engine.getComponent('middleware.'+m);
				argsToAdd.push(middleware.getMiddleware(controllerObj,self,controllerData));
			},this);

			argsToAdd.push(controllerFunction);
			this._app[verb].apply(this._app,argsToAdd);
		}
	},

	_sendError:function(req,res,error){
        res.send(error);
    },
    _canUserAccessAction:function(req,res,controller,action,cb){
    	this._authorization.isUserAllowed(req.user,req,controller,action,cb);
    },
    _getControllerFunction:function(controller,action,controllerObj){
    	var actionFunctionName=controllerObj.getActionFunctionByName(action);
        var actionFunction=controllerObj[actionFunctionName].bind(controllerObj);
		var self=this;
		
		return function(req,res){
			try{
				self._canUserAccessAction(req,res,controller,action,function(err,canAccess){
						if(err){
							self._sendError(req,res,err);
							return;
						}
						actionFunction(req,res);
				});
			}
			catch(err){
				self._sendError(req,res,err)
			}
		}
	},
	_initExpress:function(){
		var self=this;
		var express=this._engine.getComponent('Express');
		if(!express){
			throw new Error('The express component is required to run the HTTP gateway');
		}
		self._expressComponent=express;
		self._app=self._expressComponent.getApp();

	}
}