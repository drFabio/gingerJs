module.exports={
	getRouteData:function(contoller,action){
		return {
			verb:'get',
			middlewares:[]
		}	
	},
	buildUrl:function(prefix,contoller,action){
		var url= '/'+contoller.replace(/\./g,'/')+'/'+action;
		if(prefix){
			url='/'+prefix+url;
		}
		return url;
	}

}