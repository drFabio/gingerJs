module.exports={
	init : function(engine,params) {
		this._engine=engine;
		this._params=params;
		this._classFactory=this._engine.libs.classFactory;
		if(!this._params.actionSuffix){
			this._params.actionSuffix='Action';
		}
	},
	buildMapIndex:function(name,parentNamespace){
		var saneName=this.sanitizeName(name);
		var mapIndex;
		if(parentNamespace){
			mapIndex= parentNamespace.replace('.','/')+'/'+saneName;
		}
		else{
			mapIndex=saneName;
		}	
		return mapIndex;
	},
	sanitizeName:function(name){
		return  name.substring(0, 1).toLowerCase() + name.substring(1);
	},
	_buildNamespace:function(parentNamespace,currentDirectory){
		var ret;
		if(parentNamespace===''){
			ret=currentDirectory;
		}
		else{
			ret=parentNamespace+'.'+currentDirectory;
		}
		return ret;
	},
	_getPojo:function(path,defaultParent){
		var pojo=require(path);
		if(!pojo.parent && !!defaultParent){
			pojo.parent=defaultParent;
		}
		return pojo;
	},
}