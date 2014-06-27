var fs = require('fs');
var Class = require('class.extend');
var util=require('util');
var CONTEXT_MODULE=4;
var CONTEXT_MODEL=1;
var CONTEXT_VIEW=2;
var CONTEXT_CONTROLLER=3;
var CONTEXT_MODULE_ROOT=5;
var CONTEXT_ROOT=8;
var CONTEXT_COMPONENTS=6;
var CONTEXT_GATEWAYS=7;

/**
 * This handles the application initialization by a path
 * @param {[type]} engine [description]
 * @param {[type]} path   [description]
 */
function AppBootstrap(){

}
/**
 * Set the application path
 * @param {String} path The file type
 */
AppBootstrap.prototype.setApplicationPath=function(path){
	//Removing leading bar
	this._path=	path.replace(/\/+$/,'');
}
/**
 * Check wheter the paplication has a path
 * @return {Boolean} [description]
 */
AppBootstrap.prototype.hasApplicationPath=function(){
	return !!this._path;
}
/**
 * Constructor
 * @param  {[type]} engine [description]
 * @param  {[type]} data   [description]
 * @return {[type]}        [description]
 */
AppBootstrap.prototype.init=function(engine,params){
	this._engine=engine;
	this._params=params;
	if(this._params['path']){
		this.setApplicationPath(this._params['path']);
	}
	
}
/**
 * Get the directory context
 * @param  {[type]} dirName [description]
 * @return {[type]}         [description]
 */
AppBootstrap.prototype._getDirectoryContext=function(dirName){
	dirName=dirName.toLowerCase();
	switch(dirName){
		case 'modules':
			return CONTEXT_MODULE;
		break;
		case 'models':
			return CONTEXT_MODEL;
		break;
		case 'views':
			return CONTEXT_VIEW;
		break;
		case 'controllers':
			return CONTEXT_CONTROLLER;
		break;
		case 'components':
			return CONTEXT_COMPONENTS;
		break;
		case 'gateways':
			return CONTEXT_GATEWAYS;
		break;
		default:
			return false;
	}
}
AppBootstrap.prototype._handleFile = function(fullPath,fileName,context,parentModules,cb) {
	switch(context){
		case CONTEXT_CONTROLLER:
			var name=this.parseControllerName(fileName);
			this._addController(fullPath,name,parentModules);
			cb();
		break;
		case CONTEXT_MODEL:
			var name=this.parseModelName(fileName);
			this._addModel(fullPath,name,parentModules);
			cb();
		break;
		case CONTEXT_VIEW:
			var name=this.parseViewName(fileName);
			cb();
		break;
		case CONTEXT_GATEWAYS:
			var name=this.parseGatewayName(fileName);
			this._addGateway(fullPath,name,cb);
			cb();
		break;
		case CONTEXT_COMPONENTS:
			var name=this.parseComponentName(fileName);
			cb();
		break;
		default:
			cb();
		break;
	}
};
/**
 * Adds a gateway
 * @param {[type]} path [description]
 * @param {[type]} name [description]
 */
AppBootstrap.prototype._addGateway = function(path,name,cb) {
	var self=this;
	var createGatewaycb=function(err,gateway){
		if(err){
			cb(err);
			return;
		}
		self._engine.setGateway(name,gateway);
		cb();
	}
	this._engine.createGateway(createGatewaycb,name,null,false,path);
};
AppBootstrap.prototype._addModule = function(moduleName,parentModules) {
	var indexName=parentModules.join('/');
	if(indexName){
		indexName+='/';
	}
	indexName+=moduleName;
	this._engine.setModule(indexName);
};
AppBootstrap.prototype._addModel = function(modelFile,modelName,modules) {
	var modelData=require(modelFile);
	var ModelClass;
	if(modelData.inheritsAbstract){
		ModelClass=this._engine._abstractClasses['model'].extend(modelData);
	}
	else{
		ModelClass=Class.extend(modelData);
	}
	var self=this;
	var mapIndex=modules.join('/');
	if(mapIndex){
		mapIndex+='/';
	}
	mapIndex+=modelName;
	this._engine.setModel(mapIndex,{
		'modules':modules,
		'class': ModelClass
	});
};
/*
 * Adds a controller to the controller map
 * @param {[type]} controllerFile [description]
 * @param {[type]} controllerName [description]
 * @param {[type]} modules        [description]
 */
