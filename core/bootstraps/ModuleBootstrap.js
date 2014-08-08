module.exports={

	/**
	 * @todo clean clode
	 * @type {String}
	 */
	parent:'ginger.bootstraps.Default',
	init : function(engine,params) {
		this._super(engine,params);
		this._moduleIndex={};
		this._classFactory=this._engine.libs.classFactory;
	},
	addToEngine:function(name,path,parentNamespace){
		name=name.toLowerCase();
		var mapIndex=this._buildNamespace(parentNamespace,name);
		this._moduleIndex[mapIndex]=true;
	},
	hasElement:function(name){
		name=name.toLowerCase();
		return !!this._moduleIndex[name];
	}

}