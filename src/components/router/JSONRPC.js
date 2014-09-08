module.exports={
	buildUrl:function(prefix,contoller,action){
		var url= '/'+contoller.replace(/\./g,'/')
		if(prefix){
			url='/'+prefix+url;
		}
		return url;
	}

}