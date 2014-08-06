module.exports={
	parent:'ginger.gateways.HTTP',
	_buildUrl:function(name,action){
		return '/'+name.replace(/\./g,'/');
	},
	_buildRoute:function(controllerName,action,controllerData){
	},
	_addRouteToApp:function(action,url,controllerObj,controllerData){
		var actionFunction=controllerData.actions[action];
		var controllerFunc=controllerObj[actionFunction].bind(controllerObj);
		this._app.post(url,controllerFunc);
	}
}