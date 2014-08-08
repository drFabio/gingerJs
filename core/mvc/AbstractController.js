module.exports={
	init: function(engine) {
		
		this._engine=engine;
		this._initializeModel();
	},
	_initializeModel:function(){
		if(this._engine.hasModel(this.modelName)){
			this._model=this._engine.getModel(this.modelName);
		}

	},
	getModel:function(){
		return this._model;
	},
	getActions:function(engine){
		return this._actions;
	}
};