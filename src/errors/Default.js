var _=require('lodash');
module.exports={
	message:null,
	code:'DEFAULT',
	data:null,
	isError:true,
	defaultMessage:'There was an error',
	
	init:function(message,code,data){

		if(message){
			this.setMessage(message);
		}
		else{
			this.setMessage(this.defaultMessage);
		}
		if(!_.isEmpty(code)){
			this.setCode(code);
		}
		if(data){
			this.setData(data);
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

