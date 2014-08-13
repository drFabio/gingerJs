module.exports={
	helloAction:function(req,res){
		res.send('Acessing restricted page');
	},
	loginAction:function(req,res){
		var self=this;
		 if (req.isAuthenticated()) { 
		 	 res.send("success");
		 	 return;
	 	 }
	 	 var authenticationModel=this._engine.getModel('Authentication');
	 	 var authenticationCb=function(err,user){
	 	 	if(err){
	 	 		res.send(self._engine.getError('Forbidden','User name or password invalid'));
	 	 		return;
	 	 	}
	 	 	 req.logIn(user, function(err) {
		      if (err) {
	 	 		res.send(self._engine.getError('Internal','An error ocurred while logging in yser'));
	 	 		return;
		      }

	 	 		res.send(user);
		      return ;
		    });
	 	 	return;
	 	 };
	 	 authenticationModel.login(req.query.user,req.query.password,authenticationCb);
	},
	logoutAction:function(req,res){
		 req.logout();
		 res.send('success');
	}
}