var passport = require('passport');
module.exports={
	init:function(engine,params) {
		this._super(engine,params);
		this.setupPassport();
		this.setLoginStrategy();
	},
	setupPassport:function(){
		var expressComponent=this._engine.getComponent('express');
		var app=expressComponent.getApp();	
		app.use(passport.initialize());
		this._passport=passport;
		app.use(passport.session()); // persistent login sessions
/*
		if(!engine.hasModel(this._params.model)){
			throw new Error('The authentication component needs the '+this._params.model+' to work (you can change the name of the model trough the config)');
		}
		this._model=engine.getModel(this._params.model);*/
	},
	getPassport:function(){
		return this._passport;
	},
	setLoginStrategy:function(){
		/*var LocalStrategy   = require('passport-local').Strategy;
		passport.use({passReqToCallback: true},new LocalStrategy());*/	
		passport.serializeUser(function(user, done) {
	        done(null, user);
	    });
	    passport.deserializeUser(function(user, done) {
	            done(null, user);
	    });

	}

}