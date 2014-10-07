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
	createEmptySchema:function(name){
		var structure=new mongoose.Schema({},{strict:false});
		return mongoose.model(name,structure,name);
	},
	initializeSchemas:function(){
		var functionsToExecute=[];
		for(var x in this._nameMap){
			var obj=this.create(x);
			obj.setup();
		}
	}
}