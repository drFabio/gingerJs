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
		if(typeof(fields)=='string'){
			fields=fields.split(' ');
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
	_setPopulateFromInput:function(populate){
		for(var k in populate){
		
			if(_.isObject(populate[k])){
				this._populate[k]=populate[k];
				if(!this._populate[k].path){
					this._populate[k].path=k;
				}
			}
			else{
				this._populate[k]={
					path:k,
					select:populate[k]
				}
			}
		}
	},
	_setSearchFromInput:function(search){
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
