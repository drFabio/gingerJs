var _=require('lodash');
var ERRORS_MAP={
    'PARSE_ERROR':'-32700',
    'INVALID_REQUEST':'-32600',
    'NOT_FOUND':'-32601',
    'INVALID_PARAMS':'-32602',
    'INTERNAL':'-32603',
    'Server error':'-32000'//-32000 to -32099 default implementations errors 
};  
module.exports = {
    parent: 'ginger.gateways.HTTP',
    _buildUrl: function(name, action) {
        return '/' + name.replace(/\./g, '/');
    },
    _buildRoute: function(controllerName, action, controllerData) {},
    _sendError:function(req,res,error){
        console.log(error);
        var code=ERRORS_MAP[error.code];
        message=error.message;
        var data=error.data;
        if(!error.data){
            data=error.message;
        }
        var jsonError= {code:code,message:message,data:data}
        var response= {id:req.body.id,error:jsonError,"version":"2.0"};
        res.status(200).send(JSON.stringify(response));
    },

    _validJsonMiddleWare: function(controllerData) {
        var self = this;
        console.log("AQUIII");
        return function(req, res, next) {
            console.log('No validation middleware');
            if (_.isEmpty(req.body) && !_.isEmpty(req.query)) {
                req.body = req.query;
            }
            if (!req.body) {
                var err=self._engine.getError('InvalidRequest','Missing parameters');
                self._sendError(req,res,err);
                return;
            }

            var method = req.body.method;
            var id = req.body.id;
            if (typeof(id) == 'undefined') {
                var err=self._engine.getError('InvalidRequest','Missing id');
                self._sendError(req,res,err);
                return;
            }
            if (!method) {
                var err=self._engine.getError('InvalidRequest','Missing method');
                self._sendError(req,res,err);
                return;
            }
            var actionName = method + 'Action';
            if (!controllerData.actions[actionName]) {
                var err=self._engine.getError('NotFound',method + ' not found');
                self._sendError(req,res,err);
                return;
            }
            //Remove the json params an make the body as the parasm
            req.body = req.body.params;

            next();
        }
    },
    _addRouteToApp: function(action, url, controllerObj, controllerData) {
        var actionFunction = controllerData.actions[action];
        var controllerFunc = controllerObj[actionFunction].bind(controllerObj);
        this._app.post(url, this._validJsonMiddleWare(controllerData), controllerFunc);
    }
}