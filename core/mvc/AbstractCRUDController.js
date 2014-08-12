module.exports= {
	parent:'ginger.mvc.AbstractController',

	createAction:function(req,res){
		var data=req.query.data;
		var self=this;
		this._model.create(data,function(err,data){
			self._sendResponse(req,res,err,data);
		});
	},
	_sendResponse:function(req,res,err,data){
			var response;
			if(err){
				res.status(200).send(err);
				return;
			}
			else{
				response=JSON.stringify(data);
			}
			res.status(200).send(response);
	},
	updateAction:function(req,res){
		var search=req.query.search;
		var data=req.query.data;
		var self=this;
		this._model.update(data,search,function(err,data){
			self._sendResponse(req,res,err,data);
		});
	},
	readAction:function(req,res){
		var search=req.query.search;
		var self=this;
		this._model.read(search,function(err,data){
			self._sendResponse(req,res,err,data);
		});

	},
	destroyAction:function(req,res){
		var search=req.query.search;
		var self=this;
		this._model.destroy(search,function(err,data){
			self._sendResponse(req,res,err,data);
		});
	}
	
};