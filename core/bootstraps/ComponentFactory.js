/**
 * @todo clean code especially config part
 */
module.exports={
	parent:'ginger.bootstraps.Element',
	_defaultEngineNamespace:'ginger.components',
	_defaulAppNamespace:'components',
	_defaultEngineParent:'ginger.components.Default',
	_defaultAppParent:'ginger.components.Default',
	_configValue:'components',
	init : function(engine,params) {
		this._objectList={};
		this._initializedMap={};
		this._super(engine,params);
		var config=this._engine._config.components;
		this._config={}
		for(var x in config){
			this._config[x.toLowerCase()]=config[x];
		}
	},
	_getConfig:function(){
		var config=this._engine.getConfigValue('components');
		var retConfig={}
		for(var x in config){
			retConfig[x.toLowerCase()]=config[x];
		}
		return retConfig;
	},
	isLoaded:function(name){
		name=name.toLowerCase();
		return !!this._objectList[name];
	},
	isCancelled:function(name){
		name=name.toLowerCase();
		var config=this._getConfig();
	   if(config && config[name] === false) {
	        return true;
	    }
	    return false;
	},
	create:function(name,params){
		if(this.isCancelled(name)){
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
	},
	isComponentInitialized:function(name){
		name=name.toLowerCase();
		return !!this._initializedMap[name];
	},
	initializeComponents:function(names){
		var self=this;
		names.forEach(function(n){
			self.initialize(n);
		});
	},
	initialize:function(name,params){
		if(this.isComponentInitialized(name)){
			return true;
		}
		var component=this.create(name,params);
		if(!component ){
			return false;
		}
		name=name.toLowerCase();
		var func=component.up.bind(component);
		this._engine.addFunctionToLaunchQueue(func);
		this._initializedMap[name]=true;
		return true;
	}
}