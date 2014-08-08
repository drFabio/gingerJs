module.exports={
	parent:'ginger.bootstraps.Element',
	_defaultEngineNamespace:'ginger.components',
	_defaulAppNamespace:'components',
	_configValue:'components',
	init : function(engine,params) {
		this._objectList={};
		this._super(engine,params);
		var config=this._engine._config.components;
		this._config={}
		for(var x in config){
			this._config[x.toLowerCase()]=config[x];
		}
	},
	isLoaded:function(name){
		name=name.toLowerCase();
		return !!this._objectList[name];
	},
	isCancelled:function(name){
	name=name.toLowerCase();
	   if(this._config && this._config[name] === false) {
	        return true;
	    }
	    return false;
	},
	create:function(name,params){
		if(this.isCancelled(name)){
			console.log("COMPOENENTE "+name+" ESTA CANCELADO");
			return false;
		}
		if(this.isLoaded(name)){
			name=name.toLowerCase();
			return this._objectList[name];
		}
		var component=this._super(name,params);
		name=name.toLowerCase();
		this._objectList[name]=component;
		return component;
	}
}