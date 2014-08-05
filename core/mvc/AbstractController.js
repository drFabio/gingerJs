module.exports={
	init: function(engine) {
		console.log("NO MEU INIT "+this._name);
		console.log(arguments);
		this._engine=engine;
	}
};