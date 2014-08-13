var async=require('async');
module.exports={
	parent:'ginger.bootstraps.Element',
	_defaultEngineNamespace:'ginger.gateways',
	_defaulAppNamespace:'gateways',
	_configValue:'gateways',
	_defaultEngineParent:'ginger.gateways.AbstractGateway',

	_defaultAppParent:'ginger.gateways.AbstractGateway',
	_debugGateway:true,
	init : function(engine,params) {
		this._objectList={};
		this._super(engine,params);
		this._gatewayConfig=this._engine._config.gateways;
	},
	create:function(name,params){
		
		var gateway=this._super(name,params);
		name=name.toLowerCase();
		this._objectList[name]=gateway;
		return gateway;
	},
	getGateway:function(name){
		name=name.toLowerCase();
		return this._objectList[name];
	},
	isGatewayLoaded:function(name){
		name=name.toLowerCase();
		return !!this._objectList[name];
	},
	isGatewayCancelled:function(name){
		   if(this._gatewayConfig && this._gatewayConfig[name] === false) {
		        return true;
		    }
		    return false;
	},
	getGatewaysRequiredComponents:function(){
		var config;
		var self=this;
		var required=[];
		for(var name in this._gatewayConfig){
			if(this.isGatewayCancelled(name)){
				continue;
			}
			config=this._gatewayConfig[name];
			if(!config.components){
				continue;
			}
			config.components.forEach(function(c){
				required.push(c);
			});

		}
		return required;
	},
	startGateways:function(cb){
		var asyncFunctions = [];
		var self = this;
		var funcToCreateGateway = function (name, params) {

			return function (asyncCb) {
				var gateway=self.create(name, params);
				if(self.isGatewayCancelled(name)){
				
				    asyncCb();
				}
				else{
				    gateway.start(asyncCb)
				}
			}
		}

		//Looping trough each gateway to create it assynchronously
		for (var name in this._gatewayConfig ) {
			if (this.isGatewayLoaded(name) || this.isGatewayCancelled(name)) {
				continue;
			}
			asyncFunctions.push(funcToCreateGateway(name, this._gatewayConfig[name]));
		}
		async.series(asyncFunctions, function (err, res) {
			cb(err);
		});
	},

}