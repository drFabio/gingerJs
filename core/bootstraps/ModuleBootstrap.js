module.exports={
	parent:'ginger.bootstraps.MVCBootstrap',
	addToEngine:function(name,path,parentNamespace){
		var mapIndex=this.buildMapIndex(name,parentNamespace);
		this._engine.setModule(mapIndex);
	}

}