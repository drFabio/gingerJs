module.exports={
	parent:'ginger.bootstraps.Element',
	_defaultEngineNamespace:'ginger.gateways',
	_defaulAppNamespace:'gateways',
	_configValue:'gateways',
	_defaultEngineParent:'ginger.gateways.AbstractGateway',
	_objectList:{},
	create:function(name,params){
		
		var gateway=this._super(name,params);
		this._objectList[name]=gateway;
		return gateway;
	},
	getGateway:function(name){
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
	}
}