module.exports={
	parent:'ginger.bootstraps.MVCBootstrap',
	setAppComponentClass:function(name,path,parentNamespace){
	    var gingerName='ginger.components.'+name;
	    var defaultParent=null;
		var componentNamespace=this._buildNamespace(parentNamespace,'components.'+name);

	 	if(this._classFactory.classFileExists(gingerName)){
	 		defaultParent=gingerName;
	 	}
		var componentPOJO=this._getPojo(path,defaultParent);
		this._classFactory.setClassFromPojo(componentNamespace,componentPOJO);
	},
	createComponent : function (name, params,cb) {
	    if(!params){
	        var compValues=this._engine.getConfigValue('components');
	        if(compValues[name]){
	            params=compValues[name];
	        }
	    }
	    var appComponentName='components.'+name;
	    var gingerComponentName='ginger.components.'+name;
	    //First let's check if the namespace of compoennts is set
	    if(this._classFactory.isClassSet(appComponentName)){
	       return  this._classFactory.getSingletonObject(appComponentName,this._engine,params,cb);
	    }
	    else if(this._classFactory.classFileExists(gingerComponentName)){
	       return this._classFactory.getSingletonObject(gingerComponentName,this._engine,params,cb);

	    }
	    else{
	        cb();
	        return;
	    }

	}
}