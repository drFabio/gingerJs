module.exports={
	parent:'ginger.bootstraps.Element',
	_defaulAppNamespace:'query',
	_defaultAppParent:'ginger.mvc.DefaultQuery',
	_defaultEngineNamespace:'ginger.query',
	_isSingleton:false,
	_isLazy:true,
	create : function ( var_args) {

		var newArgs=[];
		newArgs.push(this._defaultAppParent);
		newArgs.push(this._engine);
		for(var x in arguments){
			newArgs.push(arguments[x]);
		}

		var classFactory=this._classFactory;
		return classFactory.createObject.apply(classFactory,newArgs);
	}
}