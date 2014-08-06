module.exports={
	parent:'ginger.bootstraps.Element',
	_defaulAppNamespace:'controlles',
	_defaultAppParent:'ginger.mvc.AbstractController',
	_debugController:true,
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
	_buildIndexData:function(name,namespace,POJO,isApp,isEngine){
		var data=this._super(name,namespace,POJO,isApp,isEngine);
		data.actions=this.getActionsMap(POJO);
	
		return data;
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
