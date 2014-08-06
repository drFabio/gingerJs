module.exports={
	_app:null,
	_expressComponent:null,
	
	init: function(engine,params,cb) {
		this._configParams(engine,params);
	},
	start:function(cb){
		var self=this;
		this._initExpress(function(err){
			if(err){
				cb(err);
			}
			self.buildRoutes();
			cb();
		});
	},
	_buildUrl:function(name,action){
		return url=name.replace('.','/')+'/'+action;
	},
	_initExpress:function(cb){
		var self=this;
		var expressCb=function(err,express){
			if(err){
				cb(err);
			}
			if(!express){
				throw new Error('The express component is required to run the HTTP gateway');
			}
			self._expressComponent=express;
			self._app=self._expressComponent.getApp();
			self._expressComponent.listen(function(err){
				cb(err,self);
			});
		}
		this._engine.getComponent('Express',expressCb);
	},
	_handleControllerRoutes:function(controllerData){
		var controllerObj=this._createController(controllerData);
		for(var x in controllerData.actions){
			this._handleControllerAction(x,controllerObj,controllerData);
		}
	},
	_handleControllerAction:function(action,controllerObj,controllerData){
		var prefix=this._params.prefix || '';
		var url=this._buildUrl(controllerData.name,action);
		if(prefix){
			url='/'+prefix+url;
		}

		this._addRouteToApp(action,url,controllerObj,controllerData);
		
	},
	end:function(cb){
		this._expressComponent.end();
		cb();
	},
	_addRouteToApp:function(action,url,controllerObj,controllerData){
		var actionFunction=controllerData.actions[action];
		var controllerFunc=controllerObj[actionFunction].bind(controllerObj);
		this._app.get(url,controllerFunc);
	}
}