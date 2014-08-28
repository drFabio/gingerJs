var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _=require('lodash');
module.exports={
	parent:'ginger.bootstraps.Element',
	_defaulAppNamespace:'schemas',
	_isSingleton:true,
	_defaultAppParent:null,
	_indexedByName:true,
	init : function(engine,params) {
		this._super(engine,params);
		this._autoCruds={};
		this._schemaMap={};

	},

	_getPojo:function(path,defautlParent){
		var pojo=require(path)(Schema);
		return pojo;
	},
	createSchema:function(name){
		return this._schemaMap[name.toLowerCase()].dbObject;
	},
	create:function(name){	
		throw this._engine.getError('NotImplemented');
		//return this._schemaMap[name.toLowerCase()];
	},
	_addModelToSchema:function(name,model){
		var saneName=this._sanitizeName(name);
		if(!this._schemaMap[saneName]){
			this._schemaMap[saneName]=this._buildSchemaMapObject(model,name);
			this._addClearSchemaFunction(name);
		}
	},
	_buildSchemaMapObject:function(model,name){
		var ret={
			'structure':{},
			'behaviour':{},
			'validators':{}
		};
		if(model.structure){
			ret.structure=model.structure;
		}
		else{
			ret.structure=model;
		}
		if(model.behaviour){
			ret.behaviour=model.behaviour;
		}
		if(model.validators){
			ret.validators=model.validators;
		}
		ret.dbObject=this._createDatabaseObject(ret.structure,name);
		return ret;
	},
	_createDatabaseObject:function(schemaStructure,name){
		return mongoose.model(name,schemaStructure,name);
	},
	_addClearSchemaFunction:function(name){
		var self=this;
		var func=function(cb){
			self._clearSchema(name);
			cb();
		}
		this._engine.addFunctionToCloseQueue(func);
	},
	_clearSchema:function(name){
		delete mongoose.models[name];
		delete mongoose.modelSchemas[name];
		var saneName=this._sanitizeName(name);
		this._schemaMap[saneName]=null;
		return true;
	},
	_addToIndex:function(name,namespace,POJO,isApp,isEngine){
		this._addModelToSchema(name,POJO);
		this._super(name,namespace,POJO,isApp,isEngine);
		if(this._isSchemaAutoCrud(name)){
			this._autoCruds[name]=true;
		}
	},
	/**
	 * Whether a schema will automatic generate the crud
	 * @param  {[type]}  schema [description]
	 * @return {Boolean}        [description]
	 */
	_isSchemaAutoCrud:function(name){
		var saneName=this._sanitizeName(name);
		if(_.isEmpty(this._schemaMap[saneName].behaviour)){
			return true;
		}
		return  this._schemaMap[saneName].behaviour.auto!==false;
	},
	getAutoCrudSchemas:function(){
		return Object.keys(this._autoCruds);
	}

}