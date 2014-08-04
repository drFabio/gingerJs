module.exports={
	parent:'ginger.bootstraps.Default',
	_defaultParentNamespace:'ginger',
	_defaulAppNamespace:'',
	_configValue:null,
	_isSingleton:true,
	_defaultParent:null,
	_isLazy:false,
	setAppClass:function(name,path,parentNamespace){
	    var engineName=this._defaultParentNamespace+'.'+name;
	    var defaultParent=null;
		var appNamespace=this._buildNamespace(parentNamespace,this._defaulAppNamespace+'.'+name);
	 	if(this._classFactory.classFileExists(engineName)){
			if(!this._classFactory.isClassSet(engineName)){
	    		this.setEngineClass(name);
	    	}
	 		defaultParent=engineName;
	 	}
	 	var POJO;
	 	if(path){

			POJO=this._getPojo(path,defaultParent);
	 	}
	 	else{
	 		POJO=this._classFactory.getClassFileContents(name);
	 		POJO=this._setDefaultParentOnPOJO(pojo,defaultParent);
	 	}
		this._classFactory.setClassFromPojo(appNamespace,POJO);
		return true;
	},

	setEngineClass:function(name){
		var engineName=this._defaultParentNamespace+'.'+name;
		if(!this._classFactory.classFileExists(engineName)){
			return false;
		}
		var pojo=this._classFactory.getClassFileContents(engineName);
		pojo=this._setDefaultParentOnPOJO(pojo,this._defaultParent);
		this._classFactory.setClassFromPojo(engineName,pojo);
		return true;
	},
	_getParams:function(name,params){
		 if(!params && this._configValue){
	        var values=this._engine.getConfigValue(this._configValue);
	        if(values[name]){
	            params=values[name];
	        }
	    }
	    return params;
	},
	_getObject:function(name,params,cb){
		if(this._isSingleton){
	       return  this._classFactory.getSingletonObject(name,this._engine,params,cb);
		}
		return this._classFactory.createComponent(name,this._engine,params,cb);
	},
	create : function (name, params,cb) {
	    params=this._getParams(name,params);
	    var appName=this._defaulAppNamespace+'.'+name;
	    var engineName=this._defaultParentNamespace+'.'+name;
	    //First let's check if the namespace of compoennts is set
	    if(this._classFactory.classFileExists(appName)){
	        if(this._classFactory.isClassSet(appName)){
	    	   return  this._getObject(appName,params,cb);
	   		}else{
	   			this.setAppClass(appName);
	   			return  this._getObject(appName,params,cb);
	   		}
	    }
	    else if(this._classFactory.classFileExists(engineName)){
	    	if(!this._classFactory.isClassSet(engineName)){
	    		this.setEngineClass(name);
	    	}
	       return this._getObject(engineName,params,cb);

	    }
	    else{
	        cb();
	        return;
	    }

	}
}