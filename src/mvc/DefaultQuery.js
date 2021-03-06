var _=require('lodash');
module.exports= {
	init: function(engine,search,fields,options,populate) {
		this._search={};
		this._field={};
		this._option={};
		this._populate={};
		this._engine=engine;
		this._setPopulateFromInput(populate);
		this._setSearchFromInput(search);
		this._setFieldsFromInput(fields);
		this._setOptionsFromInput(options);
	},
	getPopulate:function(){
		if(_.isEmpty(this._populate)){
			return [];
		}
		this._addPopulatePartsToFieldsIfFieldsSet();
		return _.values(this._populate);
	},
	getPopulateAsMap:function(){
		if(_.isEmpty(this._populate)){
			return {};
		}
		this._addPopulatePartsToFieldsIfFieldsSet();
		return this._populate;
	},
	getOptions:function(){
		return  this._option;
	},
	getFields:function(){
		this._addPopulatePartsToFieldsIfFieldsSet();
		return this._field;
	},
	getSearch:function(){
		return this._search;
	},
	_isKeyAPopulation:function(key){
		return key.indexOf('+')>-1;
	},
	_setPopulateProperty:function(key,value,property){
		var parts=key.split('+');
		var populateKey=parts[0];
		var valueKey=parts[1];
		if(!this._populate[populateKey]){
			this._populate[populateKey]={'path':populateKey};
		}
		if(!this._populate[populateKey][property]){
			this._populate[populateKey][property]={};
		}
		this._populate[populateKey][property][valueKey]=value;
	},
	_setOptionsFromInput:function(options){
		if(!options){
			this._option={};
			return;
		}
		var parts;
		var populateKey;
		var optionKey;
		var value;
		for(var key in options){
			value=options[key];
			if(this._isKeyAPopulation(key)){
				this._setPopulateProperty(key,value,'options');
			}
			else{
				this._option[key]=options[key];
			}
		}
	},
	_setFieldsFromInput:function(fields){
		if(!fields){
			if(!this._field){
				this._field={};
			}
			return;
		}
		if(typeof(fields)=='string'){
			fields=this._getSelectPartFromString(fields);
		}
		var parts;
		var populateKey;
		var fieldKey;
		var value;
		for(var key in fields){
			value=fields[key];

			if(value){
				if(this._isKeyAPopulation(key)){
					this._setPopulateProperty(key,value,'select');
				}
				else{
					this._field[key]=value;
				}
			}
			else{
				this._field[key]=value;
			}
		}
	},
	_getSelectPartFromString:function(str){
		var parts=str.split(' ');
		var ret={};
		parts.forEach(function(p){
			ret[p]=true;
		});
		return ret;
	},
	_setPopulateFromInput:function(populate){
		if(!populate){
			this._populate={};
			return;
		}
		if(typeof(populate)=='string'){
			this._populate={};
			this._populate[populate]={'path':populate};
			return;
		}
		for(var k in populate){
		
			if(_.isObject(populate[k])){
				this._populate[k]=populate[k];
				if(!this._populate[k].path){
					this._populate[k].path=k;
				}
			}
			else{
				var selectPart=this._getSelectPartFromString(populate[k]);

				this._populate[k]={
					path:k,
					select:selectPart
				}

			}
		}
	},
	_addPopulatePartsToFieldsIfFieldsSet:function(){
		if(_.isEmpty(this._field) || _.isEmpty(this._populate)){
			return;
		}	
		//Check if ther isnt a false
		for(var x in this._field){
			if(this._field[x]===false){
				return;
			}
		}
		for(populateKey in this._populate){
			if(!(populateKey in this._field)){
				this._field[populateKey]=true;
			}
		}
	},
	_setSearchFromInput:function(search){
		if(!search){
			this._search={};
		}
		var parts;
		var populateKey;
		var searchKey;
		var value;
		for(var key in search){
			value=search[key];
			if(this._isKeyAPopulation(key)){
				this._setPopulateProperty(key,value,'match');
			}
			else{
				this._search[key]=value;
			}
		}
	},

};
