module.exports={
	parent:'ginger.mvc.AbstractElement',
	getModel:function(name,var_args){
		return this._engine.getModel.apply(this._engine,arguments);
	}
};