var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports={
	parent:'ginger.bootstraps.Element',
	_defaulAppNamespace:'schemas',
	_isSingleton:true,
	_defaultAppParent:null,
	_indexedByName:true,
	_getObject:function(name){	
		return this._classFactory.createObject(name,Schema);
	}

}