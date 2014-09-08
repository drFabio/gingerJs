module.exports={
	login:function(username,password,done){
		if(username==='foo' && password==='bar'){
			done(null,{'name':'johnson','email':'johnson@johnson.com'});
			return;
		}
		done(new Error('User not found'));
	}
};