module.exports={
	parent:'ginger.bootstraps.Element',
	_defaultEngineNamespace:'ginger.gateways',
	_defaulAppNamespace:'gateways',
	_configValue:'gateways',
	_defaultEngineParent:'ginger.gateways.AbstractGateway',
	create:function(name,params,cb){
		
		var ret=this._super(name,params,cb);
		if(!ret){
			cb();
		}
	}
}