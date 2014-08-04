module.exports={
	parent:'ginger.bootstraps.Default',
	addToEngine:function(name,path,parentNamespace){
		var mapIndex=this.buildMapIndex(name,parentNamespace);
		this._engine.setModule(mapIndex);
	}

}