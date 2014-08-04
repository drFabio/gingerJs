module.exports={
	parent:'ginger.bootstraps.MVCBootstrap',
	_defaultParentNamespace:'ginger.errors';
	_defaulAppNamespace:'errors',
	_configValue:'errors',
	setAppClass:function(name,path,parentNamespace){
	    var engineName=this._defaultParentNamespace+'.'+name;s.
	    var defaultParent=null;
		var componentNamespace=this._buildNamespace(parentNamespace,this._defaulAppNamespace+'.'+name);
	 	if(this._classFactory.classFileExists(engineName)){
			if(!this._classFactory.isClassSet(engineName)){
	    		this.setEngineComponentClass(name);
	    	}
	 		defaultParent=engineName;
	 	}
		var componentPOJO=this._getPojo(path,defaultParent);
		this._classFactory.setClassFromPojo(componentNamespace,componentPOJO);
		return true;
	},
	setEngineClass:function(name){
		var engineName=this._defaultParentNamespace'.'+name;
		if(!this._classFactory.classFileExists(engineName)){
			return false;
		}
		var pojo=this._classFactory.getClassFileContents(engineName);
		pojo=this._setDefaultParentOnPOJO(pojo);
		this._classFactory.setClassFromPojo(engineName,pojo);
		return true;
	},
	_getParams:function(params){
		 if(!params){
	        var values=this._engine.getConfigValue(this._defaulAppNamespace);
	        if(values[name]){
	            params=values[name];
	        }
	    }
	    return params;
	},
	createComponent : function (name, params,cb) {
	    params=this._getParams(params);
	    var appName=this._defaulAppNamespace+'.'+name;
	    var engineName=this._defaultParentNamespace+'.'+name;
	    //First let's check if the namespace of compoennts is set
	    if(this._classFactory.isClassSet(appName)){
	       return  this._classFactory.getSingletonObject(appName,this._engine,params,cb);
	    }
	    else if(this._classFactory.classFileExists(engineName)){
	    	if(!this._classFactory.isClassSet(engineName)){
	    		this.setEngineClass(name);
	    	}
	       return this._classFactory.getSingletonObject(engineName,this._engine,params,cb);

	    }
	    else{
	        cb();
	        return;
	    }

	}
}