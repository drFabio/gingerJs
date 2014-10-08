module.exports={

	_engine:null,
	
	init: function(engine) {
		this._engine=engine;
	},
	getModel:function(name){
		return this._engine.getModel(name);
	}
};