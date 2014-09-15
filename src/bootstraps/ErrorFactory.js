module.exports={
	parent:'ginger.bootstraps.Element',
	_defaultEngineNamespace:'ginger.errors',
	_defaulAppNamespace:'errors',
	_configValue:'errors',
	_defaultEngineParent:'ginger.errors.Default',
	_isSingleton:false,
	_getObject:function(name,message,code,data){
	
		return this._classFactory.createObject(name,message,code,data);
	}

}