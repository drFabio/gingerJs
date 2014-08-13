module.exports= {
	init:function(engine,params) {
		this._engine=engine;
		this._params=params;
	},
	up:function(cb){
		cb();
	}
};