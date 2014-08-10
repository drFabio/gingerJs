module.exports={
	inheritsAbstract:true,
	_model:null,
	init: function(engine) {
		this._super(engine);
		this._model=this._engine.getModel('sum.index');
	},
	indexAction:function(req,res){
	
		res.send(200,this._model.sum(req.query.a,req.query.b));
	}
};