var fs = require('fs');
var util=require('util');
var CONTEXT_MODULE=4;
var CONTEXT_MODEL=1;
var CONTEXT_VIEW=2;
var CONTEXT_CONTROLLER=3;
var CONTEXT_MODULE_ROOT=5;
var CONTEXT_COMPONENTS=6;
var CONTEXT_GATEWAYS=7;
var CONTEXT_ROOT=8;
var CONTEXT_ERROR=9;
var CONTEXT_SCHEMA=10;
var CONTEXT_ROUTER=11;
var CONTEXT_MIDDLEWARE=12;
var _=require('lodash');

module.exports={
	_classFactory:null,
	_controllerFactory:null,
	/**
	 * Set the application path
	 * @param {String} path The file type
	 */
	setApplicationPath:function(path){
		//Removing leading bar
		this._path=	path.replace(/\/+$/,'');
	},
	/**
	 * Check wheter the paplication has a path
	 * @return {Boolean} [description]
	 */
	hasApplicationPath:function(){
		return !!this._path;
	},
	/**
	 * Constructor
	 * @param  {[type]} engine [description]
	 * @param  {[type]} data   [description]
	 * @return {[type]}        [description]
	 */
	init:function(engine,params){
		this._engine=engine;
		this._params=params;
		this._classFactory=engine.getLib('classFactory');
		

		this._controllerFactory=engine.getBootstrap('ControllerFactory');
		this._modelFactory=engine.getBootstrap('ModelFactory');
		this._moduleBootstrap=engine.getBootstrap('ModuleBootstrap');
		this._gatewayFactory=engine.getBootstrap('GatewayFactory');
		this._componentFactory=engine.getBootstrap('ComponentFactory');
		this._errorFactory=engine.getBootstrap('ErrorFactory');
		this._schemaFactory=engine.getBootstrap('SchemaFactory');
		this._routerHandlerFactory=engine.getBootstrap('RouterHandlerFactory');
		if(this._params['path']){
			this.setApplicationPath(this._params['path']);
		}
		
	},
	/**
	 * Get the directory context
	 * @param  {[type]} dirName [description]
	 * @return {[type]}         [description]
	 */
	_getDirectoryContext:function(dirName,currentContext){

		dirName=dirName.toLowerCase();
		switch(dirName){
			case 'modules':
				return CONTEXT_MODULE;
			case 'models':
				return CONTEXT_MODEL;
			case 'views':
				return CONTEXT_VIEW;
			case 'controllers':
				return CONTEXT_CONTROLLER;
			case 'components':
				return CONTEXT_COMPONENTS;
			case 'gateways':
				return CONTEXT_GATEWAYS;
			case 'errors':
				return CONTEXT_ERROR;
			case 'router':
				if(currentContext==CONTEXT_COMPONENTS){
					return CONTEXT_ROUTER;
				}
				return false;
			case 'middleware':
				if(currentContext==CONTEXT_COMPONENTS){
					return CONTEXT_MIDDLEWARE;
				}
				return false;	
			case 'schemas':
				if(currentContext==CONTEXT_MODEL){
					return CONTEXT_SCHEMA;
				}
				return false;
			default:
				return false;
		}
	},
	_addComponent:function(path,name,parentNamespace){
		this._componentFactory.setAppClass(name,path,parentNamespace);
	},
	_handleFile:function(fullPath,fileName,context,parentModules,cb) {
		var name=this.removeExtension(fileName);
		switch(context){
			case CONTEXT_CONTROLLER:
				this._addController(fullPath,name,parentModules);
				cb();
			break;
			case CONTEXT_MODEL:
				this._addModel(fullPath,name,parentModules);
				cb();
			break;
			case CONTEXT_VIEW:
				cb();
			break;
			case CONTEXT_GATEWAYS:
				this._addGateway(fullPath,name,cb);
			break;
			case CONTEXT_COMPONENTS:
				this._addComponent(fullPath,name,parentModules);
				cb();
			break;
			case CONTEXT_ERROR:
				this._addError(fullPath,name,parentModules);
				cb();
			break;
			case CONTEXT_SCHEMA:
				this._addSchema(fullPath,name,parentModules);
				cb();
			break;
			case CONTEXT_ROUTER:
				this._addRouterHandler(fullPath,name,parentModules);
				cb();
			break;
			case CONTEXT_MIDDLEWARE:
				this._addMiddleware(fullPath,name,parentModules);
				cb();
			break;
			default:
				cb();
			break;
		}
	},
	_addMiddleware:function(path,name,parentNamespace){
		if(parentNamespace){
			parentNamespace='middleware.'+parentNamespace;
		}
		else{
			parentNamespace='middleware';
		}
		this._addComponent(path,name,parentNamespace);
	},
	_addRouterHandler:function(path,name,parentNamespace){
		this._routerHandlerFactory.setAppClass(name,path,parentNamespace);
	},
	_addSchema:function(path,name,parentNamespace){
		
		this._schemaFactory.setAppClass(name,path,parentNamespace);

	},
	_addError:function(path,name,parentNamespace){
		this._errorFactory.setAppClass(name,path,parentNamespace);
	},
	
	/**
	 * Adds a gateway
	 * @param {[type]} path [description]
	 * @param {[type]} name [description]
	 */
	_addGateway:function(path,name,cb) {
		this._gatewayFactory.setAppClass(name,path);
		cb();
	},
	_addNamespace:function(moduleName,parentModules,path,context) {
		if(context==CONTEXT_CONTROLLER){
			this._modelFactory.addNamespace(parentModules,path);
			return;
		}
		else if(context==CONTEXT_MODEL){
			this._controllerFactory.addNamespace(parentModules,path);
			return;
		}
		else{
			var namespace=parentModules;
			if(namespace===''){
				namespace=moduleName;
			}
			else{
				namespace+='.'+moduleName;
			}
			this._classFactory.setNamespaceDir(namespace,path);
			return;

		}

	},
	_addModel:function(path,modelName,parentNamespace) {
		this._modelFactory.setAppClass(modelName,path,parentNamespace);
	},
	_addController:function(path,controllerName,parentModules) {
		this._controllerFactory.setAppClass(controllerName,path,parentModules);
	},
	removeExtension:function(name) {
		return name.replace(/\.js$/,'');
	},
	/**
	 * Recursive walk the directory structures
	 * @param  {Function} cb            [description]
	 * @param  {[type]}   dir           [description]
	 * @param  {[type]}   context       [description]
	 * @param  {[type]}   parentModules [description]
	 * @return {[type]}                 [description]
	 * @todo  refatorar mover dir walker para outro classe
	 */
	_walkDir:function(cb,dir,context,parentModules){
		if(!parentModules){
			parentModules='';
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
			if(name.indexOf('.')=='0'){
				return;
			}
			path=dir+'/'+item;
			var stat=fs.statSync(path);
			if( stat.isDirectory()){
				var childContext=self._getDirectoryContext(item,context);
				//We just care about directories on modules ,root and models
				if(context===CONTEXT_MODULE_ROOT || context===CONTEXT_ROOT ){

					//If it's not on a child context we don't handle it
					if(childContext!==false){
					
						self._addNamespace(item,parentModules,path,childContext);
						if( childContext===CONTEXT_GATEWAYS){
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
				else if(context===CONTEXT_MODEL || childContext===CONTEXT_COMPONENTS || childContext==CONTEXT_ROUTER || childContext==CONTEXT_MIDDLEWARE){
					asyncFunctions=asyncFunctions.concat(self._walkDir(false,path,childContext,parentModules));
				}
				else if(context===CONTEXT_MODULE){
					//It's a module lets put it on the map
					self._addNamespace(item,parentModules,path,context);
					var newParentmodules=self._buildNamespace(parentModules,item);
					self._moduleBootstrap.addToEngine(item,path,parentModules);
					//It's a module for all intents all directories here are module names with module structure
					asyncFunctions=asyncFunctions.concat(self._walkDir(false,path,CONTEXT_MODULE_ROOT,newParentmodules));
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

	_appHasConfigFile:function() {
		return  fs.existsSync(this._path+'/config/app.js');
	},
	_finishedWalkingDir:function(cb){
		var self=this;
		return function(err){
			if(err){
				cb(err);
				return;
			}
			var autoCrudSchemas=self._schemaFactory.getAutoCrudSchemas();
			if(!_.isEmpty(autoCrudSchemas)){
				self._controllerFactory.handleAutoSchemaCrud(autoCrudSchemas);
				self._modelFactory.handleAutoSchemaCrud(autoCrudSchemas);
			}
			var requiredCompenents=self._gatewayFactory.getGatewaysRequiredComponents();
			if(!_.isEmpty(requiredCompenents)){
				self._componentFactory.initializeComponents(requiredCompenents);
			}
			self._schemaFactory.initializeSchemas();
			cb();
		}
	},
	buildApp:function(cb) {
		if(!this._appHasConfigFile()){
			//There isn't an app here
			cb();
			return;
		}
		try{
			this._engine.setConfig(this._path+'/config/app.js');
			this._walkDir(this._finishedWalkingDir(cb),this._path,CONTEXT_ROOT);
		}
		catch(e){
			cb(e);
		}
	}

}