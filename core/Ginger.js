var async = require('async');
var util = require('util');
var fs = require('fs');
var _ = require('lodash');
/**
 * @type {Object}
 */
var libs = {
    async: async,
    util: util,
    fs: fs,
    _: _,
};
/**
 * The application main Ginger
 */
function Ginger() {
    this._closeQueue=[];
    /**
     * Bootstrapers are used to launch the application, they are factories for the application startup
     * @type {Object}
     */
    this._bootstrap = {};
    /**
     * gateWays to access the application like socketIO,JSONRPC ,HTTP etc
     */
    this._gateways = {};
    /**
     * The configuration file to use, it can be set and optionally merged with the default
     * @type {Object}
     */
    this._config = {};
    /**
     * Just a map of all modules that we have
     * @type {Object}
     */
    this.moduleMap = {

    };

    /**
     * The path to the application.It can set programmatically,by config data or if everything file it will be proccess.cwd
     * @type {String}
     */
    this._appPath = null;

    /**
     * Function to check if we can launch the application
     * @param  {Ginger} ginger
     * @return {[type]}        [description]
     */
    this._preLaunchFunction = function (ginger, cb) {
        cb();
    }
    this.libs = libs;
    /**
     * Config relative to the engine initialization, you should be able to overwrite it but should not
     */
    this._engineConfig;
}

/**
 * Closes the application
 * @param  {Function} cb CallBack for completition
 */
Ginger.prototype.down = function (cb) {
    async.series(this._closeQueue,cb);

};

Ginger.getDefaultConfig = function () {
    return require(__dirname + '/config/defaultApp.js');
};
Ginger.prototype._setupEngineConfig = function() {
    this._engineConfig = require(__dirname + '/config/defaultEngine.js');
};
Ginger.prototype._setConfigAsDefaultIfNoneSet = function() {
    if (_.isEmpty(this._config)) {
        this._config = Ginger.getDefaultConfig();
    }
};
Ginger.prototype._setNamespaceFromEngineConfig = function(name,configValue) {
    this.libs.classFactory.setNamespaceDir(name,this.getEngineConfigValue(configValue));
};
Ginger.prototype._setClassFactory = function(first_argument) {
    var OliveOil=require('olive_oil')();
    var oliveOil=new OliveOil(null);
    this.libs.classFactory=oliveOil;
};
Ginger.prototype._setDefaultNamespaces = function() {
    this._setNamespaceFromEngineConfig('ginger','rootDir');
    this._setNamespaceFromEngineConfig('ginger.bootstraps','bootstrapsDir');
    this._setNamespaceFromEngineConfig('ginger.components','componentsDir');
    this._setNamespaceFromEngineConfig('ginger.gateways','gatewaysDir');
    this._setNamespaceFromEngineConfig('ginger.mvc','mvcDir');
    this._setNamespaceFromEngineConfig('ginger.errors','errorsDir');
};
Ginger.prototype._setGatewaysClasses = function() {
    for (var name in this._config.gateways) {
        this._gatewayFactory.setEngineClass(name);
    }
};
Ginger.prototype.addFunctionToCloseQueue = function(functionToClose) {
    this._closeQueue.push(functionToClose);
};

/**
 * Starts the application
 * @param  {Mixed} config String of the config file or config data
 * @return {[type]}        [description]
 */
Ginger.prototype.up = function (cb) {
    this._setConfigAsDefaultIfNoneSet();
    this._setupEngineConfig();
    this._setClassFactory();
    this._setDefaultNamespaces();
    this._gatewayFactory=this.getBootstrap('GatewayFactory');
    this._componentFactory=this.getBootstrap('ComponentFactory');
    var self = this;
    var startAppCb = function (err) {
        if (err) {
            cb(err);
            return;
        } else {
            var preLaunchCb = function (err) {
                //If the preLaunch didn't work we call the callback with the error
                if (err) {
                    cb(err);
                    return;
                }
                //The preLaunch worked try to launch
                self._launch(cb);
            }
            if (self._preLaunchFunction) {
                //Calling prelaunch function if any
                self._preLaunchFunction(self, preLaunchCb)

            } else {
                self._launch(cb);
            }
        }
    }
    this._setupApp(startAppCb);
};
Ginger.prototype.setPreLaunchFunction = function (prelaunchFunction) {
    this._preLaunchFunction = prelaunchFunction;
}
Ginger.prototype._setNoNamespaceDirToAppRoot = function() {
    this.libs.classFactory.setNoNamespaceDir(this._appPath);
};

Ginger.prototype._setupApp = function (cb) {
    //Trying to get the app params if any
    var appInit = this.getBootstrap('AppBootstrap');
    //There is no app path set one
    if (!this._appPath) {
        this.setAppPath();
    }
    this._setNoNamespaceDirToAppRoot();
    appInit.setApplicationPath(this._appPath);
    try {
        appInit.buildApp(cb);
    } catch (err) {
        throw err;
        cb(err);
    }
}

Ginger.prototype.loadAppFile = function (name) {
    return require(this._config['app']['dir'] + name);
}
/**
 * Get a model on the app model directory
 * @return {[type]} [description]
 */
Ginger.prototype.getModel = function (name) {
    var modelFactory=this.getBootstrap('ModelFactory');
    return modelFactory.create(name);
}
/**
 * Get a view starting from the view directory
 * @param  {[type]} name     [description]
 * @param  {[type]} inherits [description]
 * @return {[type]}          [description]
 */
