module.exports={
	_app:null,
	_expressComponent:null,
	
	init: function(engine,params) {
		this._super(engine,params);
	},
	start:function(cb){
		this._initExpress();
		this._super(cb);
	},
	_initExpress:function(){
		var self=this;
		var express=this._engine.getComponent('Express');
		if(!express){
			throw new Error('The express component is required to run the HTTP gateway');
		}
		self._expressComponent=express;
		self._app=self._expressComponent.getApp();

	},
}