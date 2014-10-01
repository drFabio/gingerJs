var _=require('lodash');
module.exports= {
	_search:{},
	_field:{},
	_option:{},
	_populate:{},
	init: function(engine,search,fields,options,populate) {
		this._engine=engine;
		this._setPopulateFromInput(populate);
		this._setSearchFromInput(search);
		this._setFieldsFromInput(fields);
		this._setOptionsFromInput(options);
	},
	getPopulate:function(){
		return Object.values(this._populate);
	},
	_getPopulatePartsIfExistent:function(key){
		if(key.indexOf('.')>-1){
			return key.split('.');
		}
		return false;
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
			if(parts=this._getPopulatePartsIfExistent(key)){
				populateKey=parts[0];
				optionKey=parts[1];
				if(!this._populate[populateKey]){
					this._populate[populateKey]={'path':populateKey};
				}
				if(!this._populate[populateKey].options){
					this._populate[populateKey].options={};
				}
					this._populate[populateKey].options[optionKey]=value;

			}
			else{
				this._option[key]=options[key];
			}

		}
	},
	_setFieldsFromInput:function(fields){
		if(!fields){
			this._field={};
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

				if(parts=this._getPopulatePartsIfExistent(key)){
					populateKey=parts[0];
					fieldKey=parts[1];
					if(!this._populate[populateKey]){
						this._populate[populateKey]={'path':populateKey};
					}
					if(!this._populate[populateKey].select){
						this._populate[populateKey].select={};
					}
					this._populate[populateKey].select[fieldKey]=value;
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
	_setSearchFromInput:function(search){
		if(!search){
			this._search={};
		}
		var parts;
		var populateKey;
		var searchKey;
		var value;
		for(var searchKey in search){
			value=search[searchKey];

			if(parts=this._getPopulatePartsIfExistent(searchKey)){
				populateKey=parts[0];
				searchKey=parts[1];
				if(!this._populate[populateKey]){
					this._populate[populateKey]={'path':populateKey};
				}
				if(!this._populate[populateKey].match){
					this._populate[populateKey].match={};
				}
				this._populate[populateKey].match[searchKey]=value;
			}
			else{
				this._search[searchKey]=value;
			}
		}
	},

};
