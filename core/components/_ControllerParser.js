function ControllerParser(){

}

ControllerParser.prototype.init = function(engine,params) {
	this._engine=engine;
	this._params=params;
	if(!this._params.actionSuffix){
		this._params.actionSuffix='Action';
	}
};

ControllerParser.prototype.getActionsMap=function(controllerData){
	var actionsMap={};
	for(var x in controllerData){

		if(typeof(controllerData[x])==='function' && (plainName=this.getActionPlainName(x))!==false){
		
			actionsMap[plainName]=true;
		}
	}
	return actionsMap;
}

ControllerParser.prototype.getActionPlainName=function(name){
	var suffix=this._params.actionSuffix;
	var pos=name.indexOf(suffix, name.length - suffix.length);
    if( pos == -1){
    	return false;
    }
   return name.substr(0,pos);
}
module.exports=ControllerParser;