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
	_sanitizeName:function(name){
		if(_.isEmpty(name)){

			return '';
		}
		return name.toLowerCase();
	},
	setAppClass:function(name,path,parentNamespace,fullNamespace,POJO){

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
			if(!defaultParent && !!this._defaultAppParent){
				defaultParent=this._defaultAppParent;
			}
		}
		if(!POJO){
			POJO={};
			if(path){

				POJO=this._getPojo(path,defaultParent);
			}
			else{
				POJO=this._classFactory.getClassFileContents(fullNamespace);
			}
		}

		if(!POJO.parent){
			POJO=this._setDefaultParentOnPOJO(POJO,defaultParent);
			
		}
		else {
			var isEngineClass=POJO.parent.indexOf(this._defaultEngineNamespace)===0;
			//POJO=this._setDefaultParentOnPOJO(POJO,defaultParent);
			if(isEngineClass && !this._classFactory.isClassSet(POJO.parent)){
				var engineName=POJO.parent.replace(this._defaultEngineNamespace+'.',"");
				this.setEngineClass(engineName);

			}

		}

		var appNamespace=this._buildNamespace(this._defaulAppNamespace,name);
		this._addToIndex(name,appNamespace,POJO,true);
	 
		return appNamespace;
	},
	_buildIndexData:function(name,namespace,POJO,isApp,isEngine){
		return {namespace:namespace,isApp:!!isApp,isEngine:!!isEngine,pojo:POJO,name:name,isIndexed:true};
	},
	_setClassOnNamespace:function(namespace,POJO){
		this._classFactory.setClassPojo(namespace,POJO,true);
	},
	_addToIndex:function(name,namespace,POJO,isApp,isEngine){
		var saneName=this._sanitizeName(name);
		if(this._indexedByName){
			if(isApp || !this.hasElement(name)){
					 
				this._nameMap[saneName]=this._buildIndexData(name,namespace,POJO,isApp,isEngine);
			}
			POJO=this._nameMap[saneName].pojo;	
		}
		this._setClassOnNamespace(namespace,POJO);
	},
	hasDefaultParent:function(){
		return !!this._defaultEngineNamespace || !!this._defaultAppParent;
	},
	hasElement:function(name){
		var saneName=this._sanitizeName(name);
		return !!this._nameMap[saneName];
	},
	setEngineClass:function(name){
		var engineName=this._defaultEngineNamespace+'.'+name;
		if(!this._classFactory.classFileExists(engineName)){
			throw new Error("The class "+engineName+" does not exist");
		}
		/**
		 * @todo  use isClassCreatable ddTo
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
		var saneName=this._sanitizeName(name);
		this._nameMap[saneName]=data;
	},
	_getObject:function(name,var_args){
		var askedName=name;

		var newArgs=[];
		newArgs.push(askedName);
		//By default all objects have the engine as the first argument
		arguments[0]=this._engine;
		for(var x in arguments){
			newArgs.push(arguments[x]);
		}
		var classFactory=this._classFactory;

		if(this.isClassSingleton(askedName)){
		   return  classFactory.getSingletonObject.apply(classFactory,newArgs);
		}
		return classFactory.createObject.apply(classFactory,newArgs);
	},
	isClassSingleton:function(name){ 
		var pojoData=this._classFactory.getClassPojo(name);
		if(!!pojoData && _.isBoolean(pojoData.isSingleton) ){
			return pojoData.isSingleton;
		}
		return !!this._isSingleton;
	},
	isConfigurable:function(){
		return !! this._configValue;
	},
	_getNameMap:function(){
		return this._nameMap;
	},
	getElementByName:function(name){
		var saneName=this._sanitizeName(name);
		return this._nameMap[saneName];

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
		if(this.hasDefaultParent()){
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
		var notIndexed=	!namespaceData.isIndexed;
		
		if(notIndexed){
		
			if(namespaceData.isApp){
				this.setAppClass(askedName,null,null,namespace);
			}
			else if(namespaceData.isEngine){
				this.setEngineClass(askedName,null,null,namespace);
			}
		}
		return this._getObject.apply(this,arguments);


	}
}