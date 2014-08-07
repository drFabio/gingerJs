module.exports={
	parent:'ginger.bootstraps.Default',
	_defaultEngineNamespace:null,
	_defaulAppNamespace:null,
	_configValue:null,
	_isSingleton:true,
	_defaultEngineParent:null,
	_defaultAppParent:null,
	_isLazy:false,
	/**
	 * Whether if this behaves as a name index to the app element OR the framework element as fallback
	 * @type {Boolean}
	 */
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
	setEmptyAppClass:function(name,parent){
		if(!parent){
			parent=this._defaultAppParent;
		}
		var pojo={
			parent:parent
		}
		var appNamespace=this._buildNamespace(this._defaulAppNamespace,name);
		this._addToIndex(name,appNamespace,POJO,true);
		return appNamespace;

	},
	setAppClass:function(name,path,parentNamespace,fullNamespace){

	    var defaultParent=null;
	    name=this._buildNamespace(parentNamespace,name);

	    if(this.hasDefaultParent()){
			if(this._defaultEngineNamespace){

			    var engineName=this._defaultEngineNamespace+'.'+name;
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
	 		POJO=this._setDefaultParentOnPOJO(POJO,defaultParent);
	 	}

		var appNamespace=this._buildNamespace(this._defaulAppNamespace,name);
	 	this._addToIndex(name,appNamespace,POJO,true);
	 
		return appNamespace;
	},
	_buildIndexData:function(name,namespace,POJO,isApp,isEngine){
		return {namespace:namespace,isApp:!!isApp,isEngine:!!isEngine,pojo:POJO,name:name};
	},
	_setClassOnNamespace:function(namespace,POJO){

		this._classFactory.setClassPojo(namespace,POJO);
	},
	_addToIndex:function(name,namespace,POJO,isApp,isEngine){
		this._setClassOnNamespace(namespace,POJO);
		if(this._indexedByName){
			if(isApp || !this.hasElement(name)){
					 
				name=name.toLowerCase();
	 			this._nameMap[name]=this._buildIndexData(name,namespace,POJO,isApp,isEngine);
			}
		
	 	}
	},
	hasDefaultParent:function(){
		return !!this._defaultEngineNamespace || !!this._defaultAppParent;
	},
	hasElement:function(name){
		name=name.toLowerCase();
		return !!this._nameMap[name];
	},
	setEngineClass:function(name){
		var engineName=this._defaultEngineNamespace+'.'+name;
		if(!this._classFactory.classFileExists(engineName)){
			return false;
		}
		var POJO=this._classFactory.getClassFileContents(engineName);
		var defaultParent=this._defaultEngineParent;
		if(engineName==this._defaultEngineParent){
			defaultParent=null;
		}
		POJO=this._setDefaultParentOnPOJO(POJO,defaultParent);
		this._addToIndex(name,engineName,POJO,false,true);
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
	changeObjectParent:function(name,newParent){
		var element=this.getElementByName(name);
		var namespace=element.namespace;
		var pojo=this._classFactory.getClassPojo(namespace);
		if(typeof(pojo)!='Object'){
			throw new Error(name+' was not found!');
		}
		pojo.parent=newParent;
		element.pojo=pojo;
		this._overwrideElementData(name,element);
		this._classFactory.setClassPojo(namespace,pojo,true);
	},
	_overwrideElementData:function(name,data){
		var name=name.toLowerCase();
		this._nameMap[name]=data;
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
	_getNameMap:function(){
		return this._nameMap;
	},
	getElementByName:function(name){
		name=name.toLowerCase();
		return this._nameMap[name];

	},
	_getNamespaceDataFromName:function(name){
		if(this._indexedByName && this.hasElement(name)){
			return this.getElementByName(name);
		}
	    var appName=this._defaulAppNamespace+'.'+name;
        if(this._classFactory.classFileExists(appName)){
        	return {name:name,namespace:appName,isApp:true,isEngine:false};
        }
        var engineName;
        if(this.hasDefaultParent){
		    engineName=this._defaultEngineNamespace+'.'+name;
			if(this._classFactory.classFileExists(engineName)){
				return {name:name,namespace:engineName,isApp:false,isEngine:true};
			}
        	
        }
		if(this._classFactory.classFileExists(name)){
			return {name:name,namespace:name,isApp:false,isEngine:false};
		}
		var errorMsg='The object '+name+' could not be found searched in , '+appName;
		if(this.hasDefaultParent()){
			errorMsg+=' and '+engineName;
		}
		throw new Error(errorMsg);
	},

	create : function (name, var_args) {
		var namespaceData=this._getNamespaceDataFromName(name);
		var namespace=namespaceData.namespace;
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
   			return this._getObject.apply(this,arguments);
	    }
	    else{
			
	        return false;
	    }

	}
}