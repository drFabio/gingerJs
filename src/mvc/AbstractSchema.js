var mongoose = require('mongoose');
var validator=require('validator');
var _=require('lodash');
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
		this._validatorRules=this.getValidators();
	},
	setup:function(){
		if(!this._isLoaded){
			this._createDatabaseObject();
		}
	},
	validateField:function(field,value){
		var validationFunc=this._getRuleForField(field);
		if(!validationFunc){
			return true;
		}
		return validationFunc(value);
	},
	_getRuleForField:function(field){
		var ruleData=this._validatorRules[field]
		if(ruleData){
			return this._buildRule(ruleData);

		}
		return null;
	},
	_buildRule:function(ruleData){
		var self=this;
		var type=typeof(ruleData);
		if(Array.isArray(ruleData)){
			var funcsToExecute=[];
			ruleData.forEach(function(r){
				funcsToExecute.push(self._buildRule(r));
			});
			return function(value){
				var success=true;
				for(var x in funcsToExecute){
					if(!funcsToExecute[x](value)){
						success=false;
						break;
					}
				}
				return success;
			}
		};
		switch(type) {
			case 'string':
				return function(value){
					return validator[ruleData](value);
				}				
			break;
			case 'object':{
				return function(value){
					var success=true;
					for(var ruleName in ruleData){
						var params=_.clone(ruleData[ruleName]);
						params.unshift(value);
						if(!validator[ruleName].apply(validator,params)){
							success=false;
							break;
						}
					}
					return success;

					
				}
			}

		}
	},
	validate:function(input){
		var errorMap={};
		for(var field in input){
			if(!this.validateField(field,input[field])){
				errorMap[field]=true;
			}
		}
		if(!_.isEmpty(errorMap)){
			throw this._engine.getError('Validation','The following fields did not pass validation',errorMap);
		}
		return true;
	},
	isAuto:function(){
		return !!this._isAuto;
	},
	getStructure:function(schema){
		throw this._engine.getError('NotImplemented','Get structure is not implemented for '+this._name+' pleas implement it');
	},
	getValidators:function(){
		return {};
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