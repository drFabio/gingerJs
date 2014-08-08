var _=require('lodash');
var ERRORS_MAP={
    'PARSE_ERROR':'-32700',
    'INVALID_REQUEST':'-32600',
    'NOT_FOUND':'-32601',
    'INVALID_PARAMS':'-32602',
    'INTERNAL':'-32603',
    'SERVER_ERROR':'-32000'//-32000 to -32099 default implementations errors 
};  
module.exports = {
    parent: 'ginger.gateways.HTTP',
    _buildUrl: function(name, action) {
        return '/' + name.replace(/\./g, '/');
    },
    _buildRoute: function(controllerName, action, controllerData) {},
    _buildError:function(error,id){
      var code=ERRORS_MAP[error.code];
        message=error.message;
        var data=error.data;
        if(!error.data){
            data=error.message;
        }
        var jsonError= {code:code,message:message,data:data}
        return  {id:id,error:jsonError,"version":"2.0"};
    },
    _buildResult:function(result,id){
        return {id:id,result:result,"version":"2.0"};
    },
    _sendError:function(req,res,error,id,id){

        var response= this._buildError(error,id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
    },
    /**
     * @TODO Move to a especif middlewar place?s
     */
    _validJsonMiddleWare: function(controllerObj) {
        var self = this;
        return function(req, res, next) {
            if (_.isEmpty(req.body) && !_.isEmpty(req.query)) {
                req.body = req.query;
            }
            if (!req.body) {
                var err=self._engine.getError('InvalidRequest','Missing parameters');
                self._sendError(req,res,err,id);
                return;
            }

            var method = req.body.method;
            var id = req.body.id;
            if (typeof(id) == 'undefined') {

                var err=self._engine.getError('InvalidRequest','Missing id');
                self._sendError(req,res,err,id);
                return;
            }
            if (!method) {
                var err=self._engine.getError('InvalidRequest','Missing method');
                self._sendError(req,res,err,id);
                return;
            }
            if (!controllerObj.hasAction(method)) {
                var err=self._engine.getError('NotFound',method + ' not found');
                self._sendError(req,res,err,id);
                return;
            }
            //Remove the json params an make the body as the parasm
            req.body = req.body.params;
            res.send=self._getSendProxy(res,id);
            next();
        }
    },
    _getSendProxy:function(res,id){
        var self=this;
        var oldSend=res.send;

        return function(body){
            var statusCode=200;
            if (2 == arguments.length) {
                // res.send(body, status) backwards compat
                if ('number' != typeof body && 'number' == typeof arguments[1]) {
                    statusCode = arguments[1];
                } else {
                    statusCode = body;
                    body = arguments[1];
                }
            }
            var response;
            var result;
            var error;
            /**
             * @todo find better way to identify error
             */
            if(body.isError===true){
                error=body;
            }
            else{
                result= body;

            }
           response=self.buildResponse(id,error,result);
            res.setHeader('Content-Type', 'application/json');
            oldSend.call(res,response);
        }
    },
    buildResponse:function(id,error,result){
        var resp;
        if(error){

            resp= this._buildError(error,id);

        }
        else{
          resp=this._buildResult(result,id);
        }
        return JSON.stringify(resp);
    },
    _addRouteToApp: function(action, url, controllerObj, controllerData) {
       var actionFunction=controllerObj.getActionFunctionByName(action);
        var controllerFunc=controllerObj[actionFunction].bind(controllerObj);
        this._app.post(url, this._validJsonMiddleWare(controllerObj), controllerFunc);
    }
}