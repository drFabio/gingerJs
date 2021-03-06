module.exports={
	init:function(engine,params) {
		this._super(engine,params);
		var expressComponent=engine.getComponent('express');
		var app=expressComponent.getApp();	
		var self=this;
		var cookieParser = require('cookie-parser');
		var session =this._getSession();
		app.use(cookieParser());
		app.use(session(self._params));	
	},
	_getSession:function(){
		return require('express-session');
	}
}