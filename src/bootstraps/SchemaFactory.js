var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _=require('lodash');
var async=require('async');
module.exports={
	parent:'ginger.bootstraps.Element',
	_defaulAppNamespace:'schemas',
	_isSingleton:true,
	_defaultAppParent:'ginger.mvc.AbstractSchema',
	_indexedByName:true,
	init : function(engine,params) {
		this._super(engine,params);
		this._autoCruds=[];

	},
	_buildIndexData:function(name,namespace,POJO,isApp,isEngine){
		if(!POJO.schemaName){
			POJO.schemaName=name;
		}	
		if(!POJO.schemaDefinitions){
			POJO.schemaDefinitions=Schema;
		}
		if(POJO._isAuto!==false){
			this._autoCruds.push(name);
			this._autoCruds=_.uniq(this._autoCruds);
		}
		return this._super(name,namespace,POJO,isApp,isEngine);
	},
	createSchema:function(name){
		var schema=this.create(name);
		return schema.getDbObject();
	},
	getAutoCrudSchemas:function(){

		return this._autoCruds;
	},
	create:function(name,var_args){
		try{
			return this._super.apply(this,arguments);
		}
		catch(err){
			return this._createEmptySchema.apply(this,arguments);

		}


	},
	/**
	*@todo cleancode
	*/
	_createEmptySchema:function(name){
		var obj={
			getStructure:function(){
				return new mongoose.Schema({},{strict:false})
			}
		}
		var askedName=name;
		var appName=this._defaulAppNamespace+'.'+name;
		var namespaceData= {name:name,namespace:appName,isApp:true,isEngine:false};
		var namespace=namespaceData.namespace;
		//If is configurable the first argument is the parasm from the config
		if(this.isConfigurable()){
			var params=this._getParams(name,arguments[1]);
			arguments[1]=params;
		}
		this.setAppClass(name,null,null,namespace,obj);
		arguments[0]=namespace;
		return this._getObject.apply(this,arguments);

	},
	initializeSchemas:function(){
		var functionsToExecute=[];
		for(var x in this._nameMap){
			var obj=this.create(x);
			obj.setup();
		}
	}
}