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
		var defaultParent=this._defaultParent;
		if(engineName==this._defaultParent){
			defaultParent=null;
		}
		pojo=this._setDefaultParentOnPOJO(pojo,defaultParent);
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
	_getObject:function(name,var_args){
		var newArgs=[];
		newArgs.push(name);
		//By default all objects have the engine as the first argument
		arguments[0]=this._engine;
		for(var x in arguments){
			newArgs.push(arguments[x]);
		}
		var classFactory=this._classFactory;
		if(this._isSingleton){
	       return  classFactory.getSingletonObject.apply(classFactory,newArgs);
		}
		return classFactory.createObject.apply(classFactory,newArgs);
	},
	isConfigurable:function(){
		return !! this._configValue;
	},
	create : function (name, var_args) {
		//If is configurable the first argument is the parasm from the config
		if(this.isConfigurable()){
	    	var params=this._getParams(name,arguments[1]);
	    	arguments[1]=params;
		}
	    var appName=this._defaulAppNamespace+'.'+name;
	    var engineName=this._defaultParentNamespace+'.'+name;
	    //First let's check if the namespace of compoennts is set
	    if(this._classFactory.classFileExists(appName)){
	        if(!this._classFactory.isClassSet(appName)){
	   			this.setAppClass(appName);
	   		}
   			arguments[0]=appName;
   			return  this._getObject.apply(this,arguments);
	    }
	    else if(this._classFactory.classFileExists(engineName)){
	    	if(!this._classFactory.isClassSet(engineName)){
	    		this.setEngineClass(name);
	    	}
	    	arguments[0]=engineName;
	       return this._getObject.apply(this,arguments);

	    }
	    else{
	        cb();
	        return;
	    }

	}
}