module.exports={
	_model:null,
	indexAction:function(req,res){
	
		res.send(200,this._model.sum(req.query.a,req.query.b));
	},
	sumThreeNumbersAction:function(req,res){
		var sumA=this._model.sum(req.query.a,req.query.b)
		res.send(200,this._model.sum(sumA,req.query.c));

	}
};