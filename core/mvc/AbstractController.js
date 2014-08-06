module.exports={
	init: function(engine) {
		
		this._engine=engine;
	},
	getActions:function(engine){
		return this._actions;
	}
};