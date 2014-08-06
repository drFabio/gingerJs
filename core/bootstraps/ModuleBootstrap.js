module.exports={
	/**
	 * @todo clean clode
	 * @type {String}
	 */
	parent:'ginger.bootstraps.Default',
	addToEngine:function(name,path,parentNamespace){
		var mapIndex=this.buildMapIndex(name,parentNamespace);
		this._engine.setModule(mapIndex);
	},
	buildMapIndex:function(name,parentNamespace){
		var saneName=this.sanitizeName(name);
		var mapIndex;
		if(parentNamespace){
			mapIndex= parentNamespace.replace('.','/')+'/'+saneName;
		}
		else{
			mapIndex=saneName;
		}	
		return mapIndex;
	}

}