Ginger.prototype.getView = function (name) {

}
/**
 * Get a value from the config
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Ginger.prototype.getConfigValue = function (name) {
    if (!!this._config && this._config[name]) {
        return this._config[name];
    }

    return null;
};

Ginger.prototype.getEngineConfigValue = function (name) {
    if (!!this._engineConfig && this._engineConfig[name]) {
        return this._engineConfig[name];
    }

    return null;
};

Ginger.prototype.getConfig = function () {
    return this._config;
};
/**
 * Get the configuration merging it with the current config
 * @param  {mixed} config String or Object
 * @return {[type]}        [description]
 */
Ginger.prototype.setConfig = function (config, merge) {
    merge = merge !== false;

    if (typeof (config) == 'string') {
        this._config = require(config);
    } else {
        this._config = config;
    }
    if (merge) {
        this._config = _.merge({}, Ginger.getDefaultConfig(), this._config);
    }

};

/**
 * Sets the application path, if there is a path this is used, if there is a config['app']['dir'] it's used, the proccess.cwd is used otherwise
 * @param {String} path (Optional) the path to the app
 */
Ginger.prototype.setAppPath = function (path) {
    if (path) {
        this._appPath = path;
    } else if (!!this._config && !!this._config['app'] && !!this._config['app']['dir']) {
        this._appPath = this._config['app']['dir'];
    } else {
        this._appPath = process.cwd();
  
    }
};
/**
 * Get a singleton component (if it doesn't exists it is created,it it exists the same one is used)
 * @param  {String} name   The name of the component
 * @param  {object} params (Optional) if not given it will be used the one from the application config, if the application config doesn't implement it the abstract config will be used
 * @return {[type]}        [description]
 * @todo  clean
 */
Ginger.prototype.getComponent = function (name,params) {
  return  this._componentFactory.create(name,params);
}
Ginger.prototype.getBootstrap = function (name, params) {
    var fullName='ginger.bootstraps.'+name;
    if (!this.libs.classFactory.isObjectSet(fullName)) {
        this._bootstrap[name] = this._createBootstrap(fullName, params);
    }
    return this._bootstrap[name];
}


/**
 * Set a component on the given scope, if the component is already set, it will be overwritten
 * @param {[type]} name      [description]
 * @param {[type]} component [description]
 */
Ginger.prototype.setComponent = function (name, component) {
   return this._componentFactory.setElement(name,component);
};

/**
 * Checks whether a ocmponent has already been loaded
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Ginger.prototype.isComponentLoaded = function (name) {
   return this._componentFactory.isLoaded(name);
}
Ginger.prototype.isGatewayLoaded = function (name) {
    return this._gatewayFactory.isGatewayLoaded(name);
}

/**
 * Creates a component based on the name
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Ginger.prototype._createBootstrap = function (name, params) {
    if (!params) {
        //Trying to get params configuration if none is passed
        if (this._engineConfig.bootstrap && !!this._engineConfig.bootstrap[name]) {
            params = this._engineConfig.bootstrap[name];
        } else {
            params = {};
        }
    }
    var ret=this.libs.classFactory.getSingletonObject(name,this,params);
    return ret;
};
Ginger.prototype.isGatewayCancelled =function (name) {
    return this._gatewayFactory.isGatewayCancelled(name);
};
Ginger.prototype.isComponentCancelled = function (name) {
   return this._componentFactory.isCancelled(name);
};



/**
 * Makes the application go live
 * @return {[type]} [description]
 */
Ginger.prototype._launch = function (cb) {
       this._gatewayFactory.startGateways(cb);
}
/**
 * Return the gateway given by the name
 * @param  {String} name the name of the gateway
 * @return {[type]}      [description]
 */
Ginger.prototype.getGateway = function (name) {
    return this._gatewayFactory.getGateway(name);
};

/**
 * Checks if we have a controller
 * @param  {String}  name index of the controller
 * @return {Boolean}      [description]
 */
Ginger.prototype.hasController = function (name) {
    var controllerFactory=this.getBootstrap('ControllerFactory');
    return controllerFactory.hasElement(name);
};
Ginger.prototype.getController = function(name) {
    var controllerFactory=this.getBootstrap('ControllerFactory');
    return controllerFactory.create(name);
};
/**
 * @param  {String}  name index of the model
 * @return {Boolean}      [description]
 */
Ginger.prototype.hasModel = function (name) {
    var modelFactory=this.getBootstrap('ModelFactory');
    return modelFactory.hasElement(name);
}
Ginger.prototype.hasSchema = function(name) {
    var schemaFactory=this.getBootstrap('SchemaFactory');
    return schemaFactory.hasElement(name);
};
/**
 * @param  {String}  name index of the module
 * @return {Boolean}      [description]
 */
Ginger.prototype.hasModule = function (name) {
    var moduleFactory=this.getBootstrap('ModuleBootstrap');
    return moduleFactory.hasElement(name);
}
Ginger.prototype.getLib = function(name) {
    return this.libs[name];
};
Ginger.prototype.getError = function(name,message,data,code) {
   var errorFactory=this.getBootstrap('ErrorFactory');
   return errorFactory.create(name,message,data,code);
   
};
module.exports = Ginger;