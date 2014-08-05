module.exports={
	_app:null,
	_expressComponent:null,
	
	init: function(engine,params,cb) {
		this._configParams(engine,params);
		var self=this;
		var expressCb=function(err,express){
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
	_buildRoute:function(controllerIndex,action,controllerData){
		var prefix=this._params.prefix || '';
		var url=controllerData.url+'/'+action;
		if(prefix){
			url='/'+prefix+url;
		}
		var actionFunction=controllerData.actions[action];
		this._addRouteToApp(url,controllerData,actionFunction);
		
	},
	end:function(cb){
		this._expressComponent.end();
		cb();
	},
	_addRouteToApp:function(url,controllerData,actionFunction){
		var controllerObject=controllerData['object'];
		var controllerFunc=controllerObject[actionFunction].bind(controllerObject);
		
		this._app.get(url,controllerFunc);
	}
}