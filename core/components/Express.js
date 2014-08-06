var express = require('express');
var http=require('http');
module.exports={
	init:function(engine,params,cb) {
		this._express=null;
		this._app=null;
		this._params=null;
		this.server=null;
		this._isRunning=false;
		this._isClosed=false;

		this._engine=engine;
		this._params=params;
		this._app = express();
		var bodyParser = require('body-parser');
		this._app.use(bodyParser.json());      
		this._app.use(bodyParser.urlencoded({extended: true})); 
		cb();
	},
	isRunning:function(){
		return this._isRunning;
	},
	listen:function(cb,port,host) {
		if(this.isRunning()){
			console.log("ESTAVA RODNADO");
			cb();
			return;
		}
		console.log("STARTUBBB");
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
		console.log("END");
		if(this._isRunning && !this._isClosed){
			console.log("REALLY END");
			this._isClosed=true;
			this._isRunning=false;
			this.server.close();
		}
		
	}
}