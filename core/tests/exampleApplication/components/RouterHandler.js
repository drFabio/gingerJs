module.exports= {
	getRouterData:function(contoller,action){
		if(contoller.toLowerCase()=='restricted'){
			return 		{
				middlewares:['EnsureAuthenticated']
			}	

		}
		return null;
	}
};