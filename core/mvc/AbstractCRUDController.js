module.exports= {
	parent:'ginger.mvc.AbstractController',

	createAction:function(req,res){
		var data=req.query.data;
		var self=this;
		this._model.create(data,this._getSendResponse(req,res));
	},
	_getSendResponse:function(req,res){
		return function(err,data){
			var response;
			if(err){
				res.status(200).send(err);
				return;
			}
			else{
				response=JSON.stringify(data);
			}
			res.status(200).send(response);
		}
	},
	_sendResponse:function(req,res,err,data){
		this._getSendResponse(req,res)(err,data);
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
		this._model.read(search,fields,this._getSendResponse(req,res));

	},
	destroyAction:function(req,res){
		var search=req.query.search;
		var self=this;
		this._model.destroy(search,this._getSendResponse(req,res));
	}
	
};