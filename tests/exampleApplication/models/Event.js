module.exports= {
	hasEvents:true,
	callHello:function(to){
		this.emit('hello','Hello '+to);
	}
};