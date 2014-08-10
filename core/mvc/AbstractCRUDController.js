module.exports= {
	parent:'ginger.mvc.AbstractController',

	createAction:function(req,res){
		var data=req.query.data;
		this._model.create(data,function(err,data){
			var response;
			if(err){
				response=JSON.stringify(err);

			}
			else{
				response=JSON.stringify(data);
			}
			res.status(200).send(response);
		});
	},
	updateAction:function(req,res){
		var search=req.query.search;
		var data=req.query.data;
		this._model.update(data,search,function(err,data){
			var response;
			if(err){
				response=JSON.stringify(err);

			}
			else{
				response=JSON.stringify(data);
			}
			res.status(200).send(response);
		});
	},
	readAction:function(req,res){
		var search=req.query.search;
		this._model.read(search,function(err,data){
			var response;
			if(err){
				response=JSON.stringify(err);

			}
			else{
				response=JSON.stringify(data);
			}
			res.status(200).send(response);
		});

	},
	destroyAction:function(req,res){
		var search=req.query.search;
		this._model.destroy(search,function(err,data){
			var response;
			if(err){
				response=JSON.stringify(err);

			}
			else{
				response=JSON.stringify(data);
			}
			res.status(200).send(response);
		});
	}
	
};