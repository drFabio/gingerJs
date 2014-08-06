var express = require('express');
var http=require('http');
module.exports={
	_express:null,
	_app:null,
	_params:null,
	server:null,
	_isRunning:false,
	_isClosed:false,
	init:function(engine,params,cb) {
		this._engine=engine;
		this._params=params;
		this._app = express();
		cb();
	},
	isRunning:function(){
		return this._isRunning;
	},
	listen:function(cb,port,host) {
		if(this.isRunning()){
			cb();
			return;
		}
		var self=this;
		port=port || this._params.port;
		host=host || this._params.host;
		this.server=this._app.listen(port,host, function(err) {
			if(!err){
				self._isRunning=true;
			}
			cb(err);

			
		});
	},
	getApp:function(){
		return this._app;
	},
	end:function(){
		if(this._isRunning && !this._isClosed){
			this._isClosed=true;
			this._isRunning=false;
			this.server.close();
		}
		
	}
}