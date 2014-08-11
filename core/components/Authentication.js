var passport = require('passport');
module.exports={
	init:function(engine,params) {
		this._super(engine,params);
		var expressComponent=engine.getComponent('express');
		var app=expressComponent.getApp();	
		app.use(passport.initialize());
		app.use(passport.session()); // persistent login sessions

		if(!engine.hasModel(this._params.model)){
			throw new Error('The authentication component needs the '+this._params.model+' to work (you can change the name of the model trough the config)');
		}
		this._model=engine.getModel(this._params.model);
		this.setLoginStrategy();
	},
	setLoginStrategy:function(){
		var LocalStrategy   = require('passport-local').Strategy;
		passport.use(new LocalStrategy(this._model.login));	
		passport.serializeUser(function(user, done) {
	        done(null, user);
	    });
	    passport.deserializeUser(function(user, done) {
	            done(null, user);
	    });

	}

}