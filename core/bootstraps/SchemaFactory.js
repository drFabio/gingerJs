var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
	create:function(name){	
		return this._schemaMap[name.toLowerCase()];
	},
	_addModelToSchema:function(originalName,model){
		name=originalName.toLowerCase();
		if(!this._schemaMap[name]){
			this._schemaMap[name]=mongoose.model(model,{collection:originalName});
			this._addClearSchemaFunction(name);
		}
	},
	_addClearSchemaFunction:function(name){
		var self=this;
		var func=function(cb){
			delete mongoose.models[name];
			delete mongoose.modelSchemas[name];
			self._schemaMap[name]=null;
			cb();
		}
		this._engine.addFunctionToCloseQueue(func);
	},
	_addToIndex:function(name,namespace,POJO,isApp,isEngine){
		if(this._isSchemaAutoCrud(POJO)){
			this._autoCruds[name]=true;
		}
		this._addModelToSchema(name,POJO);
		this._super(name,namespace,POJO,isApp,isEngine);
	},
	/**
	 * Whether a schema will automatic generate the crud
	 * @param  {[type]}  schema [description]
	 * @return {Boolean}        [description]
	 */
	_isSchemaAutoCrud:function(schema){
		return schema.auto!==false;
	},
	getAutoCrudSchemas:function(){
		return Object.keys(this._autoCruds);
	}

}