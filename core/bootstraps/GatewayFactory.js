module.exports={
	parent:'ginger.bootstraps.Element',
	_defaultParentNamespace:'ginger.gateways',
	_defaulAppNamespace:'gateways',
	_configValue:'gateways',
	_defaultParent:'ginger.gateways.AbstractGateway',
	_debugGateway:true,
	create:function(name,params,cb){
		var ret=this._super(name,params,cb);
		if(!ret){
			console.log(this._nameMap);
			console.log(this.hasElement(name));
			console.log(name+" É VAZIO ! ");
			cb();
		}
	}
}