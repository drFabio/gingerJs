var express = require('express');
var http=require('http');
/**
 * Simple Express component
 */
function Express(engine){
	this._express;
	this._app;
	this._params;
	this.server;
}
Express.prototype.init = function(engine,params) {
	this._engine=engine;
	this._params=params;
	this._app = express();
};

Express.prototype.listen = function(cb,port,host) {
	var self=this;
	port=port || this._params.port;
	host=host || this._params.host;
	this.server=this._app.listen(port,host, function(err) {
		cb(err);

		
	});
};
Express.prototype.getApp=function(){
	return this._app;
}
Express.prototype.end=function(){
	this.server.close();
	
}
module.exports=Express;