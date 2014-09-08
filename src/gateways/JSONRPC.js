var _=require('lodash');
var ERRORS_MAP={
    'PARSE_ERROR':'-32700',
    'INVALID_REQUEST':'-32600',
    'NOT_FOUND':'-32001',
    'INVALID_PARAMS':'-32602',
    'INTERNAL':'-32603',
    'FORBIDDEN':'-32001',
    'METHOD_NOT_FOUND':'-32601',
    'SERVER_ERROR':'-32000'//-32000 to -32099 default implementations errors 
};  
module.exports = {
    parent: 'ginger.gateways.HTTP',
    _buildRoute: function(controllerName, action, controllerData) {},
    _buildError:function(error,id){
      var code=ERRORS_MAP[error.code];
      if(!code){
        code=ERRORS_MAP['SERVER_ERROR'];
      }
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
    _getDefaultMiddlewares:function(){
        return ['ValidJSONRPC','JSONMiddlewareProxy'];
    },
    _sendError:function(req,res,error,id){
        var response= this._buildError(error,id);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(response));
    },
    _getRouterHandlerComponent:function(){
        return this._engine.getRouterHandler('JSONRPC');
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
            if(body){
                /**
                 * @todo find better way to identify error
                 */
                if(!!body.name && body.name.indexOf('Error')!=-1){
                    error=body;
                    error.data=body.errors;
                }
                else if(body.isError===true){
                    error=body;
                }
                else{
                    result= body;
                    if(!result){
                        result=true;
                    }

                }
            }
            else{
                result=true;
            }
           response=self.buildResponse(id,error,result);
            res.setHeader('Content-Type', 'application/json');
            oldSend.call(res,response);
        }
    },
    _getHTTPVerb:function(routeVerb){
        return 'post';
    },
    _handleControllerRoutes:function(controllerData){
        var controllerObj=this._createController(controllerData);
        this._handleControllerAction(null,controllerObj,controllerData);
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
    _addRouteToApp:function(action,url,controllerObj,controllerData){
        var verb='post';//always post
        //Just the default middlewares the remaining are handled by the proxy middleware
        var middlewares=this._getDefaultMiddlewares();
        var argsToAdd=[url];
        var self=this;
        middlewares.forEach(function(m){
            var middleware=this._engine.getComponent('middleware.'+m);
            argsToAdd.push(middleware.getMiddleware(controllerObj,self,controllerData));
        },this);

        argsToAdd.push(function(req,res){
            var actionFunction=controllerObj.getActionFunctionByName(req.JSONRPC.method);
            var controllerFunction=controllerObj[actionFunction].bind(controllerObj);
            controllerFunction(req,res);
        });
        this._app[verb].apply(this._app,argsToAdd);
    
    }
}