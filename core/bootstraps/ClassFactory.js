var Class = require('class.extend');
 /**
 * This class handles the initialization of several components, as well as path mapping, inheritances and namespace colisions
 * It's serve as a common library for object,classes and paths lookup
 * @type {Object}
 */
var classFactory={

	//A map of classes in which the namespace class name is the index and the class object the item
	classMap:{

	},
	//A map of classes to it's class path , it is deleted if the class is loaded in our lazy initialization approach to some classes
	classFileMap:{

	},
	//A map of class names to objects, it is handled in our singletons objects
	objectMap:{

	},
	//A map of directories based on the namespace
	namespaceDirMap:{

	}
	/**
	 * Get a class object from the given object
	 * @param  {[type]} namespace [description]
	 * @return {[type]}           [description]
	 */
	getClass:function(name){

	},
	getObject:function(name,params,cb){

	},
	getSingletonObject:function(name,params,cb){

	},
	/**
	 * Sets a class on the given namespace to be the class object
	 * @type {[type]}
	 */
	setClass:function(name,classObject){

	},
	setNamespaceDir:function(name,dir){

	},
	setClassFile:function(name,file){

	},
	setObject:function(name,object){

	}
	/**
	 * Loads a class
	 * @param  {[type]} name [description]
	 * @param  {String} path (optional) if path is not given a path wull be looked on ClassFileMap
	 * @return {[type]}      [description]
	 */
	_loadClass:function(name,path){

	},
	/**
	 * Sets an object on the given namespace 
	 * @param {[type]} name [description]
	 * @param {[type]} obj  [description]
	 */
	_setObject:function(name,obj){

	}
};
module.exports=Class.extend(classFactory);

