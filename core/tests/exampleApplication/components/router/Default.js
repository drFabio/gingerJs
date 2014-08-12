module.exports={
	getRouteData:function(controller,action){
		if(controller=='Restricted'){
			return {
				middlewares:['EnsureAuthenticated']
			}	
		}
		return this._super(controller,action);
	}

}