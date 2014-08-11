var _=require('lodash');
module.exports={
	_engine:null,
	_controllerFactory:null,
	_params:null,
	_name:null,
    _defaultMiddlewares:[],

	init: function(engine,params) {
		this._configParams(engine,params);

	},
	start:function(cb){
		this._initExpress();
		this.buildRoutes();
		cb();

	},
	_getRouterHandlerComponent:function(){
		return this._engine.getComponent('RouterHandler');

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
	_addRouteToApp:function(action,url,controllerObj,controllerData){
		var actionFunction=controllerObj.getActionFunctionByName(action);
		var routeData=this._routerHandlerComponent.getRouteData(controllerData.name,action);
		var verb=this._getHTTPVerb(routeData.verb);
		var middlewares=this._defaultMiddlewares;
		if(routeData.middlewares){
			middlewares=middlewares.concat(routeData.middlewares);
		} 
		if(middlewares.length==0){
			this._app[verb](url,function(req,res){
				controllerObj[actionFunction](req,res);
			});
			
		}
		else{
			var args=middlewares;
			args.unshift(url);
			args.push(function(req,res){
				controllerObj[actionFunction](req,res);
			});
			this._app[ver].apply(this._app,args);
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