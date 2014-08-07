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
	},
	_getObject:function(name){	
		return this._classFactory.createObject(name,Schema);
	},
	_addToIndex:function(name,namespace,POJO,isApp,isEngine){
		if(this._isSchemaAutoCrud(POJO)){
			this._autoCruds[name]=true;
		}
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