module.exports={
	parent:'ginger.bootstraps.MVCBootstrap',
	getActionsMap:function(controllerData){
		var actionsMap={};
		for(var x in controllerData){

			if(typeof(controllerData[x])==='function' && (plainName=this.getActionPlainName(x))!==false){
			
				actionsMap[plainName]=true;
			}
		}
		return actionsMap;
	},
	addToEngine:function(name,path,parentNamespace){
		var controllerPOJO=this._getPojo(path,'ginger.mvc.AbstractController');
		var controllerNamespace=this._buildNamespace(parentNamespace,'controllers.'+name);
		this._classFactory.setClassFromPojo(controllerNamespace,controllerPOJO);
		var self=this;
		var mapIndex=this.buildMapIndex(name,parentNamespace);
		var controllerObject=this._classFactory.getSingletonObject(controllerNamespace,this._engine);
		sanitizedUrl=mapIndex;
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
