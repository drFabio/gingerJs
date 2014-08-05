module.exports={
	parent:'ginger.bootstraps.Element',
	_defaulAppNamespace:'controlles',
	_defaultAppParent:'ginger.mvc.AbstractController',
	getActionsMap:function(controllerData){
		var actionsMap={};
		for(var x in controllerData){

			if(typeof(controllerData[x])==='function' && (plainName=this.getActionPlainName(x))!==false){
			
				actionsMap[plainName]=x;
			}
		}
		return actionsMap;
	},
	init : function(engine,params) {
		this._super(engine,params);
		if(!this._params.actionSuffix){
			this._params.actionSuffix='Action';
		}
	},
	addToEngine:function(name,path,parentNamespace){
		var mapIndex=this.buildMapIndex(name,parentNamespace);
		var controllerNamespace=this.setAppClass(name,path,parentNamespace);
		var sanitizedUrl='/'+mapIndex;
		var controllerPOJO= this._getPojo(path);
		var controllerObject=this._classFactory.getSingletonObject(controllerNamespace,this._engine);
		var actions=this.getActionsMap(controllerPOJO);
		this._engine.setController(mapIndex,{
			'modules':parentNamespace,
			'object':controllerObject,
			'actions':actions,
			'name':name,
			'url':sanitizedUrl
		});
	},
	getActionPlainName:function(name){
		var suffix=this._params.actionSuffix;
		var pos=name.indexOf(suffix, name.length - suffix.length);
	    if( pos == -1){
	    	return false;
	    }
	   return name.substr(0,pos);
	}
}
