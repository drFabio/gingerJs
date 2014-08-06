var async=require('async');
module.exports={
	parent:'ginger.bootstraps.Element',
	_defaultEngineNamespace:'ginger.gateways',
	_defaulAppNamespace:'gateways',
	_configValue:'gateways',
	_defaultEngineParent:'ginger.gateways.AbstractGateway',
	_objectList:{},
	init : function(engine,params) {
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

	finishAllGateways:function(cb){
	    var keys = Object.keys(this._objectList);
	    var self = this;

	    var endCb = function (err) {
	        if (err) {
	            cb(err);
	            return;
	        }
	        endNextGateway();

	    }
	    var endNextGateway = function () {
	        var k = keys.shift();
	        if (!k) {
	            cb();
	            return;
	        }
	        try {
	            self._objectList[k].end(endCb);
	        } catch (err) {
	            endCb(err);
	        }

	    }
	    endNextGateway();
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