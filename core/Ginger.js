var async = require('async');
var util = require('util');
var fs = require('fs');
var _ = require('lodash');
/**
 * Mover component para component factory
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
    /**
     * Components are helpers for the application, like logs,errors, socketIo etc
     */
    this._componentsNameMap = {};
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
     * A map of controller indexes to controller data and objects, all controllers are treated as singleTons
     * @type {Object}
     */
    this.controllerMap = {

    };

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
    var keys = Object.keys(this._gateways);
    var self = this;

    var endCb = function (err) {
        if (err) {
            cb(err);
            return;
        }
        endNextGateway();

    }
    var endNextGateway = function () {
        var k = keys.shift();
        if (!k) {
            cb();
            return;
        }
        try {
            self._gateways[k].end(endCb);
        } catch (err) {
            endCb(err);
        }

    }
    endNextGateway();
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
    var gatewayFactory=this.getBootstrap('GatewayFactory');
    for (var name in this._config.gateways) {
        gatewayFactory.setEngineClass(name);
    }
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
 */
Ginger.prototype.getComponent = function (name,cb,params) {
    var self=this;
    var componentFactory=this.getBootstrap('ComponentFactory');
    //We already made it no need to do it again
    if (!this.isComponentLoaded(name)) {
        //The component is set it's not cancelled
        if (this.isComponentCancelled(name)) {
            self._componentsNameMap[name] = false;
            cb(null,self._componentsNameMap[name]);
        } else {
            var isComponentLoaded;
            var isComponentInitialized;
            var cbCreateComponent=function(err){
                if(err){
                    cb(err);
                    return;
                }
                isComponentInitialized=true;
                //Call the cb just if the component is already loaded also
                if(isComponentLoaded){
                    cb(null,self._componentsNameMap[name]);
                }
            }
            self._componentsNameMap[name]=componentFactory.create(name, params,cbCreateComponent);
            isComponentLoaded=true;
            //Call the cb just if the componet is initialized also
            if(isComponentInitialized){
                 cb(null,self._componentsNameMap[name]);
            }
        }
        return;
    }
    cb(null,this._componentsNameMap[name]);
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
    this._componentsNameMap[name] = component;
};

/**
 * Checks whether a ocmponent has already been loaded
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Ginger.prototype.isComponentLoaded = function (name) {
    return !!this._componentsNameMap[name];
}
Ginger.prototype.isGatewayLoaded = function (name) {
    return !!this._gateways[name];
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
    if (this._config.gateways && this._config.gateways[name] === false) {
        return true;
    }
    return false;
};
Ginger.prototype.isComponentCancelled = function (name) {
    if (this._config.components && this._config.components[name] === false) {
        return true;
    }
    return false;
};



/**
 * Makes the application go live
 * @return {[type]} [description]
 */
Ginger.prototype._launch = function (cb) {
    this._startGateways(cb);
}
/**
 * Loop trough all the gateways and start them
 * @param  {[type]} first_argument [description]
 * @return {[type]}                [description]
 */
Ginger.prototype._startGateways = function (cb) {
    var gatewayFactory=this.getBootstrap('GatewayFactory');
    var asyncFunctions = [];
    var self = this;
    var funcToCreateGateway = function (name, params) {
            return function (asyncCb) {
                var createGatewayCb = function (err, gatewayObj) {
                    if (err) {
                        asyncCb(err);
                        return;
                    }
                    if (gatewayObj) {
                        self.setGateway(name,gatewayObj);
                        
                        gatewayObj.buildRoutes(asyncCb);

                    } else {
                        asyncCb();
                    }

                }
                gatewayFactory.create(name, params,createGatewayCb);
            }
        }
        //Looping trough each gateway to create it assynchronously
    for (var name in this._config.gateways) {
        if (this.isGatewayLoaded(name) || this.isGatewayCancelled(name)) {
            continue;
        }
        asyncFunctions.push(funcToCreateGateway(name, this._config.gateways[name]));
    }
    async.parallel(asyncFunctions, function (err, res) {
        cb(err);
    });
};
/**
 * Return the gateway given by the name
 * @param  {String} name the name of the gateway
 * @return {[type]}      [description]
 */
Ginger.prototype.getGateway = function (name) {
    return this._gateways[name];
};
Ginger.prototype.setGateway = function (name, gateway) {
    this._gateways[name] = gateway;
};

/**
 * Sets the module to the map
 * @type {[type]}
 */
Ginger.prototype.setModule = function (name) {
    this.moduleMap[name] = true;
};
Ginger.prototype.setController = function(name,data) {
    this.controllerMap[name]=data;
};
/**
 * Checks if we have a controller
 * @param  {String}  name index of the controller
 * @return {Boolean}      [description]
 */
Ginger.prototype.hasController = function (name) {
    var controllerFactory=this.getBootstrap('ControllerFactory');
    return controllerFactory.hasElement(name);
}
/**
 * Checks if we have a model
 * @param  {String}  name index of the model
 * @return {Boolean}      [description]
 */
Ginger.prototype.hasModel = function (name) {
    var modelFactory=this.getBootstrap('ModelFactory');
    return modelFactory.hasElement(name);
}
/**
 * Checks if we have a module
 * @param  {String}  name index of the module
 * @return {Boolean}      [description]
 */
Ginger.prototype.hasModule = function (name) {
    return !!this.moduleMap[name];
}
Ginger.prototype.getLib = function(name) {
    return this.libs[name];
};
Ginger.prototype.getError = function(name,data,message,code) {
   var errorFactory=this.getBootstrap('ErrorFactory');
   return errorFactory.create(name,data,message,code);
   
};
module.exports = Ginger;