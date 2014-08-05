module.exports={
	helloAction:function(req,res){
		var model=this._engine.getModel('Hello');
		res.send(model.sayHello());
	}
}