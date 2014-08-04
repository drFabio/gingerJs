module.exports={
	message:null,
	code:null,
	data:null,
	defaultMessage:'There was an error',
	init:function(data,message,code){
		this.message=message;
		this.code=code;
		this.data=data;
	}
}