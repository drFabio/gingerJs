module.exports= {
	parent:'ginger.mvc.AbstractController',
	saveAction:function(req,res){
		var data=req.query.data;
		this._model.save(data,this._getSendResponse(req,res));
	},
	createAction:function(req,res){
		var data=req.query.data;
		this._model.create(data,this._getSendResponse(req,res));
	},
	updateAction:function(req,res){
		var search=req.query.search;
		var data=req.query.data;
		this._model.update(data,search,this._getSendResponse(req,res));
	},
	updateByIdAction:function(req,res){
		var id=req.query.id;
		var data=req.query.data;
		this._model.updateById(id,data,this._getSendResponse(req,res));
	},
	readAction:function(req,res){
		var search=req.query.search;
		var fields=req.query.fields;
		this._model.read(search,this._getSendResponse(req,res),fields);

	},
	destroyByIdAction:function(req,res){
		var id=req.query.id;
		this._model.destroyById(id,this._getSendResponse(req,res));
	},
	readByIdAction:function(req,res){
		var id=req.query.id;
		var fields=req.query.fields;
		this._model.readById(id,this._getSendResponse(req,res),fields);
	},
	listAction:function(req,res){
		var cb=this._getSendResponse(req,res);
		var limit=req.query.limit;
		var page=req.query.page;
		var search=req.query.search;
		var fields=req.query.fields;
		var options=req.query.options;
		this._model.list(search,limit,page,fields,options,cb);
	}
	
};