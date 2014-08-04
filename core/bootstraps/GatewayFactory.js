module.exports={
	parent:'ginger.bootstraps.Default',
	_defaultParent:'ginger.gateways.AbstractGateway',
	setAppGatewayClass:function(name,path){
	    var gingerName='ginger.gateways.'+name;
	    var defaultParent=this._defaultParent;
	 	if(this._classFactory.classFileExists(gingerName)){
	 		defaultParent=gingerName;
	 	}
		var gatewayPOJO=this._getPojo(path,defaultParent);
		var appName='gateways.'+name;
		this._classFactory.setClassFromPojo(appName,gatewayPOJO);
	},
	setEngineGateway:function(name){
		var gingerName='ginger.gateways.'+name;
		var pojo=this._classFactory.getClassFileContents(gingerName);
		pojo=this._setDefaultParentOnPOJO(pojo,this._defaultParent);
		this._classFactory.setClassFromPojo(gingerName,pojo);
	},
	createGateway:function(name,params,cb){
	    var gatewayData;
	    if (this._engine.isGatewayCancelled(name)) {
	         cb(null,false);
	        return;
	    }
	    var appName='gateways.'+name;
	    var gingerName='ginger.gateways.'+name;
	    params=this.getParams(params);
	  
	    if(this._classFactory.isClassSet(appName)){
	        this._classFactory.createObject(appName,this._engine,params,cb);
	        return;
	    }
	    this._classFactory.createObject(gingerName,this._engine,params,cb);

	   
	    return;
  

	},
	getParams:function(params){
        if (!params && !!this._engine._config.gateways && !!this._engine._config.gateways[name]) {
            params = this._engine._config.gateways[name];
        }
        return params;
	}

}