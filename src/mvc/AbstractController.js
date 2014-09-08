module.exports={
	_actionSuffix:'Action',
	init: function(engine) {
		
		this._engine=engine;
		this._initializeModel();
		this._actions=this.getActionsMap();
	},
	_initializeModel:function(){
		if(this._engine.hasModel(this.modelName)){
			this._model=this._engine.getModel(this.modelName);
		}

	},
	getModel:function(){
		return this._model;
	},
	getActions:function(){
		return this._actions;
	},
	getActionsMap:function(){
		var actionsMap={};
		for(var x in this){
			if(typeof(this[x])==='function' && (plainName=this.getActionPlainName(x))!==false){
				actionsMap[plainName]=x;
			}
		}
		return actionsMap;
	},
	getActionFunctionByName:function(name){
		return this._actions[name]
	},
	getActionPlainName:function(name){
		var suffix=this._actionSuffix;
		var pos=name.indexOf(suffix, name.length - suffix.length);
	    if( pos == -1){
	    	return false;
	    }
	   return name.substr(0,pos);
	},
	actionExists:function(plainName){
		return !!this._actions[plainName];
	},
	_getSendResponse:function(req,res){
		return function(err,data){
			var response;
			if(err){
				res.status(200).send(err);
				return;
			}
			else{
				response=data;
			}
			res.status(200).send(response);
		}
	},
	_sendResponse:function(req,res,err,data){
		this._getSendResponse(req,res)(err,data);
	},
};