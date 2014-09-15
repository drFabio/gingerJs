module.exports={
	message:null,
	code:'DEFAULT',
	data:null,
	isError:true,
	defaultMessage:'There was an error',
	
	init:function(message,data,code){
		
		if(message){

			this.message=message;
		}
		else{
			this.message=this.defaultMessage;
		}
		if(code){

			this.code=code;
		}
		if(data){

			this.data=data;
		}
	},
	setCode:function(code){
		this.code=code;
	},
	setMessage:function(message){
		this.message=message;
	},
	setData:function(data){
		this.data=data;
	}
}

