var express = require('express');
var http=require('http');
module.exports={
	_express:null,
	_app:null,
	_params:null,
	server:null,

	init:function(engine,params,cb) {
		this._engine=engine;
		this._params=params;
		this._app = express();
		cb(null);
	},

	listen:function(cb,port,host) {
		var self=this;
		port=port || this._params.port;
		host=host || this._params.host;
		this.server=this._app.listen(port,host, function(err) {
			cb(err);

			
		});
	},
	getApp:function(){
		return this._app;
	},
	end:function(){
		this.server.close();
		
	}
}