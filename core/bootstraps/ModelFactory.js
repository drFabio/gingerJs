module.exports={
	parent:'ginger.bootstraps.MVCBootstrap',
	addToEngine:function(name,path,parentNamespace){
		var	modelPOJO=this._getPojo(path,'ginger.mvc.AbstractModel');
		var modelNamespace=this._buildNamespace(parentNamespace,'models.'+name);
		this._classFactory.setClassFromPojo(modelNamespace,modelPOJO);
		var modelObject=this._classFactory.getSingletonObject(modelNamespace,this);
		var mapIndex=this.buildMapIndex(name,parentNamespace);
		this._engine.setModel(mapIndex,{
			'modules':parentNamespace,
			'object': modelObject
		});
	}
}