AppBootstrap.prototype._addController = function(path,controllerName,modules) {

	var controllerData=require(path);
	var ControllerClass;
	var controllerParser=this._engine.getBootstrapper('ControllerBootstrap');
	if(controllerData.inheritsAbstract){
		ControllerClass=this._engine._abstractClasses['controller'].extend(controllerData);
	}
	else{
		ControllerClass=Class.extend(controllerData);
	}
	var self=this;
	var mapIndex=modules.join('/');
	var	controllerLowerName = controllerName.substring(0, 1).toLowerCase() + controllerName.substring(1);
	var sanitizedUrl=mapIndex;
	if(mapIndex){
		mapIndex+='/';
		sanitizedUrl+='/';
	}
	mapIndex+=controllerName;
	sanitizedUrl+=controllerLowerName;
	var actions=controllerParser.getActionsMap(controllerData);
	this._engine.setController(mapIndex,{
		'modules':modules,
		'object':new ControllerClass(self._engine),
		'actions':actions,
		'name':controllerName,
		'url':sanitizedUrl
	});

};
var removeExtensionFn=function(name) {
	return this.removeExtension(name);
};
AppBootstrap.prototype.parseControllerName =removeExtensionFn;
AppBootstrap.prototype.parseModelName =removeExtensionFn;
AppBootstrap.prototype.parseViewName =removeExtensionFn;
AppBootstrap.prototype.parseGatewayName =removeExtensionFn;
AppBootstrap.prototype.parseComponentName =removeExtensionFn;


AppBootstrap.prototype.removeExtension = function(name) {
	return name.replace(/\.js$/,'');
};
/**
 * Recursive walk the directory structures
 * @param  {Function} cb            [description]
 * @param  {[type]}   dir           [description]
 * @param  {[type]}   context       [description]
 * @param  {[type]}   parentModules [description]
 * @return {[type]}                 [description]
 * @todo  refatorar mover dir walker para outro classe
 */
AppBootstrap.prototype._walkDir=function(cb,dir,context,parentModules){
	if(!parentModules){
		parentModules=[];
	}
	var self=this;
	var path;
	var context;
	var list=fs.readdirSync(dir);

	var asyncFunctions=[];
	var functionToHandleFile=function(path,item,context,parentModules){
		return function(asyncCb){
			self._handleFile(path,item,context,parentModules,asyncCb);
		}
	}
	list.forEach(function(item){
		path=dir+'/'+item;
		var stat=fs.statSync(path);
		if( stat.isDirectory()){
			//We just care about directories on modules and on root
			if(context===CONTEXT_MODULE_ROOT || context===CONTEXT_ROOT){
				var childContext=self._getDirectoryContext(item);
				//If it's not on a child context we don't handle it
				if(childContext!==false){
					
					
					if(childContext===CONTEXT_COMPONENTS || childContext===CONTEXT_GATEWAYS){
						//Just root handle components and gateways
						if(context===CONTEXT_ROOT){
							asyncFunctions=asyncFunctions.concat(self._walkDir(false,path,childContext,parentModules));
						}
					}
					else{
						//This is a directory we care change the context and keep looping
						asyncFunctions=asyncFunctions.concat(self._walkDir(false,path,childContext,parentModules));
					}
				}
			}
			else if(context===CONTEXT_MODULE){
				//It's a module lets put it on the map
				self._addModule(item,parentModules);
				
				//It's a module for all intents all directories here are module names with module structure
				asyncFunctions=asyncFunctions.concat(self._walkDir(false,path,CONTEXT_MODULE_ROOT,parentModules.concat([item])));
			}
		}
		else{
			//It is a file
			asyncFunctions.push(functionToHandleFile(path,item,context,parentModules));
		}
	});
	if(cb){
		if(asyncFunctions.length>0){
			self._engine.libs.async.parallel(asyncFunctions,function(err,res){
				cb(err);
			});
			return;
		}
		cb();
	}
	else{
		return asyncFunctions;
	}
	
}
AppBootstrap.prototype._appHasConfigFile = function() {
	return  fs.existsSync(this._path+'/config/app.js');
}
AppBootstrap.prototype.buildApp = function(cb) {
	if(!this._appHasConfigFile()){
		//There isn't an app here
		cb();
		return;
	}
	try{
		this._walkDir(cb,this._path,CONTEXT_ROOT);
	}
	catch(e){
		cb(e);
	}
};
module.exports=AppBootstrap;