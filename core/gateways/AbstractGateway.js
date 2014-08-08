module.exports={
	_engine:null,
	_controllerFactory:null,
	_params:null,
	init: function(engine,params) {
		this._configParams(engine,params);

	},
	start:function(cb){
		this.buildRoutes();
		cb();
	},
	_configParams:function(engine,params){
		this._controllerFactory=engine.getBootstrap('ControllerFactory');
		this._engine=engine;
		this._params=params;
	},
	end:function(cb){
		cb();
	},
	_handleControllerRoutes:function(controllerData){
		
	},
	_createController:function(controllerData){
		return this._controllerFactory.create(controllerData.name,this._engine);
	},
	buildRoutes:function(cb) {
		var controllerList=this._controllerFactory._getNameMap();
		for(var index in controllerList){
			this._handleControllerRoutes(controllerList[index]);
		}
	}
}