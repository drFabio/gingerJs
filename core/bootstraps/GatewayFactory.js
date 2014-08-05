module.exports={
	parent:'ginger.bootstraps.Element',
	_defaultParentNamespace:'ginger.gateways',
	_defaulAppNamespace:'gateways',
	_configValue:'gateways',
	_defaultParent:'ginger.gateways.AbstractGateway',
	create:function(name,params,cb){
		var ret=this._super(name,params,cb);
		if(!ret){
			cb();
		}
	}
}