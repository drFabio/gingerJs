module.exports={
	inheritsAbstract:true,
	_model:null,
	init: function(engine) {
		this._super(engine);
		this._model=this._engine.getModel('sum/index');
	},
	indexAction:function(req,res){
		req.send(this._model.sum(req.body.a,req.body.b));
	}
};