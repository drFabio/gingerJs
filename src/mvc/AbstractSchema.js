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
			return this._buildRule(ruleData,field);

		}
		return null;
	},
	_buildValidationError:function(field,ruleName,value){
		return this._engine.getError('Validation',null,null,{'field':field,rule:ruleName,value:value});
	},
	_buildSingleErroFromErrorArray:function(errors){
		var fieldArray=[];
		var data={};
		errors.forEach(function(e){
			fieldArray.push()

			if(!data[e.data.field]){
				data[e.data.field]=[];
			}
			fieldArray.push(e.data.field);
			data[e.data.field].push({'rule':e.data.rule,'value':e.data.value});
		});
		var fieldsNames=fieldArray.join(',');
		var err= this._engine.getError('Validation','The following fields did not pass validation '+fieldsNames,null,{'fieldMap':data});
		return err;
	},
	_buildRule:function(ruleData,field){
		var self=this;
		var type=typeof(ruleData);
		if(Array.isArray(ruleData)){
			var funcsToExecute=[];
			ruleData.forEach(function(r){
				funcsToExecute.push(self._buildRule(r,field));
			});
			return function(value){
				var success=true;
				var errors=[];
				for(var x in funcsToExecute){
					try{
						funcsToExecute[x](value);
					}
					catch(err){
						errors.push(err);
					}
					
				}
				if(!_.isEmpty(errors)){
					throw self._buildSingleErroFromErrorArray(errors);
				}
				return true;
			}
		};
		switch(type) {
			case 'string':
				return function(value){
					if(!validator[ruleData](value)){
						throw self._buildValidationError(field,ruleData	,value);
					}
					return true;
				}				
			break;
			case 'object':{
				return function(value){
					var success=true;
					for(var ruleName in ruleData){
						var params=_.clone(ruleData[ruleName]);
						params.unshift(value);
						if(!validator[ruleName].apply(validator,params)){
							throw self._buildValidationError(field,ruleName,value);
							// success=false;
							break;
						}
					}
					return success;

					
				}
			}

		}
	},
	validate:function(input){
		var errors=[];
		for(var field in input){
			try{
				this.validateField(field,input[field])
			}
			catch(err){
				errors.push(err);
			}
			
		}

		if(errors.length>0){
			throw this._buildSingleErroFromErrorArray(errors);
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