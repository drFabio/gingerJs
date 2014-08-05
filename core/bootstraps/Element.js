module.exports={
	parent:'ginger.bootstraps.Default',
	_defaultParentNamespace:'ginger',
	_defaulAppNamespace:'',
	_configValue:null,
	_isSingleton:true,
	_defaultParent:null,
	_defaultAppParent:null,
	_isLazy:false,
	_indexedByName:true,
	init : function(engine,params) {
		this._super(engine,params);
		this._nameMap={};
	},
	addNamespace:function(namespace,path){
		if(namespace){
			namespace=this._buildNamespace(this._defaulAppNamespace,namespace);
		}
		else{
			namespace=this._defaulAppNamespace;
		}
		this._classFactory.setNamespaceDir(namespace,path);
	},
	setAppClass:function(name,path,parentNamespace,fullNamespace){
	    var defaultParent=null;
	    name=this._buildNamespace(parentNamespace,name);
		var appNamespace=this._buildNamespace(this._defaulAppNamespace,name);

	    if(this.hasDefaultParent()){
			if(this._defaultParentNamespace){

			    var engineName=this._defaultParentNamespace+'.'+name;
			 	if(this._classFactory.classFileExists(engineName)){
					if(!this._classFactory.isClassSet(engineName)){
			    		this.setEngineClass(name);
			    	}
			 		defaultParent=engineName;
			 	}
			}
			else if(this._defaultAppParent){
				defaultParent=this._defaultAppParent;
			}
	    }
	 	var POJO;
	 	if(path){

			POJO=this._getPojo(path,defaultParent);
	 	}
	 	else{
	 		POJO=this._classFactory.getClassFileContents(fullNamespace);
	 		POJO=this._setDefaultParentOnPOJO(pojo,defaultParent);

	 	}

		this._classFactory.setClassFromPojo(appNamespace,POJO);
	 	this._addToIndex(name,appNamespace,true);
	 
		return appNamespace;
	},
	_buildIndexData:function(name,namespace,isApp,isEngine){
		return {name:namespace,isApp:!!isApp,isEngine:!!isEngine};
	},
	_addToIndex:function(name,namespace,isApp,isEngine){
		if(this._indexedByName){
			if(isApp || !this.hasElement(name)){

				name=name.toLowerCase();
	 			this._nameMap[name]=this._buildIndexData(name,namespace,isApp,isEngine);
				
			}
	 	}
	},
	hasDefaultParent:function(){
		return !!this._defaultParentNamespace || !!this._defaultAppParent;
	},
	hasElement:function(name){
		name=name.toLowerCase();
		return !!this._nameMap[name];
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
		this._addToIndex(name,engineName,false,true);
		this._classFactory.setClassFromPojo(engineName,pojo);
		return engineName;
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
	_getNameMap:function(name){
		name=name.toLowerCase();
		return this._nameMap[name];

	},
	_getNamespaceFromName:function(name){
		if(this._indexedByName && this.hasElement(name)){
			return this._getNameMap(name);
		}
	    var appName=this._defaulAppNamespace+'.'+name;
        if(this._classFactory.classFileExists(appName)){
        	return {name:appName,isApp:true,isEngine:false};
        }
        var engineName;
        if(this.hasDefaultParent){
		    engineName=this._defaultParentNamespace+'.'+name;
			if(this._classFactory.classFileExists(engineName)){
				return {name:engineName,isApp:false,isEngine:true};
			}
        	
        }
		if(this._classFactory.classFileExists(name)){
			return {name:name,isApp:false,isEngine:false};
		}
		var errorMsg='The object '+name+' could not be found searched in , '+appName;
		if(this.hasDefaultParent()){
			errorMsg+=' and '+engineName;
		}
		throw new Error(errorMsg);
	},

	create : function (name, var_args) {
		var namespaceData=this._getNamespaceFromName(name);
	
		var namespace=namespaceData.name;
		//If is configurable the first argument is the parasm from the config
		if(this.isConfigurable()){
	    	var params=this._getParams(name,arguments[1]);
	    	arguments[1]=params;
		}
		

	    if(this._classFactory.classFileExists(namespace)){
	        if(!this._classFactory.isClassSet(namespace)){
	        	if(namespaceData.isApp){
	   				this.setAppClass(name,null,null,namespace);
	        	}
	        	else if(namespaceData.isEngine){
	        		this.setEngineClass(name,null,null,namespace);
	        	}
	   		}
   			arguments[0]=namespace;
   			return  this._getObject.apply(this,arguments);
	    }
	   
	    else{
		    if(this._debugGateway){

				console.log(name+" é falso");
			}
	        return false;
	    }

	}
}