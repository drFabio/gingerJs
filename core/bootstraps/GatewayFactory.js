module.exports={
	parent:'ginger.bootstraps.MVCBootstrap',
	_defaultParent:'ginger.gateways.AbstractGateway',
	setAppGatewayClass:function(name,path){
	    var gingerName='ginger.gateways.'+name;
	    var defaultParent=this._defaultParent;
	 	if(this._classFactory.classFileExists(gingerName)){
	 		defaultParent=gingerName;
	 	}
		var gatewayPOJO=this._getPojo(path,defaultParent);
		this._classFactory.setClassFromPojo('gateways.'+name,gatewayPOJO);
	},
	createGateway:function(name,params,cb){
	    var gatewayData;
	    if (this.isGatewayCancelled(name)) {
	         cb(null,false);
	        return;
	    }
	    var appName='gateways.'+name;
	    var gingerName='ginger.gateways.'+name;
	    if (!params) {
	        //If the user cancelled the component
	        //Trying to get params configuration if none is passed
	        if (!!this._config.gateways && !!this._config.gateways[name]) {
	            params = this._config.gateways[name];
	        }
	    }
	    if(this._classFactory.isClassSet(appName)){
	        this._classFactory.createObject(appName,this._engine,params,cb);
	        return;
	    }
	    else if(this._classFactory.classFileExists(gingerName)){
	       var pojo=this._classFactory.getClassFileContents(gingerName);
	       pojo=this._setDefaultParentOnPOJO(pojo,this._defaultParent);
	       this._classFactory.setClassFromPojo(gingerName,pojo);
	       this._classFactory.createObject(gingerName,this._engine,params,cb);
	       return;

	    }
	    cb(null,false);
	   
	    return;
  

	},
	isGatewayCancelled :function (name) {
	    if (this._engine._config.gateways && this._engine._config.gateways[name] === false) {
	        return true;
	    }
	    return false;
	},
	getParams:function(params){
        if (!params && !!this._engine._config.gateways && !!this._engine._config.gateways[name]) {
            params = this._engine._config.gateways[name];
        }
        return params;
	}

}