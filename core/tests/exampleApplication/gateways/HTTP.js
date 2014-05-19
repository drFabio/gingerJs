var HTTP={
	_buildRoute:function(controllerIndex,action,controllerData){
		action+='abc';
		this._super(controllerIndex,action,controllerData);
	},
	//var to check on the test if it was overwritten
	iAmOverwritten:true,
	init:function(ginger,params,cb){
		this._super(ginger,params,cb);
	}
}
module.exports={
	factory:function(ginger,params,cb){
		var objClass=ginger.getGingerGatewayClass('HTTP').extend(HTTP);
		return new objClass(ginger,params,cb);
	}
}