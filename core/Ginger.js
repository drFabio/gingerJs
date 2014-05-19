var async = require('async');
var util = require('util');
var fs = require('fs');
var _ = require('lodash');
var Class = require('class.extend');
var libs = {
    async: async,
    util: util,
    fs: fs,
    _: _,
    Class: Class
};
/**
 * The application main Ginger
 */
function Ginger() {
    /**
     * Components are helpers for the application, like logs,errors, socketIo etc
     */
    this._components = {};
    /**
     * Bootstrapers are used to launch the application, they are factories for the application startup
     * @type {Object}
     */
    this._bootstrappers = {};
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
     * A map of models indexes and model classes
     * @type {Object}
     */
    this.modelMap = {

    };
    /**
     * Just a map of all modules that we have
     * @type {Object}
     */
    this.moduleMap = {

    };
    /**
     * A map of the gateways by name
     * @type {Object}
     */
    this.gatewayMap = {

    };
    /**
     * The path to the application.It can set programmatically,by config data or if everything file it will be proccess.cwd
     * @type {String}
     */
    this._appPath = null;
    /**
     * Map of the abstract classes that we use to extend our models,controllers and gateways
     * @type {Object}
     */
    this._abstractClasses = {
        'gateway': null,
        'model': null,
        'controller': null
    };
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
/**
 * Returns the default config data
 * @return {[type]} [description]
 */
Ginger.getDefaultConfig = function () {
    return require(__dirname + '/config/defaultApp.js');
};
/**
 * Starts the application
 * @param  {Mixed} config String of the config file or config data
 * @return {[type]}        [description]
 */
Ginger.prototype.up = function (cb) {

    if (_.isEmpty(this._config)) {
        this._config = Ginger.getDefaultConfig();
    }
    this._engineConfig = require(__dirname + '/config/defaultEngine.js');

    this._loadAbstracts();
    var self = this;
    var startAppCb = function (err) {
        if (err) {
            cb(err);
            return;
        } else {
            //if there isn't a config we set it

            var preLaunchCb = function (err) {
                //If the preLaunch didn't work we call the callbackj with the error
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
    this._startApp(startAppCb);
};
Ginger.prototype.setPreLaunchFunction = function (prelaunchFunction) {
    this._preLaunchFunction = prelaunchFunction;
}
/**
 * Loads the abstract Gateway,Model and Controllers
 * @return {[type]} [description]
 */
Ginger.prototype._loadAbstracts = function () {

    this._abstractClasses['gateway'] = Class.extend(require(this.getConfigValue('abstractGatewayPath')));
    // this._abstractClasses['gateway']=require(this.getConfigValue('abstractGateway)]);
    this._abstractClasses['model'] = Class.extend(require(this.getConfigValue('abstractModelPath')));
    this._abstractClasses['controller'] = Class.extend(require(this.getConfigValue('abstractControllerPath')));

}
/**
 * Starts the application using the AppInitializer component
 * @param  {Function} cb [description]
 *
 */
Ginger.prototype._startApp = function (cb) {
    //Trying to get the app params if any
    var appInit = this.getBootstrapper('AppBootstrap');
    //There is no app path set one
    if (!this._appPath) {
        this.setAppPath();
    }
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
    var ModelClass = this.modelMap[name];
    if (!ModelClass) {
        return null;
    }
    var ret = new ModelClass(this);
    return ret;
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
        //It still doesn't have n application path
        //return false;
    }
};
/**
 * Get a singleton component (if it doesn't exists it is created,it it exists the same one is used)
 * @param  {String} name   The name of the component
 * @param  {object} params (Optional) if not given it will be used the one from the application config, if the application config doesn't implement it the abstract config will be used
 * @return {[type]}        [description]
 */
Ginger.prototype.getComponent = function (name, params) {
    name = name.toLowerCase();
    if (!this.isComponentLoaded(name)) {
        if (this.isComponentSet(name)) {
            this._components[name] = this._createComponent(name, params);
        } else {
            this._components[name] = null;
        }
    }
    return this._components[name];
}


/**
 * Get a component if it doesn't exists it is created
 * @param  {String} name   The name of the component
 * @param  {object} params (Optional) if not given it will be used the one from the application config, if the application config doesn't implement it the abstract config will be used
 * @return {[type]}        [description]
 */
Ginger.prototype.getBootstrapper = function (name, params) {

    if (!this.isBootstrapperLoaded(name)) {
        this._bootstrappers[name] = this._createBootstrapper(name, params);
    }
    return this._bootstrappers[name];
}


/**
 * Set a component on the given scope, if the component is already set, it will be overwritten
 * @param {[type]} name      [description]
 * @param {[type]} component [description]
 */
Ginger.prototype.setComponent = function (name, component) {
    name = name.toLowerCase();
    this._components[name] = component;
};
/**
 * Check whether a component is set, if it's avaible trough config
 * @param  {[type]}  name [description]
 * @return {Boolean}      [description]
 */
Ginger.prototype.isComponentSet = function (name) {

    if (this._config.components) {
        if (this._config.components[name] === false) {
            return false;
        } else if (!!this._config.components[name]) {
            return true;

        }
    }

    return false;
}
/**
 * Checks whether a ocmponent has already been loaded
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Ginger.prototype.isComponentLoaded = function (name) {
    return !!this._components[name];
}
Ginger.prototype.isGatewayLoaded = function (name) {
    return !!this._gateways[name];
}
Ginger.prototype.isBootstrapperLoaded = function (name) {
    return !!this._bootstrappers[name];
}

/**
 * Creates a component based on the name
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Ginger.prototype._createBootstrapper = function (name, params) {
    var path;
    var BootStraperClass;
    if (!params) {

        //Trying to get params configuration if none is passed
        if (this._engineConfig.bootstrappers && !!this._engineConfig.bootstrappers[name]) {
            params = this._engineConfig.bootstrappers[name];
        } else {
            params = {};
        }
    }

    path = this._engineConfig.bootstrapDir + name + '.js';
    if (fs.existsSync(path)) {
        BootStraperClass = require(path);

    } else {
        return null;
    }
    var ret = new BootStraperClass(this);
    ret.init(this, params);
    return ret;
};
Ginger.prototype.isComponentCancelled = function (name) {
    if (this._config.components && this._config.components[name] === false) {
        return true;
    }
    return false;
}
Ginger.prototype.isGatewayCancelled = function (name) {
    if (this._config.gateways && this._config.gateways[name] === false) {
        return true;
    }
    return false;
}

/**
 * Creates a component based on the name
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Ginger.prototype._createComponent = function (name, params) {
    name = name.toLowerCase();
    var path;
    var ComponentsClass;
    if (!params) {
        //If the user cancelled the component
        if (this.isComponentCancelled(name)) {
            return null;
        }
        //Trying to get params configuration if none is passed
        if (this._config.components && !!this._config.components[name]) {

            params = this._config.components[name];
        } else {
            params = {};
        }
    }

    var appComponentDir = this.getConfigValue('componentDir');

    var getComponent = function (dir, name) {

        path = dir + name + '.js';
        if (fs.existsSync(path)) {
            return require(path);
        }
        return null;
    };
    //The user set a component dir
    if (appComponentDir) {
        if (_.isArray(appComponentDir)) {
            for (var x in appComponentDir) {
                ComponentsClass = getComponent(appComponentDir[x], name);
                if (ComponentsClass) {
                    break;
                }
            }
        } else {
            ComponentsClass = getComponent(appComponentDir, name);
        }
    }
    //Didn't found the component yet, try the engine ones
    if (!ComponentsClass) {
        ComponentsClass = getComponent(this._engineConfig.componentDir, name);
        if (!ComponentsClass) {
            return null;
        }

    }

    var ret = new ComponentsClass(this);
    ret.init(this, params);
    return ret;
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
    //Functions that we will use to initialize the gateways
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
                        self._gateways[name] = gatewayObj;
                        self._gateways[name].buildRoutes(asyncCb);
                    } else {
                        asyncCb();
                    }

                }
                self.createGateway(createGatewayCb, name, params);
            }
        }
        //Looping trough each gateway to create it assynchronously
    for (var name in this._config.gateways) {
        if (this.isGatewayLoaded(name)) {
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
 * Get the core gigner gateway class
 * @param  {[type]} name   [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
Ginger.prototype.getGingerGatewayClass = function (name, params) {
    return this.getGatewayClass(name, params, true);
}
/**
 * [getGatewayClass description]
 * @param  {String} name       The name of the component that we will search on the configs
 * @param  {[type]} params     [description]
 * @param  {boolean} getDefault (optional) If we should get the default gateway
 * @param  {String} path       (optional) the path to the component
 * @return {[type]}            [description]
 */
Ginger.prototype.getGatewayClass = function (name, params, getDefault, path) {
    var gatewayData;
    if (this.isGatewayCancelled(name)) {
        return false;
    }
    if (!params) {
        //If the user cancelled the component
        //Trying to get params configuration if none is passed
        if (!getDefault && this._config.gateways && !!this._config.gateways[name]) {
            params = this._config.gateways[name];
        }

    }
    if (!path) {

        if (getDefault) {
            path = this._engineConfig.gatewayDir + name + '.js';
        }
        //It was not given us a path
        else {
            path = this._config.gatewayDir + name + '.js';
        }
    }
    if (fs.existsSync(path)) {
        gatewayData = require(path);
    } else {
        return false;
    }

    var ret;
    var GatewayClass;

    //This have a factory method invoke it
    if (gatewayData.factory) {
        return gatewayData;
    } else {
        if (gatewayData.inheritsAbstract) {
            GatewayClass = this._abstractClasses['gateway'].extend(gatewayData);
            // GatewayClass.prototype=_.extend(GatewayClass.prototype,this._abstractClasses['gateway'].prototype);
        } else {
            GatewayClass = Class.extend(gatewayData);
        }
        return GatewayClass;
    }
};
/**
 * Try to create the gateway first using the app data, them the default (If you pass getDefault by true it will create the default)
 * @param  {[type]} name   [description]
 * @param  {[type]} params [description]
 * @return {Object}        The gateway object or null if not found
 */
Ginger.prototype.createGateway = function (cb, name, params, getDefault, path) {
    var GatewayClass = this.getGatewayClass(name, params, getDefault, path);
    if (GatewayClass === false) {
        cb(null, false);
        return;
    }
    if (GatewayClass.factory) {
        GatewayClass.factory(this, params, cb);
    } else {
        new GatewayClass(this, params, cb);
    }

};

/**
 * Sets the controller to the map
 * @param {[type]} name [description]
 * @param {[type]} data [description]
 */
Ginger.prototype.setController = function (name, data) {
    name = name.toLowerCase();
    this.controllerMap[name] = data;
}
Ginger.prototype.setModel = function (name, data) {
    name = name.toLowerCase();
    this.modelMap[name] = data;
}
/**
 * Sets the module to the map
 * @type {[type]}
 */
Ginger.prototype.setModule = function (name) {
    name = name.toLowerCase();
    this.moduleMap[name] = true;
};
/**
 * Checks if we have a controller
 * @param  {String}  name index of the controller
 * @return {Boolean}      [description]
 */
Ginger.prototype.hasController = function (name) {
    name = name.toLowerCase();

    return !!this.controllerMap[name];
}
/**
 * Checks if we have a model
 * @param  {String}  name index of the model
 * @return {Boolean}      [description]
 */
Ginger.prototype.hasModel = function (name) {
    name = name.toLowerCase();
    return !!this.modelMap[name];
}
/**
 * Checks if we have a module
 * @param  {String}  name index of the module
 * @return {Boolean}      [description]
 */
Ginger.prototype.hasModule = function (name) {
    name = name.toLowerCase();
    return !!this.moduleMap[name];
}
module.exports = Ginger;