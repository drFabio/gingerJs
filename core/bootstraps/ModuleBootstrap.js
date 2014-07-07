module.exports={
	parent:'ginger.bootstraps.MVCBootstrap',
	addToEngine:function(name,path,parentNamespace){
		var mapIndex=this.buildMapIndex(name,parentNamespace);
		console.log('setando o modulo '+mapIndex);
		this._engine.setModule(mapIndex);
	}

}