module.exports={
	getRouteData:function(controller,action){
		if(controller=='Restricted'  && action !='login' && action !='logout'){
			return {
				middlewares:['EnsureAuthenticated']
			}	
		}
		return this._super(controller,action);
	}

}