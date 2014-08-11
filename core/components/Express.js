var express = require('express');
var http=require('http');
module.exports={
	init:function(engine,params) {
		this._super(engine,params);
		this.server=null;
		this._isRunning=false;
		this._isClosed=false;
		this._app = express();
		var bodyParser = require('body-parser');
		this._app.use(bodyParser.json());      
		this._app.use(bodyParser.urlencoded({extended: true})); 
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
			self._addFunctionToClose();
			cb(err);

			
		});
	},
	_addFunctionToClose:function(){
	 	var self=this;
	 	var func=function(cb){
	 		self.end();
	 		cb();
	 	}
		this._engine.addFunctionToCloseQueue(func);
	},
	getApp:function(){
		return this._app;
	},
	end:function(){
		if(this._isRunning && !this._isClosed){
			this._isClosed=true;
			this._isRunning=false;
			this.server.close();
			return;
		}
		
	}
}