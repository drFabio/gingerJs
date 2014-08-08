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
		return '/'+name.replace(/\./g,'/')+'/'+action;
	},
	_initExpress:function(cb){
		var self=this;
		var express=this._engine.getComponent('Express');
		if(!express){
			throw new Error('The express component is required to run the HTTP gateway');
		}
		self._expressComponent=express;
		self._app=self._expressComponent.getApp();
		if(self._expressComponent.isRunning()){
			cb();
			return;
		}
		self._expressComponent.listen(function(err){
			cb(err,self);
		});
		
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
		var url=this._buildUrl(controllerData.name,action);
		if(prefix){
			url='/'+prefix+url;
		}
		this._addRouteToApp(action,url,controllerObj,controllerData);
		
	},
	end:function(cb){
		this._expressComponent.end();
		/**
		 * @todo  make the components handle it's lifecycle by themselves!
		 */
		var db=this._engine.getComponent('DataBase');
		if(db){
			db.end();
		}
		cb();
	},
	_addRouteToApp:function(action,url,controllerObj,controllerData){
		var actionFunction=controllerObj.getActionFunctionByName(action);
		this._app.get(url,function(req,res){
			controllerObj[actionFunction](req,res);
		});
	}
}