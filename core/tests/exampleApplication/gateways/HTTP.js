var HTTP={
	'parent':'ginger.gateway.HTTP',
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
