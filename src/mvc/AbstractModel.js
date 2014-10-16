module.exports={
	parent:'ginger.mvc.AbstractElement',
	getModel:function(name){
		return this._engine.getModel(name);
	}
};