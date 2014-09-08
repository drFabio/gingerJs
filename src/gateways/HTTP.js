module.exports={
	_app:null,
	_expressComponent:null,
	
	init: function(engine,params,cb) {
		this._configParams(engine,params);
	},
	_sendError:function(req,res,error){

	}
}