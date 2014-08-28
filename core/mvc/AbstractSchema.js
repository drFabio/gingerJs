var mongoose = require('mongoose');
module.exports={

	_engine:null,
	_isAuto:true,
	schemaName:null,
	schemaDefinitions:null,
	init: function(engine) {
		this._engine=engine;
		this._name=this.schemaName;
		this._isLoaded=false;
		this._dbObject=null;
		this._schemaDefinitions=this.schemaDefinitions;
	},
	setup:function(){
		if(!this._isLoaded){
			this._createDatabaseObject();
		}
	},
	validate:function(input){

	},
	validateField:function(input){

	},
	isAuto:function(){
		return !!this._isAuto;
	},
	getStructure:function(schema){
		throw this._engine.getError('NotImplemented','Get structure is not implemented for '+this._name+' pleas implement it');
	},
	getValidationRules:function(){
		return null;
	},
	getDbObject:function(){
		return this._dbObject;
	},
	_createDatabaseObject:function(){
		var structure=this.getStructure(this._schemaDefinitions);
		this._dbObject= mongoose.model(this._name,structure,this._name);
		this._isLoaded=true;
		this._engine.addFunctionToCloseQueue(this.clearSchema.bind(this));

	},
	clearSchema:function(cb){
		if(this._isLoaded){
			delete mongoose.models[this._name];
			delete mongoose.modelSchemas[this._name];
		}
		this._isLoaded=false;
		cb();
	}
};