module.exports= {
	parent:'ginger.mvc.AbstractModel',
	init: function(engine) {
		this._super(engine);
		this._dataBase=engine.getComponent('DataBase');

	},
	create:function(data,cb){
;
		this._dataBase.create(this._schemaName,data,cb)
	},
	update:function(){

	},
	destroy:function(){

	}
};