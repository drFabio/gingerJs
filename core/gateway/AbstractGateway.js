module.exports={
	_engine:null,
	_params:null,
	init: function(engine,params,cb) {
		console.log(engine);
		console.log(params);
		console.log(cb);
		
		this._configParams(engine,params);
		cb(null,this);

	},
	_configParams:function(engine,params){
		this._engine=engine;
		this._params=params;
	},
	end:function(cb){
		cb();
	},
	buildRoutes:function(cb) {
		for(var index in this._engine.controllerMap){
			var controllerData=this._engine.controllerMap[index];
			for(action in controllerData.actions){
				/**
				 * Invoking the _buildRoute function of the child
				 */
			    this._buildRoute(index,action,controllerData);
			}
		}
		cb();
	}
}