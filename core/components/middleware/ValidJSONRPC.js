var _=require('lodash');
module.exports= {

    getMiddleware: function(controllerObj,gateway) {
        var self=this;
        return function(req, res, next) {
            if (_.isEmpty(req.body) && !_.isEmpty(req.query)) {
                req.body = req.query;
            }
            if (!req.body) {
                var err=self._engine.getError('InvalidRequest','Missing parameters');
                gateway._sendError(req,res,err,id);
                return;
            }

            var method = req.body.method;
            var id = req.body.id;
            req.JSONRPC={
                method:method,
                id:id
            };
            if (typeof(id) == 'undefined') {

                var err=self._engine.getError('InvalidRequest','Missing id');
                gateway._sendError(req,res,err,id);
                return;
            }
            if (!method) {
                var err=self._engine.getError('InvalidRequest','Missing method');
                gateway._sendError(req,res,err,id);
                return;
            }
            if (!controllerObj.actionExists(method)) {
                var err=self._engine.getError('MethodNotFound',method + ' not found');
                gateway._sendError(req,res,err,id);
                return;
            }
            //Remove the json params an make the body as the parasm
            req.body = req.body.params;
            req.jsonRPC={
                id:id,
                method:method
            },
            req.query=req.body;
            if(!req.query){
                req.query={};
            }
            res.send=gateway._getSendProxy(res,id);
            next();
        }
    },
};