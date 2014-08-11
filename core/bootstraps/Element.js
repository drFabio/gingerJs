var _=require('lodash');
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
		var POJO={
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
		}
		if(!POJO.parent){
			POJO=this._setDefaultParentOnPOJO(POJO,defaultParent);
			
		}

		var appNamespace=this._buildNamespace(this._defaulAppNamespace,name);
		this._addToIndex(name,appNamespace,POJO,true);
	 
		return appNamespace;
	},
	_buildIndexData:function(name,namespace,POJO,isApp,isEngine){
		return {namespace:namespace,isApp:!!isApp,isEngine:!!isEngine,pojo:POJO,name:name,isIndexed:true};
	},
	_setClassOnNamespace:function(namespace,POJO){
		this._classFactory.setClassPojo(namespace,POJO);
	},
	_addToIndex:function(name,namespace,POJO,isApp,isEngine){
		if(this._indexedByName){
			if(isApp || !this.hasElement(name)){
					 
				name=name.toLowerCase();
				this._nameMap[name]=this._buildIndexData(name,namespace,POJO,isApp,isEngine);
			}
			POJO=this._nameMap[name].pojo;	
		}
		this._setClassOnNamespace(namespace,POJO);
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
			throw new Error("The class "+engineName+" does not exist");
		}
		/**
		 * @todo  use isClassCreatable 
		 */
		if(this._classFactory.isClassPojoSet(engineName)){
			return engineName;
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
	_isParentTheDefault:function(parent){
		if(!this._defaultAppParent){
			return false;
		}
		if(this._defaultAppParent==parent){
			return true;
		}
		return false;

	},

	mergeObjectPojo:function(name,pojo){
		var element=this.getElementByName(name);
		var namespace=element.namespace;
		var originalPojo=this._classFactory.getClassPojo(namespace)
		pojo=_.extend(originalPojo, pojo) 
		element.pojo=pojo;
		this._overwrideElementData(name,element);
		this._classFactory.setClassPojo(namespace,pojo,true);
		return true;
	},
	changeObjectParent:function(name,newParent){
		var element=this.getElementByName(name);
		var namespace=element.namespace;
		var pojo=this._classFactory.getClassPojo(namespace)
		if(_.isEmpty(pojo)){
			throw new Error(name+' was not found!,searched on the '+namespace+'  namespace');
		}

		if(!this._isParentTheDefault(pojo.parent)){
			return false;
		}
		pojo.parent=newParent;
		element.pojo=pojo;
		this._overwrideElementData(name,element);
		this._classFactory.setClassPojo(namespace,pojo,true);
		return true;
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
		var askedName=name;
		var namespaceData=this._getNamespaceDataFromName(name);
		var namespace=namespaceData.namespace;
		//If is configurable the first argument is the parasm from the config
		if(this.isConfigurable()){
			var params=this._getParams(name,arguments[1]);
			arguments[1]=params;
		}
		arguments[0]=namespace;
	
		// if(this._classFactory.classFileExists(namespace) ){
			if(!namespaceData.isIndexed){
				if(namespaceData.isApp){
					this.setAppClass(askedName,null,null,namespace);
				}
				else if(namespaceData.isEngine){
					this.setEngineClass(askedName,null,null,namespace);
				}
			}
			return this._getObject.apply(this,arguments);
	  /*  }
		else{
			
			return false;
		}*/

	}
}