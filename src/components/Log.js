module.exports={
	init:function(engine,params) {
		this._jl=require('jsnlog').JL();
		//Inherited methods
		var inheritedMethods=[
			'debug',
			'error',
			'fatal',
			'fatalException',
			'info',
			'log',
			'trace',
			'warn'
		];
		var self=this;
		inheritedMethods.forEach(function(f){
			self[f]=self._jl[f].bind(self._jl);
		})
	}
}