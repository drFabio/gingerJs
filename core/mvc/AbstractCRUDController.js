module.exports= {
	parent:'ginger.mvc.AbstractController',

	createAction:function(req,res){
		var data=req.query.data;
		var self=this;
		this._model.create(data,this._getSendResponse(req,res));
	},
	updateAction:function(req,res){
		var search=req.query.search;
		var data=req.query.data;
		var self=this;
		this._model.update(data,search,this._getSendResponse(req,res));
	},
	readAction:function(req,res){
		var search=req.query.search;
		var fields=req.query.fields;
		var self=this;
		this._model.read(search,this._getSendResponse(req,res),fields);

	},
	destroyAction:function(req,res){
		var search=req.query.search;
		var self=this;
		this._model.destroy(search,this._getSendResponse(req,res));
	},
	readByIdAction:function(req,res){
		var id=req.query.id;
		var fields=req.query.fields;
		this._model.readById(id,this._getSendResponse(req,res),fields);

	}
	
};